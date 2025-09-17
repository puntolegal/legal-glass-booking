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
  },

  // Configuración corporativa
  corporativo: {
    email: 'empresas@puntolegal.cl',
    asunto: '🏢 Nueva solicitud corporativa - Punto Legal',
    asuntoRecordatorio: '🔔 Recordatorio: Audiencia corporativa mañana',
    dashboardUrl: '/servicios/corporativo',
    planSuscripcion: {
      basico: {
        precio: 350000,
        moneda: 'CLP',
        periodo: 'unico',
        caracteristicas: [
          'Constitución SpA o EIRL',
          'Estatutos estándar',
          'Inscripción CBR',
          'RUT empresa',
          '1 mes soporte básico'
        ]
      },
      premium: {
        precio: 750000,
        moneda: 'CLP',
        periodo: 'unico',
        caracteristicas: [
          'Todo lo del plan Básico',
          'Estatutos personalizados',
          '3 contratos comerciales',
          'Políticas internas básicas',
          '6 meses soporte legal',
          'Asesoría tributaria inicial'
        ]
      },
      enterprise: {
        precio: 1500000,
        moneda: 'CLP',
        periodo: 'unico',
        caracteristicas: [
          'Todo lo del plan Premium',
          'Due diligence completo',
          'Estructuración M&A',
          'Compliance corporativo',
          '12 meses soporte premium',
          'Abogado dedicado'
        ]
      },
      suscripcion: {
        precio: 800000,
        moneda: 'CLP',
        periodo: 'mensual',
        caracteristicas: [
          'Panel de control empresarial',
          'Seguimiento completo de causas',
          'Comparendos ante Inspección del Trabajo',
          'Redacción de contratos y amonestaciones',
          'Gestión de despidos y otros procesos',
          'Proyecciones de resultados en juicio',
          'Notificaciones automáticas',
          'Soporte prioritario 24/7'
        ]
      }
    }
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
  },

  // Templates corporativos
  nuevaCausa: {
    asunto: '⚖️ Nueva causa registrada - Punto Legal',
    variables: [
      'nombre_empresa',
      'titulo_causa',
      'tipo_causa',
      'tribunal',
      'numero_causa',
      'fecha_inicio',
      'abogado_asignado',
      'costo_estimado',
      'resultado_proyectado'
    ]
  },

  audienciaProxima: {
    asunto: '📅 Audiencia programada - Punto Legal',
    variables: [
      'nombre_empresa',
      'titulo_causa',
      'tipo_audiencia',
      'fecha_audiencia',
      'hora_audiencia',
      'lugar_audiencia',
      'tribunal',
      'documentos_requeridos',
      'abogado_asignado'
    ]
  },

  documentoVencido: {
    asunto: '⚠️ Documento por vencer - Punto Legal',
    variables: [
      'nombre_empresa',
      'titulo_documento',
      'tipo_documento',
      'fecha_vencimiento',
      'causa_relacionada',
      'dias_restantes',
      'accion_requerida'
    ]
  },

  actualizacionCausa: {
    asunto: '📊 Actualización de causa - Punto Legal',
    variables: [
      'nombre_empresa',
      'titulo_causa',
      'estado_anterior',
      'estado_nuevo',
      'fecha_actualizacion',
      'descripcion_cambios',
      'proximos_pasos',
      'abogado_asignado'
    ]
  },

  proyeccionResultado: {
    asunto: '📈 Proyección de resultado - Punto Legal',
    variables: [
      'nombre_empresa',
      'titulo_causa',
      'tipo_proyeccion',
      'valor_proyectado',
      'confianza_porcentaje',
      'fundamento',
      'fecha_proyeccion',
      'abogado_asignado'
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

  // Datos corporativos (opcional)
  corporativo?: {
    razon_social: string;
    rut_empresa: string;
    tipo_empresa: string;
    plan_suscripcion: string;
    industria: string;
    tamano_empresa: string;
  };
}

// Estructura de datos para causas corporativas
export interface CausaData {
  id?: string;
  user_id: string;
  empresa_id: string;
  titulo: string;
  tipo: 'laboral' | 'comercial' | 'tributario' | 'dt' | 'civil' | 'penal';
  estado: 'pendiente' | 'en_proceso' | 'resuelto' | 'apelacion' | 'archivado';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  descripcion?: string;
  fecha_inicio: string;
  fecha_proxima_audiencia?: string;
  hora_proxima_audiencia?: string;
  tribunal?: string;
  numero_causa?: string;
  abogado_asignado?: string;
  costo_estimado?: number;
  resultado_proyectado?: string;
  probabilidad_exito?: number;
  documentos?: any;
  notas?: string;
}

// Estructura de datos para comparendos
export interface ComparendoData {
  id?: string;
  causa_id: string;
  tipo: 'audiencia' | 'comparendo' | 'mediacion' | 'conciliacion';
  fecha: string;
  hora: string;
  lugar?: string;
  descripcion?: string;
  estado: 'programada' | 'realizada' | 'cancelada' | 'pospuesta';
  resultado?: string;
  documentos_requeridos?: string[];
}

// Estructura de datos para documentos legales
export interface DocumentoLegalData {
  id?: string;
  causa_id: string;
  tipo: 'contrato' | 'amonestacion' | 'despido' | 'demanda' | 'respuesta' | 'recurso' | 'otro';
  titulo: string;
  descripcion?: string;
  contenido?: string;
  archivo_url?: string;
  estado: 'borrador' | 'revisado' | 'aprobado' | 'enviado';
  fecha_creacion?: string;
  fecha_vencimiento?: string;
}

// Estructura de datos para proyecciones
export interface ProyeccionData {
  id?: string;
  causa_id: string;
  tipo_proyeccion: 'resultado_juicio' | 'tiempo_resolucion' | 'costo_total' | 'probabilidad_exito';
  valor_proyectado: string;
  confianza: number;
  fundamento?: string;
  fecha_proyeccion?: string;
  fecha_actualizacion?: string;
}

// Estructura de datos para notificaciones empresariales
export interface NotificacionEmpresarialData {
  id?: string;
  empresa_id: string;
  tipo: 'audiencia_proxima' | 'documento_vencido' | 'causa_actualizada' | 'pago_pendiente' | 'sistema';
  titulo: string;
  mensaje: string;
  leida?: boolean;
  fecha_envio?: string;
  fecha_lectura?: string;
  datos_adicionales?: any;
}

// Función para generar el payload para Make.com
export function generateMakePayload(
  reservation: any,
  source: 'website' | 'mobile' | 'api' = 'website',
  googleData?: any,
  pagoData?: any,
  corporativoData?: any
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
    } : undefined,

    // Datos corporativos (opcional)
    corporativo: corporativoData ? {
      razon_social: corporativoData.razon_social,
      rut_empresa: corporativoData.rut_empresa,
      tipo_empresa: corporativoData.tipo_empresa,
      plan_suscripcion: corporativoData.plan_suscripcion,
      industria: corporativoData.industria,
      tamano_empresa: corporativoData.tamano_empresa
    } : undefined
  };
}

