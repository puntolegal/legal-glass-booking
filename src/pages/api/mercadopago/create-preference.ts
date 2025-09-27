// API Route para crear preferencias de MercadoPago
// Maneja la creación segura de preferencias en el backend

import { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoAPI } from '../../api/mercadopago';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, description, external_reference, customer } = req.body;

    // Validar datos requeridos
    if (!amount || !description) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos: amount y description' 
      });
    }

    // Validar que el amount sea un número positivo
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ 
        error: 'El amount debe ser un número positivo' 
      });
    }

    // Crear instancia de la API de MercadoPago
    const mpAPI = new MercadoPagoAPI();

    // Crear preferencia
    const preference = await mpAPI.createPreference({
      amount,
      description,
      external_reference,
      customer
    });

    console.log('✅ Preferencia creada:', preference.id);

    return res.status(200).json({
      success: true,
      preference: {
        id: preference.id,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point
      }
    });

  } catch (error) {
    console.error('❌ Error creando preferencia:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
}
