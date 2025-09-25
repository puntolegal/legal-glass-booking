// Webhook de MercadoPago para Punto Legal
// Maneja notificaciones de pagos en producción

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔔 Webhook de MercadoPago recibido:', req.body);
    
    // Verificar que el webhook sea de MercadoPago
    const { type, data } = req.body;
    
    if (type === 'payment') {
      const paymentId = data.id;
      console.log('💳 Pago procesado:', paymentId);
      
      // Aquí puedes agregar lógica adicional para procesar el pago
      // Por ejemplo, actualizar el estado en la base de datos
      
      return res.status(200).json({ 
        success: true, 
        message: 'Webhook procesado correctamente',
        paymentId 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Webhook recibido pero no procesado' 
    });
    
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}
