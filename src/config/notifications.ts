// Configuración de notificaciones y webhook de Make.com
export const NOTIFICATION_CONFIG = {
  // URL del webhook de Make.com - Reemplaza con tu URL real
  makeWebhookUrl: import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.us2.make.com/scumvnivb2vsxlb3xb68ogdjwd32zvm9',
  
  // Configuración de la empresa
  empresa: {
    nombre: 'Punto Legal',
    email: 'puntolegalelgolf@gmail.com',
    telefono: '+56962321883',
    whatsapp: 'https://wa.me/56962321883',
    logo: 'https://punto-legal.cl/logo.png',
    direccion: 'El Golf, Las Condes, Santiago',
    website: 'https://punto-legal.cl'
  },
  
  // Configuración de Google Calendar
  google: {
    calendarId: 'primary',
    timeZone: 'America/Santiago',
    meetingDuration: 60,
    autoCreateMeet: true
  },
  
  // Configuración de recordatorios
  recordatorio: {
    horasAntes: 24,
    asunto: '🔔 Recordatorio: Tu cita con Punto Legal es mañana'
  },
  
  // Configuración de comprobantes
  comprobante: {
    asunto: '✅ Comprobante de pago - Punto Legal',
    envioAutomatico: true
  },
  
  // Configuración del abogado
  abogado: {
    email: 'puntolegalelgolf@gmail.com',
    asunto: '📅 Nueva cita agendada - Punto Legal',
    asuntoRecordatorio: '🔔 Recordatorio: Cita mañana - Punto Legal'
  }
};

// Templates para los emails que se enviarán por Make
export const EMAIL_TEMPLATES = {
  nuevaReserva: {
    asunto: '✅ Confirmación de cita - Punto Legal',
    variables: [
      'nombre_cliente',
      'fecha_cita',
      'hora_cita',
      'servicio',
      'precio',
      'categoria',
      'telefono_cliente',
      'email_cliente',
      'google_meet_link',
      'descripcion_consulta'
    ]
  },
  
  recordatorio: {
    asunto: '🔔 Recordatorio: Tu cita con Punto Legal es mañana',
    variables: [
      'nombre_cliente',
      'fecha_cita',
      'hora_cita',
      'servicio',
      'direccion_oficina',
      'telefono_contacto',
      'enlace_reagendar',
      'enlace_cancelar',
      'google_meet_link',
      'descripcion_consulta'
    ]
  },
  
  comprobante: {
    asunto: '💰 Comprobante de pago - Punto Legal',
    variables: [
      'nombre_cliente',
      'numero_comprobante',
      'fecha_pago',
      'monto_pagado',
      'servicio',
      'metodo_pago',
      'numero_transaccion'
    ]
  },

  notificacionAbogado: {
    asunto: '📅 Nueva cita agendada - Punto Legal',
    variables: [
      'nombre_cliente',
      'fecha_cita',
      'hora_cita',
      'servicio',
      'precio',
      'categoria',
      'telefono_cliente',
      'email_cliente',
      'descripcion_consulta',
      'google_meet_link',
      'google_calendar_link'
    ]
  },

  recordatorioAbogado: {
    asunto: '🔔 Recordatorio: Cita mañana - Punto Legal',
    variables: [
      'nombre_cliente',
      'fecha_cita',
      'hora_cita',
      'servicio',
      'descripcion_consulta',
      'google_meet_link',
      'telefono_cliente',
      'email_cliente'
    ]
  }
};

// Estructura de datos para Make.com
export interface MakeWebhookData {
  // Datos básicos de la solicitud
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
  user_id?: string;
  
  // Información adicional
  source: 'website' | 'mobile' | 'api';
  created_at: string;
  
  // Datos de la empresa (opcional)
  empresa?: {
    nombre: string;
    email: string;
    telefono: string;
    website: string;
  };
  
  // Datos de Google (opcional)
  google?: {
    meet_link?: string;
    calendar_event_id?: string;
  };
  
  // Datos de pago (opcional)
  pago?: {
    numero_comprobante: string;
    monto: string;
    metodo: string;
    estado: 'pendiente' | 'pagado' | 'fallido';
  };
}

// Función para generar el payload para Make.com
export function generateMakePayload(
  reservation: any,
  source: 'website' | 'mobile' | 'api' = 'website',
  googleData?: any,
  pagoData?: any
): MakeWebhookData {
  return {
    // Datos básicos de la solicitud
    name: reservation.nombre || reservation.name,
    email: reservation.email,
    phone: reservation.telefono || reservation.phone,
    service: reservation.servicio || reservation.service,
    date: reservation.fecha || reservation.date,
    time: reservation.hora || reservation.time,
    message: reservation.descripcion || reservation.message,
    user_id: reservation.user_id || reservation.id,
    
    // Información adicional
    source,
    created_at: new Date().toISOString(),
    
    // Datos de la empresa
    empresa: {
      nombre: NOTIFICATION_CONFIG.empresa.nombre,
      email: NOTIFICATION_CONFIG.empresa.email,
      telefono: NOTIFICATION_CONFIG.empresa.telefono,
      website: NOTIFICATION_CONFIG.empresa.website
    },
    
    // Datos de Google (opcional)
    google: googleData ? {
      meet_link: googleData.meet_link,
      calendar_event_id: googleData.calendar_event_id
    } : undefined,
    
    // Datos de pago (opcional)
    pago: pagoData ? {
      numero_comprobante: pagoData.numero_comprobante,
      monto: pagoData.monto,
      metodo: pagoData.metodo,
      estado: pagoData.estado
    } : undefined
  };
} 