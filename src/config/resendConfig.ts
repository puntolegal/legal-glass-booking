// Configuración de Resend para Punto Legal
// Valores por defecto para producción

export const RESEND_CONFIG = {
  // API Key de Resend (valores hardcodeados para producción)
  // ❌ REMOVIDO: API key no debe estar en el frontend
  // apiKey: import.meta.env.VITE_RESEND_API_KEY || 're_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C',
  
  // Configuración de email
  from: import.meta.env.VITE_MAIL_FROM || 'Punto Legal <team@puntolegal.online>',
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'puntolegalelgolf@gmail.com',
  
  // URLs de la aplicación
  appUrl: import.meta.env.VITE_APP_URL || 'https://puntolegal.online',
  appName: import.meta.env.VITE_APP_NAME || 'Punto Legal',
  
  // Configuración de templates
  templates: {
    bookingConfirmation: 'booking-confirmation',
    paymentConfirmation: 'payment-confirmation',
    adminNotification: 'admin-notification'
  }
};

// Verificar configuración (API key debe estar en edge functions)
export const isResendConfigured = () => {
  // Note: RESEND_API_KEY debe configurarse en Supabase Edge Functions, no en el frontend
  return true; // Siempre true porque se usa desde edge functions
};

// Debug de configuración
export const debugResendConfig = () => {
  console.log('🔍 Resend Configuration Debug:');
  console.log('From:', RESEND_CONFIG.from);
  console.log('Admin Email:', RESEND_CONFIG.adminEmail);
  console.log('App URL:', RESEND_CONFIG.appUrl);
  
  return {
    from: RESEND_CONFIG.from,
    adminEmail: RESEND_CONFIG.adminEmail,
    appUrl: RESEND_CONFIG.appUrl,
    isConfigured: isResendConfigured()
  };
};

export default RESEND_CONFIG;
