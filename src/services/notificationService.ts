import { supabase } from '@/integrations/supabase/client';
import { NOTIFICATION_CONFIG, generateMakePayload, type MakeWebhookData } from '@/config/notifications';

export interface NotificationRecord {
  id: string;
  reserva_id: string;
  tipo: 'nueva_reserva' | 'recordatorio' | 'comprobante';
  estado: 'pendiente' | 'enviado' | 'fallido';
  fecha_envio?: string;
  intentos: number;
  ultimo_error?: string;
  webhook_response?: any;
  created_at: string;
}

export class NotificationService {
  private static instance: NotificationService;
  
  public static getInstance(): NotificationService {
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

  // Registrar notificación en base de datos
  private async registrarNotificacion(
    reservaId: string,
    tipo: string,
    estado: string,
    intentos: number,
    error?: string,
    response?: any
  ): Promise<void> {
    try {
      await supabase
        .from('notificaciones')
        .insert([{
          reserva_id: reservaId,
          tipo,
          estado,
          intentos,
          ultimo_error: error,
          webhook_response: response,
          fecha_envio: estado === 'enviado' ? new Date().toISOString() : null
        }]);
    } catch (dbError) {
      console.error('Error registrando notificación:', dbError);
    }
  }

  // Enviar confirmación de nueva reserva
  async enviarConfirmacionReserva(reserva: any): Promise<boolean> {
    const payload = generateMakePayload(reserva, 'nueva_reserva');
    return await this.sendWebhookToMake(payload);
  }

  // Enviar recordatorio de cita
  async enviarRecordatorio(reserva: any): Promise<boolean> {
    const payload = generateMakePayload(reserva, 'recordatorio');
    return await this.sendWebhookToMake(payload);
  }

  // Enviar comprobante de pago
  async enviarComprobantePago(reserva: any, pagoData: any): Promise<boolean> {
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

  // Verificar estado de notificaciones pendientes
  async verificarNotificacionesPendientes(): Promise<NotificationRecord[]> {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('estado', 'pendiente')
        .lt('intentos', 3)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo notificaciones pendientes:', error);
      return [];
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

  // Obtener estadísticas de notificaciones
  async obtenerEstadisticas(): Promise<{
    total: number;
    enviadas: number;
    fallidas: number;
    pendientes: number;
    ultimaEjecucion?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .select('estado, created_at');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        enviadas: data?.filter(n => n.estado === 'enviado').length || 0,
        fallidas: data?.filter(n => n.estado === 'fallido').length || 0,
        pendientes: data?.filter(n => n.estado === 'pendiente').length || 0,
        ultimaEjecucion: data?.[0]?.created_at
      };

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { total: 0, enviadas: 0, fallidas: 0, pendientes: 0 };
    }
  }
}

// Instancia singleton
export const notificationService = NotificationService.getInstance(); 