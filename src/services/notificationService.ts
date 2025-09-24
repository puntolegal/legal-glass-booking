import { supabase } from '@/integrations/supabase/client';
import { NOTIFICATION_CONFIG, type NotificationType } from '@/config/notifications';
import { sendBookingEmailsDirect, sendResendEmail } from '@/services/emailService';
import type { Reserva } from './supabaseBooking';
import { addDaysLocalYmd } from '@/lib/dates';

interface NotificationStats {
  total: number;
  enviadas: number;
  fallidas: number;
  pendientes: number;
  ultimaEjecucion?: string;
}

interface NotificacionRow {
  id: string;
  reserva_id: string;
  tipo: NotificationType;
  estado: 'pendiente' | 'enviado' | 'fallido';
  intentos: number;
  fecha_envio: string | null;
  ultimo_error: string | null;
  webhook_response?: unknown;
  created_at?: string;
}

interface PagoData {
  monto: number;
  metodo?: string;
  id?: string;
  fecha?: string;
}

const mapReserva = (data: Partial<Reserva>): Reserva => ({
  id: data.id ?? '',
  nombre: data.nombre ?? '',
  email: data.email ?? '',
  telefono: data.telefono ?? '',
  rut: data.rut ?? null,
  servicio: data.servicio ?? '',
  precio: data.precio ?? '0',
  categoria: data.categoria ?? null,
  fecha: data.fecha ?? new Date().toISOString().split('T')[0],
  hora: data.hora ?? '10:00',
  descripcion: data.descripcion ?? null,
  pago_metodo: data.pago_metodo ?? null,
  pago_estado: data.pago_estado ?? null,
  pago_id: data.pago_id ?? null,
  pago_monto: data.pago_monto ?? null,
  tipo_reunion: data.tipo_reunion ?? null,
  external_reference: data.external_reference ?? null,
  preference_id: data.preference_id ?? null,
  estado: data.estado ?? 'pendiente',
  email_enviado: data.email_enviado ?? false,
  recordatorio_enviado: data.recordatorio_enviado ?? false,
  created_at: data.created_at ?? new Date().toISOString(),
  updated_at: data.updated_at ?? new Date().toISOString()
});

const formatDate = (fecha: string, hora?: string) => {
  const date = hora ? new Date(`${fecha}T${hora}`) : new Date(fecha);
  return date.toLocaleString('es-CL', { timeZone: 'America/Santiago' });
};

