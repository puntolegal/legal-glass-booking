// Servicio simulado de MercadoPago que funciona correctamente
// Simula la API real para desarrollo

export interface PaymentData {
  service: string;
  price: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  description?: string;
}

// Simular creación de preferencia que funcione con Wallet Brick
export const createSimulatedPreference = async (paymentData: PaymentData): Promise<{ preference_id: string; init_point: string }> => {
  try {
    console.log('🚀 Creando preferencia SIMULADA para desarrollo...');
    
    // Generar un ID de preferencia que MercadoPago pueda reconocer
    // Formato similar al real pero para testing
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const preferenceId = `${timestamp}-${randomId}`;
    
    console.log('📋 Datos de pago:', paymentData);
    console.log('🆔 Preference ID generado:', preferenceId);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // En desarrollo, MercadoPago permite usar IDs de prueba
    // que siguen un formato específico
    const testPreferenceId = `test-${timestamp}-${randomId}`;
    
    console.log('✅ Preferencia simulada creada exitosamente');
    
    return {
      preference_id: testPreferenceId,
      init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${testPreferenceId}`
    };
    
  } catch (error) {
    console.error('❌ Error creando preferencia simulada:', error);
    throw new Error(`Error creando preferencia: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// Simular verificación de pago
export const simulatePaymentVerification = async (paymentId: string) => {
  try {
    console.log('🔍 Verificando pago simulado:', paymentId);
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simular respuesta exitosa
    return {
      id: paymentId,
      status: 'approved',
      status_detail: 'accredited',
      transaction_amount: 35000,
      currency_id: 'CLP',
      payment_method_id: 'visa',
      date_approved: new Date().toISOString(),
      payer: {
        email: 'test@puntolegal.cl'
      }
    };
  } catch (error) {
    console.error('❌ Error verificando pago simulado:', error);
    throw error;
  }
};

// Para desarrollo: usar credenciales de test que funcionen
export const getTestCredentials = () => {
  return {
    publicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '',
    accessToken: import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || 'TEST-ACCESS-TOKEN'
  };
};

export default {
  createSimulatedPreference,
  simulatePaymentVerification,
  getTestCredentials
};
