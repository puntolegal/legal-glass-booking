// Backend oficial para MercadoPago siguiendo la documentación exacta
// Servidor Express.js para crear preferencias de forma segura

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Credenciales oficiales de producción (desde variables de entorno)
const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!MERCADOPAGO_ACCESS_TOKEN) {
  console.error('❌ ERROR: MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint para crear preferencias (según documentación oficial)
app.post('/create-preference', async (req, res) => {
  try {
    console.log('🚀 Creando preferencia oficial...');
    console.log('📋 Datos recibidos:', req.body);
    
    const { paymentData } = req.body;
    
    if (!paymentData) {
      return res.status(400).json({
        success: false,
        error: 'Datos de pago requeridos'
      });
    }
    
    // Estructura exacta según documentación oficial de MercadoPago
    const preferenceData = {
      items: [
        {
          title: `${paymentData.service} - Punto Legal`,
          description: paymentData.description || `Consulta legal agendada para ${paymentData.date} a las ${paymentData.time}`,
          quantity: 1,
          unit_price: parseFloat(paymentData.price),
          currency_id: 'CLP'
        }
      ],
      payer: {
        name: paymentData.name,
        email: paymentData.email,
        phone: {
          number: paymentData.phone
        }
      },
      back_urls: {
        success: `${process.env.BASE_URL || 'https://www.puntolegal.online'}/payment-success?source=mercadopago`,
        failure: `${process.env.BASE_URL || 'https://www.puntolegal.online'}/payment-failure?source=mercadopago`,
        pending: `${process.env.BASE_URL || 'https://www.puntolegal.online'}/payment-pending?source=mercadopago`
      },
      external_reference: paymentData.external_reference || `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notification_url: `${process.env.BASE_URL || 'https://www.puntolegal.online'}/api/mercadopago/webhook`,
      metadata: {
        client_name: paymentData.name,
        client_email: paymentData.email,
        service_type: paymentData.service,
        appointment_date: paymentData.date,
        appointment_time: paymentData.time,
        source: 'punto-legal-web',
        integration_type: 'checkout_pro_official'
      },
      statement_descriptor: 'PUNTO LEGAL'
    };
    
    console.log('📤 Enviando a API oficial de MercadoPago...');
    
    // Llamada oficial a la API de MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error API MercadoPago:', response.status, errorText);
      
      return res.status(response.status).json({
        success: false,
        error: `Error ${response.status}: ${errorText}`
      });
    }
    
    const result = await response.json();
    
    console.log('✅ Preferencia creada exitosamente:', result.id);
    
    res.json({
      success: true,
      preference_id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });
    
  } catch (error) {
    console.error('❌ Error creando preferencia:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend MercadoPago funcionando',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 Backend MercadoPago iniciado');
  console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
  console.log('🔗 Endpoints disponibles:');
  console.log(`   POST http://localhost:${PORT}/create-preference`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log('');
  console.log('✅ Listo para crear preferencias oficiales de MercadoPago');
});

module.exports = app;
// Endpoint para consultar un pago específico de forma segura (server-side)
app.get('/payment/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, error: 'payment id requerido' });
  }
  try {
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      return res.status(500).json({ success: false, error: 'Access token no configurado' });
    }
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const txt = await response.text();
      return res.status(response.status).json({ success: false, error: txt });
    }
    const data = await response.json();
    res.json({ success: true, payment: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err?.message || 'error desconocido' });
  }
});