// Función para generar payload de causa corporativa
export function generateCausaPayload(
  causa: CausaData,
  empresa: any
): any {
  return {
    // Datos de la causa
    titulo: causa.titulo,
    tipo: causa.tipo,
    estado: causa.estado,
    prioridad: causa.prioridad,
    descripcion: causa.descripcion,
    fecha_inicio: causa.fecha_inicio,
    fecha_proxima_audiencia: causa.fecha_proxima_audiencia,
    tribunal: causa.tribunal,
    numero_causa: causa.numero_causa,
    costo_estimado: causa.costo_estimado,
    resultado_proyectado: causa.resultado_proyectado,
    probabilidad_exito: causa.probabilidad_exito,

    // Datos de la empresa
    empresa: {
      nombre: empresa.razon_social || empresa.nombre,
      rut: empresa.rut_empresa,
      email: empresa.email,
      telefono: empresa.telefono_empresa,
      plan_suscripcion: empresa.plan_suscripcion
    },

    // Datos del sistema
    created_at: new Date().toISOString(),
    source: 'dashboard_corporativo'
  };
}

// Función para generar payload de comparendo
export function generateComparendoPayload(
  comparendo: ComparendoData,
  causa: CausaData,
  empresa: any
): any {
  return {
    // Datos del comparendo
    tipo: comparendo.tipo,
    fecha: comparendo.fecha,
    hora: comparendo.hora,
    lugar: comparendo.lugar,
    descripcion: comparendo.descripcion,
    estado: comparendo.estado,
    documentos_requeridos: comparendo.documentos_requeridos,

    // Datos de la causa relacionada
    causa: {
      titulo: causa.titulo,
      tipo: causa.tipo,
      numero_causa: causa.numero_causa,
      tribunal: causa.tribunal
    },

    // Datos de la empresa
    empresa: {
      nombre: empresa.razon_social || empresa.nombre,
      rut: empresa.rut_empresa,
      email: empresa.email
    },

    // Datos del sistema
    created_at: new Date().toISOString(),
    source: 'dashboard_corporativo'
  };
} 