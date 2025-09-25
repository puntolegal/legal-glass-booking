# Configuración de Webhook de MercadoPago

## URL de Producción
```
https://www.puntolegal.online/api/mercadopago/webhook
```

## Clave de Webhook
```
ee672ff228a693e920ef6e5948e5b0329241cf76895b95c0c3675c8c286276dd
```

## Configuración en MercadoPago Dashboard

1. **Ir a:** [MercadoPago Dashboard](https://www.mercadopago.com.ar/developers/panel)
2. **Seleccionar:** Tu aplicación
3. **Ir a:** Webhooks
4. **Agregar webhook:**
   - **URL:** `https://www.puntolegal.online/api/mercadopago/webhook`
   - **Eventos:** `payment`
   - **Clave:** `ee672ff228a693e920ef6e5948e5b0329241cf76895b95c0c3675c8c286276dd`

## Eventos que se procesan

- `payment` - Cuando se procesa un pago
- `payment.updated` - Cuando se actualiza un pago
- `payment.approved` - Cuando se aprueba un pago

## Estructura del webhook

```json
{
  "type": "payment",
  "data": {
    "id": "1234567890"
  }
}
```

## Logs

Los webhooks se registran en la consola del servidor para debugging.
