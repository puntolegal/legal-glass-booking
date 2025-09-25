# Configuración de URLs de MercadoPago para Punto Legal

## URLs de Retorno Configuradas

### URLs de Éxito
```
https://www.puntolegal.online/payment-success?source=mercadopago
```

### URLs de Fallo
```
https://www.puntolegal.online/payment-failure?source=mercadopago
```

### URLs Pendientes
```
https://www.puntolegal.online/payment-pending?source=mercadopago
```

### URL de Webhook
```
https://www.puntolegal.online/api/mercadopago/webhook
```

## Configuración en MercadoPago Dashboard

### 1. Ir al Dashboard de MercadoPago
- URL: https://www.mercadopago.com.ar/developers/panel
- Seleccionar tu aplicación

### 2. Configurar URLs de Retorno
- Ir a "Configuración" > "URLs de retorno"
- Agregar las siguientes URLs:
  - **Éxito:** `https://www.puntolegal.online/payment-success?source=mercadopago`
  - **Fallo:** `https://www.puntolegal.online/payment-failure?source=mercadopago`
  - **Pendiente:** `https://www.puntolegal.online/payment-pending?source=mercadopago`

### 3. Configurar Webhook
- Ir a "Webhooks"
- Agregar webhook:
  - **URL:** `https://www.puntolegal.online/api/mercadopago/webhook`
  - **Eventos:** `payment`
  - **Clave:** `ee672ff228a693e920ef6e5948e5b0329241cf76895b95c0c3675c8c286276dd`

## Verificación de URLs

### Comprobar que las URLs respondan:
```bash
# URL de éxito
curl -I https://www.puntolegal.online/payment-success

# URL de fallo
curl -I https://www.puntolegal.online/payment-failure

# URL de webhook
curl -I https://www.puntolegal.online/api/mercadopago/webhook
```

### Todas deben devolver:
- Status: 200 OK
- Content-Type: text/html (para las páginas)
- Content-Type: application/json (para el webhook)

## Troubleshooting

### Si el botón de pago no funciona:
1. Verificar que las URLs estén configuradas en el dashboard de MercadoPago
2. Verificar que las URLs respondan correctamente
3. Verificar que no haya errores en la consola del navegador
4. Verificar que la función de Supabase esté funcionando correctamente

### Logs importantes:
- Verificar logs de la función de Supabase en el dashboard
- Verificar logs del navegador en la consola
- Verificar logs del servidor de producción
