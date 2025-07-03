# Configuración de Pasarelas de Pago

Este proyecto incluye integración con WebPay (Transbank) y PayPal para procesar pagos de $15.000 CLP + IVA.

## 🏦 WebPay (Transbank) - Chile

### Configuración

1. **Registro en Transbank:**
   - Ve a [Transbank Developers](https://www.transbankdevelopers.cl/)
   - Crea una cuenta y solicita credenciales de comercio
   - Obtén tu `commerce_code` y `api_key`

2. **Variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto:

```env
# WebPay Configuration
VITE_WEBPAY_COMMERCE_CODE=tu_commerce_code
VITE_WEBPAY_API_KEY=tu_api_key
VITE_WEBPAY_ENVIRONMENT=integration
VITE_WEBPAY_RETURN_URL=https://tudominio.com/payment/success
VITE_WEBPAY_CANCEL_URL=https://tudominio.com/payment/cancel

# PayPal Configuration
VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id
VITE_PAYPAL_CLIENT_SECRET=tu_paypal_client_secret
VITE_PAYPAL_ENVIRONMENT=sandbox
```

### Implementación Real

Para implementar WebPay en producción, necesitarás:

1. **Instalar SDK de Transbank:**
```bash
npm install transbank-sdk
```

2. **Crear endpoint en tu backend:**
```javascript
// Ejemplo con Node.js/Express
app.post('/api/payment/webpay/init', async (req, res) => {
  const { amount, orderId, description } = req.body;
  
  const transaction = new Webpay(Configuration.forTestingWebpayPlusNormal());
  const createResponse = await transaction.create(orderId, 'sessionId', amount, 'http://localhost:3000/return');
  
  res.json({
    success: true,
    url: createResponse.url,
    token: createResponse.token
  });
});
```

## 💳 PayPal - Internacional

### Configuración

1. **Cuenta PayPal Business:**
   - Ve a [PayPal Developer](https://developer.paypal.com/)
   - Crea una cuenta de desarrollador
   - Obtén tu `client_id` y `client_secret`

2. **Implementación:**
```bash
npm install @paypal/react-paypal-js
```

### Implementación Real

```javascript
// En tu componente
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = () => (
  <PayPalScriptProvider options={{ 
    "client-id": process.env.VITE_PAYPAL_CLIENT_ID,
    currency: "CLP"
  }}>
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: "17.85", // $15.000 + IVA en formato decimal
              currency_code: "CLP"
            },
            description: "Consulta Legal Especializada"
          }]
        });
      }}
      onApprove={(data, actions) => {
        return actions.order.capture().then((details) => {
          // Pago exitoso
          console.log("Pago completado:", details);
        });
      }}
    />
  </PayPalScriptProvider>
);
```

## 🔧 Configuración del Proyecto

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz:

```env
# WebPay
VITE_WEBPAY_COMMERCE_CODE=597055555532
VITE_WEBPAY_API_KEY=tu_api_key_aqui
VITE_WEBPAY_ENVIRONMENT=integration
VITE_WEBPAY_RETURN_URL=http://localhost:8080/payment/success
VITE_WEBPAY_CANCEL_URL=http://localhost:8080/payment/cancel

# PayPal
VITE_PAYPAL_CLIENT_ID=tu_client_id_aqui
VITE_PAYPAL_CLIENT_SECRET=tu_client_secret_aqui
VITE_PAYPAL_ENVIRONMENT=sandbox
```

### 2. Backend (Opcional pero Recomendado)

Para mayor seguridad, considera crear un backend que maneje las transacciones:

```javascript
// Ejemplo con Express.js
const express = require('express');
const app = express();

app.post('/api/payment/process', async (req, res) => {
  const { method, amount, description, customerData } = req.body;
  
  try {
    let paymentResult;
    
    if (method === 'webpay') {
      paymentResult = await processWebPayPayment(amount, description);
    } else if (method === 'paypal') {
      paymentResult = await processPayPalPayment(amount, description);
    }
    
    res.json(paymentResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🚀 Despliegue

### 1. Configuración de Producción

Antes de desplegar, cambia las variables de entorno:

```env
VITE_WEBPAY_ENVIRONMENT=production
VITE_PAYPAL_ENVIRONMENT=production
VITE_WEBPAY_RETURN_URL=https://tudominio.com/payment/success
VITE_WEBPAY_CANCEL_URL=https://tudominio.com/payment/cancel
```

### 2. Dominio HTTPS

Las pasarelas de pago requieren HTTPS en producción. Asegúrate de que tu dominio tenga SSL configurado.

### 3. Webhooks (Recomendado)

Configura webhooks para recibir notificaciones de pago:

```javascript
// Webhook para WebPay
app.post('/webhook/webpay', (req, res) => {
  const { token_ws, tbk_token } = req.body;
  // Procesar notificación de pago
  res.send('OK');
});

// Webhook para PayPal
app.post('/webhook/paypal', (req, res) => {
  const { event_type, resource } = req.body;
  // Procesar notificación de pago
  res.send('OK');
});
```

## 📊 Monitoreo

### Logs de Transacciones

Implementa logging para monitorear las transacciones:

```javascript
const logTransaction = (transaction) => {
  console.log(`[${new Date().toISOString()}] Transacción:`, {
    id: transaction.id,
    amount: transaction.amount,
    method: transaction.method,
    status: transaction.status,
    customer: transaction.customer
  });
};
```

### Dashboard de Pagos

Considera implementar un dashboard para ver las transacciones:

- Transacciones exitosas
- Transacciones fallidas
- Montos totales
- Métodos de pago más usados

## 🔒 Seguridad

### Mejores Prácticas

1. **Nunca expongas credenciales en el frontend**
2. **Valida todos los datos de entrada**
3. **Implementa rate limiting**
4. **Usa HTTPS en producción**
5. **Mantén logs de auditoría**
6. **Implementa webhooks para confirmaciones**

### Validaciones

```javascript
const validatePaymentData = (data) => {
  const { amount, description, customerData } = data;
  
  if (!amount || amount <= 0) {
    throw new Error('Monto inválido');
  }
  
  if (!description || description.length < 10) {
    throw new Error('Descripción muy corta');
  }
  
  if (!customerData.email || !customerData.name) {
    throw new Error('Datos del cliente incompletos');
  }
  
  return true;
};
```

## 📞 Soporte

Para ayuda con la configuración:

- **WebPay:** [Transbank Developers](https://www.transbankdevelopers.cl/)
- **PayPal:** [PayPal Developer Support](https://developer.paypal.com/support/)
- **Documentación:** Revisa la documentación oficial de cada pasarela 