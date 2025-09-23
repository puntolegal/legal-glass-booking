export interface NotificationCompanyInfo {
  nombre: string;
  email: string;
  telefono: string;
  whatsapp: string;
  logo: string;
  direccion: string;
  website: string;
}

export interface NotificationEmailConfig {
  sender: string;
  admin: string;
  replyTo?: string;
  bcc?: string[];
  testRecipient?: string;
}

export const NOTIFICATION_CONFIG = {
  email: {
    sender: 'Punto Legal <team@puntolegal.online>',
    admin: 'puntolegalelgolf@gmail.com',
    replyTo: 'team@puntolegal.online',
    bcc: ['team@puntolegal.online'],
    testRecipient: 'team@puntolegal.online'
  } as NotificationEmailConfig,
  empresa: {
    nombre: 'Punto Legal',
    email: 'team@puntolegal.online',
    telefono: '+56962321883',
    whatsapp: 'https://wa.me/56962321883',
    logo: 'https://punto-legal.cl/logo.png',
    direccion: 'El Golf, Las Condes, Santiago',
    website: 'https://punto-legal.cl'
  } as NotificationCompanyInfo,
  recordatorio: {
    horasAntes: 24,
    asunto: '🔔 Recordatorio: Tu consulta con Punto Legal es mañana'
  },
  comprobante: {
    asunto: '✅ Comprobante de pago - Punto Legal'
  }
};

export type NotificationType =
  | 'confirmacion_cliente'
  | 'confirmacion_admin'
  | 'recordatorio_cliente'
  | 'recordatorio_admin'
  | 'comprobante_pago';
