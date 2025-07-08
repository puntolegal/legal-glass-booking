// Configuración de notificaciones y templates de email
export const NOTIFICATION_CONFIG = {
  makeWebhookUrl: import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.eu2.make.com/YOUR_WEBHOOK_ID',
  empresa: {
    nombre: 'Punto Legal',
    email: 'puntolegalelgolf@gmail.com',
    telefono: '+56962321883',
    whatsapp: 'https://wa.me/56962321883',
    logo: 'https://tu-dominio.com/logo.png',
    direccion: 'El Golf, Las Condes, Santiago',
    website: 'https://punto-legal.cl'
  },
  recordatorio: {
    horasAntes: 24,
    asunto: '🔔 Recordatorio: Tu cita con Punto Legal es mañana'
  },
  comprobante: {
    asunto: '✅ Comprobante de pago - Punto Legal',
    envioAutomatico: true
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
      'email_cliente'
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
      'enlace_cancelar'
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
  }
};

// Estructura de datos para Make
export interface MakeWebhookData {
  tipo_evento: 'nueva_reserva' | 'recordatorio' | 'comprobante';
  timestamp: string;
  empresa: {
    nombre: string;
    email: string;
    telefono: string;
    whatsapp: string;
    logo: string;
    direccion: string;
    website: string;
  };
  reserva: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    fecha: string;
    hora: string;
    servicio?: string;
    precio?: string;
    categoria?: string;
    tipo_reunion?: string;
    estado?: string;
  };
  pago?: {
    numero_comprobante: string;
    fecha_pago: string;
    monto: string;
    metodo: string;
    numero_transaccion: string;
    estado: 'pendiente' | 'pagado' | 'fallido';
  };
  configuracion: {
    enviar_recordatorio: boolean;
    enviar_comprobante: boolean;
    idioma: 'es';
    zona_horaria: 'America/Santiago';
  };
}

// Función para generar el payload para Make
export function generateMakePayload(
  reservation: any,
  tipo: 'nueva_reserva' | 'recordatorio' | 'comprobante',
  pagoData?: any
): MakeWebhookData {
  return {
    tipo_evento: tipo,
    timestamp: new Date().toISOString(),
    empresa: NOTIFICATION_CONFIG.empresa,
    reserva: {
      id: reservation.id,
      nombre: reservation.nombre,
      email: reservation.email,
      telefono: reservation.telefono,
      fecha: reservation.fecha,
      hora: reservation.hora,
      servicio: reservation.servicio,
      precio: reservation.precio,
      categoria: reservation.categoria,
      tipo_reunion: reservation.tipo_reunion,
      estado: reservation.estado
    },
    pago: pagoData ? {
      numero_comprobante: pagoData.numero_comprobante,
      fecha_pago: pagoData.fecha_pago,
      monto: pagoData.monto,
      metodo: pagoData.metodo,
      numero_transaccion: pagoData.numero_transaccion,
      estado: pagoData.estado
    } : undefined,
    configuracion: {
      enviar_recordatorio: true,
      enviar_comprobante: true,
      idioma: 'es',
      zona_horaria: 'America/Santiago'
    }
  };
} 