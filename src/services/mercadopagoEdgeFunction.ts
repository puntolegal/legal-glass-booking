// Servicio que usa Supabase Edge Function para crear preferencias reales de MercadoPago
import { supabase } from '@/integrations/supabase/client'

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

// Crear preferencia usando Edge Function de Supabase
export const createRealPreferenceViaEdgeFunction = async (paymentData: PaymentData): Promise<{ preference_id: string; init_point: string }> => {
  try {
    console.log('🚀 Creando preferencia REAL via Supabase Edge Function...')
    console.log('📋 Datos de pago:', paymentData)
    
    // Llamar al Edge Function
    const { data, error } = await supabase.functions.invoke('create-mercadopago-preference', {
      body: { paymentData }
    })
    
    if (error) {
      console.error('❌ Error en Edge Function:', error)
      throw new Error(`Error en Edge Function: ${error.message}`)
    }
    
    if (!data.success) {
      console.error('❌ Error en respuesta:', data.error)
      throw new Error(`Error creando preferencia: ${data.error}`)
    }
    
    console.log('✅ Preferencia creada exitosamente:', data.preference_id)
    
    return {
      preference_id: data.preference_id,
      init_point: data.init_point
    }
    
  } catch (error) {
    console.error('❌ Error completo:', error)
    throw new Error(`Error creando preferencia: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

// Verificar estado de un pago (para uso futuro)
export const getPaymentStatus = async (paymentId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('get-payment-status', {
      body: { paymentId }
    })
    
    if (error) {
      throw new Error(`Error obteniendo estado: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('❌ Error obteniendo estado del pago:', error)
    throw error
  }
}

export default {
  createRealPreferenceViaEdgeFunction,
  getPaymentStatus
}
