import { supabase } from '@/integrations/supabase/client';
import { NOTIFICATION_CONFIG, generateMakePayload, MakeWebhookData } from '@/config/notifications';

export class NotificationService {
  private static instance: NotificationService;
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Enviar webhook a Make con reintentos automáticos
  async sendWebhookToMake(payload: MakeWebhookData, maxRetries = 3): Promise<boolean> {
    let lastError: Error | null = null;
    
    for (let intento = 1; intento <= maxRetries; intento++) {
      try {
        console.log(`Enviando webhook a Make (intento ${intento}/${maxRetries}):`, payload.tipo_evento);
        
        const response = await fetch(NOTIFICATION_CONFIG.makeWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'PuntoLegal-WebhookSender/1.0'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json().catch(() => ({}));
        
        console.log(`✅ Webhook enviado exitosamente para reserva ${payload.reserva.id}`);
        
        // Registrar éxito
        await this.registrarNotificacion(
          payload.reserva.id,
          payload.tipo_evento,
          'enviado',
          intento,
          null,
          responseData
        );
        
        return true;
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Error en intento ${intento}:`, lastError.message);
        
        if (intento === maxRetries) {
          // Registrar fallo final
          await this.registrarNotificacion(
            payload.reserva.id,
            payload.tipo_evento,
            'fallido',
            intento,
            lastError.message
          );
        } else {
          // Esperar antes del siguiente intento (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, intento) * 1000));
        }
      }
    }
    
    return false;
  }

  // Registrar notificación en la base de datos
  private async registrarNotificacion(
    reservaId: string,
    tipo: string,
    estado: 'pendiente' | 'enviado' | 'fallido',
    intentos: number,
    error?: string | null,
    respuesta?: any
  ): Promise<void> {
    try {
      await supabase
        .from('notificaciones')
        .insert([{
          reserva_id: reservaId,
          tipo,
          estado,
          intentos,
          fecha_envio: estado === 'enviado' ? new Date().toISOString() : null,
          ultimo_error: error,
          webhook_response: respuesta
        }]);
    } catch (error) {
      console.error('Error registrando notificación:', error);
    }
  }

  // Verificar notificaciones pendientes
  async verificarNotificacionesPendientes(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('estado', 'fallido')
        .lt('intentos', 3)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error verificando notificaciones pendientes:', error);
      return [];
    }
  }

  // Enviar confirmación de nueva reserva (incluye Google Calendar y notificación al abogado)
  async enviarConfirmacionReserva(reserva: any): Promise<boolean> {
    try {
      // 1. Enviar confirmación al cliente
      const payloadCliente = generateMakePayload(reserva, 'nueva_reserva');
      const exitoCliente = await this.sendWebhookToMake(payloadCliente);
      
      // 2. Enviar notificación al abogado
      const payloadAbogado = generateMakePayload(reserva, 'notificacion_abogado');
      const exitoAbogado = await this.sendWebhookToMake(payloadAbogado);
      
      console.log(`Confirmación cliente: ${exitoCliente ? '✅' : '❌'}, Abogado: ${exitoAbogado ? '✅' : '❌'}`);
      
      return exitoCliente && exitoAbogado;
    } catch (error) {
      console.error('Error enviando confirmación de reserva:', error);
      return false;
    }
  }

  // Enviar recordatorio (incluye Google Meet)
  async enviarRecordatorio(reserva: any): Promise<boolean> {
    try {
      // 1. Enviar recordatorio al cliente
      const payloadCliente = generateMakePayload(reserva, 'recordatorio');
      const exitoCliente = await this.sendWebhookToMake(payloadCliente);
      
      // 2. Enviar recordatorio al abogado
      const payloadAbogado = generateMakePayload(reserva, 'recordatorio_abogado');
      const exitoAbogado = await this.sendWebhookToMake(payloadAbogado);
      
      console.log(`Recordatorio cliente: ${exitoCliente ? '✅' : '❌'}, Abogado: ${exitoAbogado ? '✅' : '❌'}`);
      
      return exitoCliente && exitoAbogado;
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
      return false;
    }
  }

  // Enviar comprobante de pago
  async enviarComprobante(reserva: any, pagoData: any): Promise<boolean> {
    const payload = generateMakePayload(reserva, 'comprobante', pagoData);
    return await this.sendWebhookToMake(payload);
  }

  // Programar recordatorios automáticos para mañana
  async programarRecordatoriosDiarios(): Promise<{enviados: number, errores: number}> {
    try {
      const mañana = new Date();
      mañana.setDate(mañana.getDate() + 1);
      mañana.setHours(0, 0, 0, 0);
      
      const mañanaStr = mañana.toISOString().split('T')[0];
      
      console.log(`🔄 Programando recordatorios para: ${mañanaStr}`);

      // Obtener citas de mañana que necesitan recordatorio
      const { data: reservas, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('fecha', mañanaStr)
        .in('estado', ['pendiente', 'confirmada'])
        .is('recordatorio_enviado', false);

      if (error) {
        console.error('Error obteniendo reservas:', error);
        return { enviados: 0, errores: 1 };
      }

      if (!reservas || reservas.length === 0) {
        console.log('📭 No hay citas para mañana que requieran recordatorio');
        return { enviados: 0, errores: 0 };
      }

      let enviados = 0;
      let errores = 0;

      // Procesar cada reserva
      for (const reserva of reservas) {
        try {
          console.log(`📧 Enviando recordatorio para: ${reserva.nombre} - ${reserva.hora}`);
          
          const exito = await this.enviarRecordatorio(reserva);
          
          if (exito) {
            // Marcar como recordatorio enviado
            await supabase
              .from('reservas')
              .update({ 
                recordatorio_enviado: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', reserva.id);
            
            enviados++;
            console.log(`✅ Recordatorio enviado a: ${reserva.email}`);
          } else {
            errores++;
            console.log(`❌ Error enviando recordatorio a: ${reserva.email}`);
          }
          
          // Pequeña pausa entre envíos
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`Error procesando reserva ${reserva.id}:`, error);
          errores++;
        }
      }

      console.log(`✨ Proceso completado: ${enviados} enviados, ${errores} errores`);
      return { enviados, errores };
      
    } catch (error) {
      console.error('Error en programarRecordatoriosDiarios:', error);
      return { enviados: 0, errores: 1 };
    }
  }

  // Reenviar notificaciones fallidas
  async reenviarNotificacionesFallidas(): Promise<{procesadas: number, exitosas: number}> {
    const pendientes = await this.verificarNotificacionesPendientes();
    let procesadas = 0;
    let exitosas = 0;

    for (const notificacion of pendientes) {
      try {
        // Obtener datos de la reserva
        const { data: reserva, error } = await supabase
          .from('reservas')
          .select('*')
          .eq('id', notificacion.reserva_id)
          .single();

        if (error || !reserva) {
          console.error(`Reserva no encontrada: ${notificacion.reserva_id}`);
          continue;
        }

        // Reenviar según el tipo
        let exito = false;
        switch (notificacion.tipo) {
          case 'nueva_reserva':
            exito = await this.enviarConfirmacionReserva(reserva);
            break;
          case 'recordatorio':
            exito = await this.enviarRecordatorio(reserva);
            break;
          case 'notificacion_abogado':
            const payloadAbogado = generateMakePayload(reserva, 'notificacion_abogado');
            exito = await this.sendWebhookToMake(payloadAbogado);
            break;
          case 'recordatorio_abogado':
            const payloadRecordatorioAbogado = generateMakePayload(reserva, 'recordatorio_abogado');
            exito = await this.sendWebhookToMake(payloadRecordatorioAbogado);
            break;
          case 'comprobante':
            // Necesitaríamos datos de pago adicionales
            break;
        }

        if (exito) {
          exitosas++;
        }
        procesadas++;

      } catch (error) {
        console.error(`Error reenviando notificación ${notificacion.id}:`, error);
        procesadas++;
      }
    }

    return { procesadas, exitosas };
  }

  // Probar conexión con Make
  async probarConexion(): Promise<{success: boolean, message: string}> {
    try {
      const testPayload = {
        tipo_evento: 'test',
        timestamp: new Date().toISOString(),
        empresa: NOTIFICATION_CONFIG.empresa,
        reserva: {
          id: 'test-' + Date.now(),
          nombre: 'Test Usuario',
          email: 'test@puntolegal.cl',
          telefono: '+56912345678',
          fecha: new Date().toISOString().split('T')[0],
          hora: '15:00',
          servicio: 'Test Service',
          precio: '50000',
          categoria: 'test'
        },
        configuracion: {
          enviar_recordatorio: false,
          enviar_comprobante: false,
          crear_calendar_event: false,
          crear_meet_link: false,
          notificar_abogado: false,
          idioma: 'es',
          zona_horaria: 'America/Santiago'
        }
      };

      const response = await fetch(NOTIFICATION_CONFIG.makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PuntoLegal-WebhookSender/1.0'
        },
        body: JSON.stringify(testPayload)
      });

      if (response.ok) {
        return {
          success: true,
          message: '✅ Conexión exitosa con Make.com'
        };
      } else {
        return {
          success: false,
          message: `❌ Error HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `❌ Error de conexión: ${error.message}`
      };
    }
  }
}

// Instancia singleton
export const notificationService = NotificationService.getInstance(); 