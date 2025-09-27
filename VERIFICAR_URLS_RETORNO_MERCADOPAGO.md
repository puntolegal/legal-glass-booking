# 🔍 Verificación de URLs de Retorno en MercadoPago Dashboard

## **PROBLEMA IDENTIFICADO**
Las URLs de retorno deben estar configuradas correctamente en el dashboard de MercadoPago para que el botón funcione sin error PXB01.

## **URLs QUE DEBEN ESTAR CONFIGURADAS**

### **1. URLs de Producción (PRINCIPALES)**
Estas son las que debe tener configuradas en el dashboard:

```
✅ Éxito: https://www.puntolegal.online/payment-success?source=mercadopago
✅ Fallo: https://www.puntolegal.online/payment-failure?source=mercadopago
✅ Pendiente: https://www.puntolegal.online/payment-pending?source=mercadopago
```

### **2. URLs de Desarrollo (OPCIONALES)**
Para desarrollo local (opcional, pero recomendado):

```
🔧 Éxito: http://localhost:5173/payment-success?source=mercadopago
🔧 Fallo: http://localhost:5173/payment-failure?source=mercadopago
🔧 Pendiente: http://localhost:5173/payment-pending?source=mercadopago
```

## **PASOS PARA CONFIGURAR EN MERCADOPAGO**

### **1. Acceder al Dashboard**
1. Ir a: https://www.mercadopago.cl/developers/panel
2. Iniciar sesión con tu cuenta
3. Seleccionar aplicación "Punto Legal"

### **2. Configurar URLs de Retorno**
1. Ir a **"Configuración"** > **"URLs de retorno"**
2. Agregar las URLs de producción (las principales):
   - `https://www.puntolegal.online/payment-success?source=mercadopago`
   - `https://www.puntolegal.online/payment-failure?source=mercadopago`
   - `https://www.puntolegal.online/payment-pending?source=mercadopago`

### **3. Configurar Webhook**
1. Ir a **"Webhooks"** > **"Configurar notificaciones"**
2. URL del webhook: `https://www.puntolegal.online/api/mercadopago/webhook`
3. Evento: **"Pagos"**
4. Clave secreta: `ee672ff228a693e920ef6e5948e5b0329241cf76895b95c0c3675c8c286276dd`

### **4. Guardar Configuración**
1. Hacer clic en **"Guardar configuración"**
2. Esperar confirmación

## **VERIFICACIÓN DE URLs**

### **Comprobar que las URLs respondan:**
```bash
# URLs de producción (deben responder 200 OK)
curl -I https://www.puntolegal.online/payment-success
curl -I https://www.puntolegal.online/payment-failure
curl -I https://www.puntolegal.online/payment-pending
curl -I https://www.puntolegal.online/api/mercadopago/webhook
```

### **Resultado esperado:**
- Status: 200 OK
- Content-Type: text/html (para páginas)
- Content-Type: application/json (para webhook)

## **CONFIGURACIÓN POR ENTORNO**

### **Desarrollo Local**
- **Base URL:** `http://localhost:5173`
- **URLs:** Se generan automáticamente en el código
- **Dashboard:** No es necesario configurar (opcional)

### **Producción**
- **Base URL:** `https://www.puntolegal.online`
- **URLs:** Deben estar en el dashboard de MercadoPago
- **Dashboard:** **OBLIGATORIO** configurar

## **IMPORTANCIA DE LA CONFIGURACIÓN**

### **¿Por qué es importante?**
1. **MercadoPago valida** las URLs del dashboard primero
2. **Si no están configuradas**, aparece error PXB01
3. **Las URLs del código** son secundarias
4. **Ambas deben coincidir** para que funcione

### **Orden de validación:**
1. **Primero:** URLs del dashboard de MercadoPago
2. **Segundo:** URLs enviadas en la preferencia
3. **Si ambas coinciden:** ✅ Funciona
4. **Si no coinciden:** ❌ Error PXB01

## **SOLUCIÓN AL ERROR PXB01**

### **Causa principal:**
- URLs no configuradas en el dashboard
- URLs incorrectas en el dashboard
- Mezcla de entornos (localhost en producción)

### **Solución:**
1. **Configurar URLs correctas** en el dashboard
2. **Verificar que coincidan** con el código
3. **Usar HTTPS** en producción
4. **Separar entornos** correctamente

## **CHECKLIST DE VERIFICACIÓN**

### **En el Dashboard de MercadoPago:**
- [ ] URLs de producción configuradas
- [ ] URLs usan HTTPS
- [ ] URLs incluyen `?source=mercadopago`
- [ ] Webhook configurado
- [ ] Configuración guardada

### **En el Código:**
- [ ] URLs dinámicas según entorno
- [ ] Detección automática de entorno
- [ ] Credenciales correctas por entorno
- [ ] Scripts de validación funcionando

### **Pruebas:**
- [ ] `npm run mp:test` ejecuta sin errores
- [ ] Preferencia se crea correctamente
- [ ] URLs de redirección son correctas
- [ ] Botón de pago funciona sin PXB01

## **COMANDOS DE VERIFICACIÓN**

```bash
# Verificar configuración completa
npm run mp:test

# Solo validar entorno
npm run env:check

# Solo crear preferencia de prueba
npm run mp:sanity

# Verificar URLs manualmente
curl -I https://www.puntolegal.online/payment-success
```

## **CONTACTO DE SOPORTE**

Si el problema persiste después de configurar:
- **MercadoPago Chile:** https://www.mercadopago.cl/developers/support
- **Código de error:** PXB01-QCZ5HZK3P58A
- **Incluir:** Logs de `npm run mp:test`
