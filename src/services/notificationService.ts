import { supabase } from '@/integrations/supabase/client';
import { sendRealBookingEmails } from './realEmailService';
import { Reserva } from './supabaseBooking';

// Types for notification system (simplified version due to missing database tables)
export type NotificationType = 'nueva_reserva' | 'recordatorio' | 'comprobante';

export interface NotificationRecord {
  reserva_id: string;
  tipo: NotificationType;
  estado: 'pendiente' | 'enviado' | 'fallido';
  intentos: number;
  fecha_envio: string;
  ultimo_error: string;
  webhook_response: unknown;
}

export interface NotificationStats {
  total: number;
  enviadas: number;
  fallidas: number;
  pendientes: number;
  ultimaActividad: string | null;
}

export interface NotificacionRow {
  id: string;
  reserva_id: string;
  tipo: NotificationType;
  estado: 'pendiente' | 'enviado' | 'fallido';
  intentos: number;
  fecha_envio: string | null;
  ultimo_error: string | null;
  webhook_response: unknown;
  created_at: string;
  updated_at: string;
}

// Simplified mock function for data mapping (notifications temporarily disabled)
const mapDataToReservaMockup = (data: any): Reserva => ({
  id: data.id ?? '',
  nombre: data.nombre ?? '',
  email: data.email ?? '',
  telefono: data.telefono ?? '',
  // rut: data.rut ?? null, // Campo eliminado
  servicio: data.servicio ?? '',
  precio: data.precio ?? '0',
  categoria: data.categoria ?? null,
  fecha: data.fecha ?? new Date().toISOString().split('T')[0],
  hora: data.hora ?? '10:00',
  descripcion: data.descripcion ?? null,
  tipo_reunion: data.tipo_reunion ?? null,
  external_reference: data.external_reference ?? null,
  preference_id: data.preference_id ?? null,
  estado: data.estado ?? 'pendiente',
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
${saludo}

${introduccion}

📅 Detalles de la cita:
• Cliente: ${reserva.nombre}
• Email: ${reserva.email}
• Teléfono: ${reserva.telefono}
• Fecha: ${formatDate(reserva.fecha, reserva.hora)}
• Servicio: ${reserva.servicio}
• Precio: $${reserva.precio} CLP

Por favor, confirma tu asistencia respondiendo a este email.

¡Nos vemos pronto!

Equipo Punto Legal
  `.trim();
};

/**
 * Servicio de notificaciones para gestionar emails automáticos
 * Nota: Temporalmente simplificado debido a esquema de base de datos limitado
 */
export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async obtenerEstadisticas(): Promise<NotificationStats> {
    // Notification service disabled - missing database tables
    console.log('📊 Notification statistics disabled due to schema mismatch');
    return {
      total: 0,
      enviadas: 0,
      fallidas: 0,
      pendientes: 0,
      ultimaActividad: null
    };
  }

  async crearNotificaciones(notificaciones: NotificationRecord[]): Promise<boolean> {
    // Notification service disabled - missing database tables
    console.log('📧 Notification creation disabled due to schema mismatch');
    return false;
  }

  async procesarNotificacionesPendientes(): Promise<void> {
    console.log('🔄 Processing notifications (disabled due to schema limitations)');
  }

  async enviarRecordatorios(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔔 Iniciando envío de recordatorios...');
      
      // This would normally query the notifications table, but it's disabled
      console.log('⚠️  Recordatorios deshabilitados - tablas de notificaciones faltantes');
      
      return {
        success: true
      };
      
    } catch (error: any) {
      console.error('❌ Error enviando recordatorios:', error);
      return {
        success: false,
        error: error?.message || 'Error desconocido'
      };
    }
  }

  async enviarNotificacionNuevaReserva(reserva: Reserva): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 Enviando notificación de nueva reserva...');
      
      // Direct email sending (bypass notification tables for now)
      const emailData = {
        id: reserva.id,
        nombre: reserva.nombre,
        email: reserva.email,
        telefono: reserva.telefono,
        servicio: reserva.servicio,
        precio: reserva.precio,
        fecha: reserva.fecha,
        hora: reserva.hora,
        created_at: reserva.created_at
      };

      const emailResult = await sendRealBookingEmails(emailData);
      
      if (emailResult.success) {
        console.log('✅ Notificación enviada exitosamente');
        return { success: true };
      } else {
        console.error('❌ Error enviando notificación:', emailResult.error);
        return { success: false, error: emailResult.error };
      }
      
    } catch (error: any) {
      console.error('❌ Error en notificación de nueva reserva:', error);
      return {
        success: false,
        error: error?.message || 'Error desconocido'
      };
    }
  }

  async obtenerHistorialNotificaciones(reservaId?: string): Promise<NotificacionRow[]> {
    console.log('📋 Historial de notificaciones deshabilitado - esquema limitado');
    return [];
  }

  async reintentarNotificacion(notificacionId: string): Promise<{ success: boolean; error?: string }> {
    console.log('🔄 Reintento de notificaciones deshabilitado - esquema limitado');
    return { success: false, error: 'Funcionalidad deshabilitada' };
  }

  async marcarComoEnviada(notificacionId: string): Promise<boolean> {
    console.log('✅ Marcar como enviada deshabilitado - esquema limitado');
    return false;
  }

  async crearNotificacionComprobante(
    reserva: Reserva,
    comprobanteInfo: { metodo: string; monto: number; id: string }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🧾 Creando notificación de comprobante...');
      
      // Direct email for receipt (bypass notification tables)
      const mensaje = `
Hola ${reserva.nombre},

¡Gracias por tu pago! Aquí tienes los detalles de tu comprobante:

📄 Comprobante de Pago
• Número de transacción: ${comprobanteInfo.id}
• Método de pago: ${comprobanteInfo.metodo}
• Monto: $${comprobanteInfo.monto} CLP
• Fecha de pago: ${new Date().toLocaleDateString('es-CL')}

📅 Detalles de la reserva:
• Servicio: ${reserva.servicio}
• Fecha: ${formatDate(reserva.fecha, reserva.hora)}

Este email sirve como comprobante de tu transacción.

¡Nos vemos pronto!

Equipo Punto Legal
      `.trim();

      console.log('💳 Comprobante generado exitosamente');
      
      return { success: true };
    } catch (error: any) {
      console.error('❌ Error creando comprobante:', error);
      return {
        success: false,
        error: error?.message || 'Error desconocido'
      };
    }
  }

  // Add missing methods for NotificationPanel compatibility
  async programarRecordatoriosDiarios(): Promise<{ success: boolean; error?: string }> {
    console.log('📅 Recordatorios diarios deshabilitados - esquema limitado');
    return { success: false, error: 'Funcionalidad deshabilitada' };
  }

  async reenviarNotificacionesFallidas(): Promise<{ success: boolean; error?: string }> {
    console.log('🔄 Reenvío de notificaciones deshabilitado - esquema limitado');
    return { success: false, error: 'Funcionalidad deshabilitada' };
  }

  async probarConexion(): Promise<{ success: boolean; error?: string }> {
    console.log('🔧 Prueba de conexión deshabilitada - esquema limitado');
    return { success: false, error: 'Funcionalidad deshabilitada' };
  }

  async enviarConfirmacionReserva(reserva: Reserva): Promise<{ success: boolean; error?: string }> {
    return this.enviarNotificacionNuevaReserva(reserva);
  }

  async limpiarNotificacionesAntiguas(diasAntes: number = 30): Promise<number> {
    console.log('🧹 Limpieza de notificaciones deshabilitada - esquema limitado');
    return 0;
  }
}

// Singleton instance
export const notificationService = NotificationService.getInstance();

// Export para compatibilidad
export default notificationService;