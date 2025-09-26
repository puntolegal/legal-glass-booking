# Configuración de MercadoPago Dashboard - Punto Legal

## 🚨 PROBLEMA IDENTIFICADO
El botón de pago no funciona porque **las URLs de retorno NO están configuradas en el dashboard de MercadoPago**.

## 📋 PASOS PARA SOLUCIONAR

### 1. Ir al Dashboard de MercadoPago
- URL: https://www.mercadopago.com.ar/developers/panel
- Iniciar sesión con tu cuenta de MercadoPago

### 2. Seleccionar tu Aplicación
- Buscar la aplicación "Punto Legal" o la que estés usando
- Hacer clic en la aplicación

### 3. Configurar URLs de Retorno
- Ir a **"Configuración"** > **"URLs de retorno"**
- Agregar las siguientes URLs:

#### URLs de Éxito
```
https://www.puntolegal.online/payment-success?source=mercadopago
```

#### URLs de Fallo
```
https://www.puntolegal.online/payment-failure?source=mercadopago
```

#### URLs Pendientes
```
https://www.puntolegal.online/payment-pending?source=mercadopago
```

### 4. Configurar Webhook
- Ir a **"Webhooks"** > **"Configurar notificaciones"**
- Seleccionar **"Modo productivo"**
- URL del webhook:
```
https://www.puntolegal.online/api/mercadopago/webhook
```
- Evento: **"Pagos"**
- Clave secreta: `ee672ff228a693e920ef6e5948e5b0329241cf76895b95c0c3675c8c286276dd`

### 5. Guardar Configuración
- Hacer clic en **"Guardar configuración"**
- Esto generará una clave secreta para validar las notificaciones

### 6. Probar la Configuración
- Hacer clic en **"Simular"** para probar el webhook
- Seleccionar la URL de producción
- Evento: "Pagos"
- Data ID: cualquier número (ej: 123456)
- Hacer clic en **"Enviar prueba"**

## 🔍 VERIFICACIÓN

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

## ⚠️ IMPORTANTE

### Según la documentación de MercadoPago:
> **"Las URLs configuradas durante la creación de un pago tendrán prioridad por sobre aquellas configuradas a través de Tus integraciones."**

Esto significa que:
1. **Primero** se validan las URLs del dashboard
2. **Luego** se validan las URLs de la preferencia
3. Si **ambas** están configuradas correctamente, el botón funcionará

## 🧪 PRUEBA FINAL

Después de configurar todo:
1. **Refrescar** `www.puntolegal.online`
2. **Probar** el botón de MercadoPago
3. **Verificar** que el botón de pago sea funcional
4. **Completar** el pago con tarjeta de prueba

### Tarjeta de prueba:
- **Número:** `4509 9535 6623 3704`
- **CVV:** `123`
- **Vencimiento:** `11/25`
- **Nombre:** Cualquier nombre

## 📞 SOPORTE

Si el problema persiste:
1. Verificar que las URLs estén configuradas correctamente en el dashboard
2. Verificar que las URLs respondan correctamente
3. Revisar los logs de la función de Supabase
4. Contactar soporte de MercadoPago si es necesario