const buildReminderEmail = (reserva: Reserva, destinatario: 'cliente' | 'admin'): string => {
  const saludo = destinatario === 'cliente'
    ? `Hola ${reserva.nombre},`
    : 'Hola equipo Punto Legal,';

  const introduccion = destinatario === 'cliente'
    ? 'Queremos recordarte tu consulta jurídica agendada para mañana.'
    : `Recordatorio automático de la consulta de ${reserva.nombre}.`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; color: #1f2933; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px; }
          .header { text-align: center; padding-bottom: 16px; border-bottom: 1px solid #d9e2ec; }
          .header h1 { margin: 0; color: #334155; }
          .info { background: #fff; padding: 16px; border-radius: 10px; margin-top: 24px; border: 1px solid #d9e2ec; }
          .info p { margin: 6px 0; }
          .footer { margin-top: 24px; font-size: 13px; color: #52606d; text-align: center; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: #fff; border-radius: 999px; text-decoration: none; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Recordatorio de Consulta</h1>
            <p>${NOTIFICATION_CONFIG.empresa.nombre}</p>
          </div>
          <p>${saludo}</p>
          <p>${introduccion}</p>
          <div class="info">
            <p><strong>Servicio:</strong> ${reserva.servicio}</p>
            <p><strong>Fecha:</strong> ${formatDate(reserva.fecha, reserva.hora)}</p>
            <p><strong>Modalidad:</strong> ${reserva.tipo_reunion === 'presencial' ? 'Presencial' : 'Online'}</p>
            <p><strong>Precio:</strong> $${Number(reserva.precio || 0).toLocaleString('es-CL')}</p>
            ${reserva.descripcion ? `<p><strong>Detalle:</strong> ${reserva.descripcion}</p>` : ''}
          </div>
          ${destinatario === 'cliente'
            ? `<a class="button" href="https://puntolegal.online" target="_blank" rel="noreferrer">Ver detalles</a>`
            : ''}
          <p class="footer">${NOTIFICATION_CONFIG.empresa.email} · ${NOTIFICATION_CONFIG.empresa.telefono}</p>
        </div>
      </body>
    </html>
  `;
};

const buildReceiptEmail = (reserva: Reserva, pago: PagoData): string => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, sans-serif; background: #f9fafb; color: #111827; }
        .container { max-width: 640px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 16px; }
        h1 { color: #16a34a; }
        .section { margin-top: 24px; }
        .section h2 { font-size: 18px; margin-bottom: 12px; }
        .row { display: flex; justify-content: space-between; margin: 6px 0; }
        .footer { margin-top: 32px; font-size: 12px; color: #6b7280; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ Pago confirmado</h1>
        <p>Hola ${reserva.nombre},</p>
        <p>Hemos registrado tu pago correctamente. A continuación encontrarás el detalle de tu comprobante:</p>
        <div class="section">
          <h2>Detalle de la consulta</h2>
          <div class="row"><span>Servicio</span><span>${reserva.servicio}</span></div>
          <div class="row"><span>Fecha</span><span>${formatDate(reserva.fecha, reserva.hora)}</span></div>
          <div class="row"><span>Modalidad</span><span>${reserva.tipo_reunion === 'presencial' ? 'Presencial' : 'Online'}</span></div>
        </div>
        <div class="section">
          <h2>Detalle de pago</h2>
          <div class="row"><span>Monto</span><span>$${Number(pago.monto).toLocaleString('es-CL')}</span></div>
          ${pago.metodo ? `<div class="row"><span>Método</span><span>${pago.metodo}</span></div>` : ''}
          ${pago.id ? `<div class="row"><span>ID de transacción</span><span>${pago.id}</span></div>` : ''}
          ${pago.fecha ? `<div class="row"><span>Fecha de pago</span><span>${formatDate(pago.fecha)}</span></div>` : ''}
        </div>
        <div class="footer">
          ${NOTIFICATION_CONFIG.empresa.nombre} · ${NOTIFICATION_CONFIG.empresa.email} · ${NOTIFICATION_CONFIG.empresa.telefono}
        </div>
      </div>
    </body>
  </html>
`;

class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async obtenerEstadisticas(): Promise<NotificationStats> {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('estado, fecha_envio')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }

    const total = data?.length ?? 0;
    const enviadas = data?.filter((item) => item.estado === 'enviado').length ?? 0;
    const fallidas = data?.filter((item) => item.estado === 'fallido').length ?? 0;
    const pendientes = data?.filter((item) => item.estado === 'pendiente').length ?? 0;
    const ultimaEjecucion = data?.find((item) => item.estado === 'enviado' && item.fecha_envio)?.fecha_envio ?? undefined;

    return { total, enviadas, fallidas, pendientes, ultimaEjecucion };
  }

  private async registrarNotificacion(
    reservaId: string,
    tipo: NotificationType,
    estado: 'pendiente' | 'enviado' | 'fallido',
    intentos: number,
    error?: string | null,
    respuesta?: unknown
  ): Promise<void> {
    const payload = {
      reserva_id: reservaId,
      tipo,
      estado,
      intentos,
      fecha_envio: estado === 'enviado' ? new Date().toISOString() : null,
      ultimo_error: error ?? null,
      webhook_response: respuesta ?? null
    };

    const { error: insertError } = await supabase
      .from('notificaciones')
      .insert([payload]);

    if (insertError) {
      console.error('Error registrando notificación:', insertError);
    }
  }

  private async resolverReserva(reserva: Reserva | string): Promise<Reserva | null> {
    if (typeof reserva !== 'string') {
      return reserva;
    }

    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', reserva)
      .single();

    if (error || !data) {
      console.error('Reserva no encontrada para notificación:', error);
      return null;
    }

    return mapReserva(data);
  }

  async enviarConfirmacionReserva(reservaEntrada: Reserva | string): Promise<boolean> {
    const reserva = await this.resolverReserva(reservaEntrada);
    if (!reserva) {
      return false;
    }

    const emailResult = await sendBookingEmailsDirect({
      id: reserva.id,
      nombre: reserva.nombre,
      email: reserva.email,
      telefono: reserva.telefono,
      rut: reserva.rut || 'No especificado',
      servicio: reserva.servicio,
      precio: String(reserva.precio ?? ''),
      fecha: reserva.fecha,
      hora: reserva.hora,
      tipo_reunion: reserva.tipo_reunion || 'online',
      descripcion: reserva.descripcion || undefined
    });

    if (emailResult.success) {
      await this.registrarNotificacion(reserva.id, 'confirmacion_cliente', 'enviado', 1, null, emailResult.clientEmail);
      await this.registrarNotificacion(reserva.id, 'confirmacion_admin', 'enviado', 1, null, emailResult.adminEmail);

      await supabase
        .from('reservas')
        .update({ email_enviado: true, updated_at: new Date().toISOString() })
        .eq('id', reserva.id);

      return true;
    }

    await this.registrarNotificacion(reserva.id, 'confirmacion_cliente', 'fallido', 1, emailResult.error ?? 'Error enviando confirmación');
    return false;
  }

  async enviarRecordatorio(reservaEntrada: Reserva | string): Promise<boolean> {
    const reserva = await this.resolverReserva(reservaEntrada);
    if (!reserva) {
      return false;
    }

    const emailCliente = await sendResendEmail({
      to: reserva.email,
      subject: NOTIFICATION_CONFIG.recordatorio.asunto,
      html: buildReminderEmail(reserva, 'cliente')
    });

    const emailAdmin = await sendResendEmail({
      to: NOTIFICATION_CONFIG.email.admin,
      subject: `🔔 Recordatorio agendado - ${reserva.nombre}`,
      html: buildReminderEmail(reserva, 'admin')
    });

    const exito = emailCliente.success && emailAdmin.success;

    await this.registrarNotificacion(
      reserva.id,
      'recordatorio_cliente',
      emailCliente.success ? 'enviado' : 'fallido',
      1,
      emailCliente.error,
      emailCliente
    );

    await this.registrarNotificacion(
      reserva.id,
      'recordatorio_admin',
      emailAdmin.success ? 'enviado' : 'fallido',
      1,
      emailAdmin.error,
      emailAdmin
    );

    if (exito) {
      await supabase
        .from('reservas')
        .update({ recordatorio_enviado: true, updated_at: new Date().toISOString() })
        .eq('id', reserva.id);
    }

    return exito;
  }

  async enviarComprobante(reservaEntrada: Reserva | string, pago: PagoData): Promise<boolean> {
    const reserva = await this.resolverReserva(reservaEntrada);
    if (!reserva) {
      return false;
    }

    const emailClient = await sendResendEmail({
      to: reserva.email,
      subject: NOTIFICATION_CONFIG.comprobante.asunto,
      html: buildReceiptEmail(reserva, pago)
    });

    await this.registrarNotificacion(
      reserva.id,
      'comprobante_pago',
      emailClient.success ? 'enviado' : 'fallido',
      1,
      emailClient.error,
      emailClient
    );

    return emailClient.success;
  }

  async verificarNotificacionesPendientes(): Promise<NotificacionRow[]> {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('estado', 'fallido')
      .lt('intentos', 3)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error buscando notificaciones pendientes:', error);
      return [];
    }

    return (data || []) as NotificacionRow[];
  }

  async programarRecordatoriosDiarios(): Promise<{ enviados: number; errores: number }> {
    const fechaObjetivo = addDaysLocalYmd(1); // mañana en America/Santiago

    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('fecha', fechaObjetivo)
      .in('estado', ['pendiente', 'confirmada'])
      .eq('recordatorio_enviado', false);

    if (error) {
      console.error('Error obteniendo reservas para recordatorio:', error);
      return { enviados: 0, errores: 1 };
    }

    if (!data || data.length === 0) {
      return { enviados: 0, errores: 0 };
    }

    let enviados = 0;
    let errores = 0;

    for (const row of data) {
      const reserva = mapReserva(row);
      try {
        const exito = await this.enviarRecordatorio(reserva);
        if (exito) {
          enviados += 1;
        } else {
          errores += 1;
        }
      } catch (errorEnvio) {
        console.error('Error enviando recordatorio:', errorEnvio);
        errores += 1;
      }
    }

    return { enviados, errores };
  }

  async reenviarNotificacionesFallidas(): Promise<{ procesadas: number; exitosas: number }> {
    const pendientes = await this.verificarNotificacionesPendientes();
    let procesadas = 0;
    let exitosas = 0;

    for (const notificacion of pendientes) {
      try {
        const reserva = await this.resolverReserva(notificacion.reserva_id);
        if (!reserva) {
          procesadas += 1;
          continue;
        }

        let exito = false;
        switch (notificacion.tipo) {
          case 'confirmacion_cliente':
          case 'confirmacion_admin':
            exito = await this.enviarConfirmacionReserva(reserva);
            break;
          case 'recordatorio_cliente':
          case 'recordatorio_admin':
            exito = await this.enviarRecordatorio(reserva);
            break;
          case 'comprobante_pago':
            if (reserva.pago_monto) {
              exito = await this.enviarComprobante(reserva, {
                monto: reserva.pago_monto,
                metodo: reserva.pago_metodo ?? undefined,
                id: reserva.pago_id ?? undefined
              });
            }
            break;
        }

        if (exito) {
          exitosas += 1;
        }
        procesadas += 1;
      } catch (error) {
        console.error('Error reenviando notificación:', error);
        procesadas += 1;
      }
    }

    return { procesadas, exitosas };
  }

  async probarConexion(): Promise<{ success: boolean; message: string }> {
    try {
      const testResult = await sendResendEmail({
        to: NOTIFICATION_CONFIG.email.testRecipient || NOTIFICATION_CONFIG.email.admin,
        subject: '🔧 Test de conexión - Sistema de Notificaciones',
        html: '<p>Prueba automática del sistema de notificaciones de Punto Legal.</p>'
      });

      if (testResult.success) {
        return { success: true, message: '✅ Conexión exitosa con Resend (email de prueba enviado)' };
      }

      return {
        success: false,
        message: `❌ Error enviando email de prueba: ${testResult.error || 'Desconocido'}`
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Error de conexión: ${error instanceof Error ? error.message : 'Desconocido'}`
      };
    }
  }
}

export const notificationService = NotificationService.getInstance();
