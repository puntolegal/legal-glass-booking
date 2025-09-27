# 🔧 CONFIGURACIÓN DASHBOARD MERCADOPAGO - ACTUALIZADA

## 🎯 **OBJETIVO**
Configurar correctamente el dashboard de MercadoPago para que las URLs de retorno funcionen con el sistema corregido.

---

## 📋 **INFORMACIÓN DE LA CUENTA**

### **Credenciales Verificadas:**
- **Usuario:** BENJAMNSOZA (ID: 229698947)
- **Sitio:** MLC (Chile)
- **Token de Producción:** APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947
- **Public Key:** APP_USR-ebca3c36-af6d-4e88-ac94-5e984ce6bf5e

---

## 🚀 **PASOS PARA CONFIGURAR EL DASHBOARD**

### **PASO 1: Acceder al Dashboard**
1. **Ir a:** https://www.mercadopago.cl/developers/panel
2. **Iniciar sesión** con tu cuenta de MercadoPago
3. **Seleccionar** la aplicación correspondiente

### **PASO 2: Configurar URLs de Retorno**

#### **2.1 Ir a Configuración de URLs**
- **Menú:** Configuración → URLs de retorno
- **O:** Configuración → Notificaciones

#### **2.2 Agregar URLs de Éxito**
```
https://www.puntolegal.online/payment-success?source=mercadopago
```

#### **2.3 Agregar URLs de Fallo**
```
https://www.puntolegal.online/payment-failure?source=mercadopago
```

#### **2.4 Agregar URLs Pendientes**
```
https://www.puntolegal.online/payment-pending?source=mercadopago
```

### **PASO 3: Configurar Webhook**

#### **3.1 Ir a Webhooks**
- **Menú:** Webhooks → Configurar notificaciones
- **O:** Webhooks → Notificaciones

#### **3.2 Configurar Webhook de Producción**
- **URL del webhook:**
```
https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook
```

- **Eventos a escuchar:**
  - ✅ `payment` (Pagos)
  - ✅ `payment.updated` (Pagos actualizados)

- **Modo:** Productivo (no sandbox)

#### **3.3 Clave Secreta del Webhook**
```
ee672ff228a693e920ef6e5948e5b0329241cf76895b95c0c3675c8c286276dd
```

### **PASO 4: Guardar y Verificar**

#### **4.1 Guardar Configuración**
- Hacer clic en **"Guardar configuración"**
- Esperar confirmación

#### **4.2 Probar Webhook**
- Hacer clic en **"Simular webhook"** o **"Probar"**
- **Evento:** `payment`
- **Data ID:** `123456789` (cualquier número)
- **Enviar prueba**

---

## 🔍 **VERIFICACIÓN DE CONFIGURACIÓN**

### **URLs que deben estar configuradas:**

| Tipo | URL | Estado Requerido |
|------|-----|------------------|
| **Éxito** | `https://www.puntolegal.online/payment-success?source=mercadopago` | ✅ Configurada |
| **Fallo** | `https://www.puntolegal.online/payment-failure?source=mercadopago` | ✅ Configurada |
| **Pendiente** | `https://www.puntolegal.online/payment-pending?source=mercadopago` | ✅ Configurada |
| **Webhook** | `https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook` | ✅ Configurada |

### **Verificar que las URLs respondan:**
```bash
# Probar URLs de retorno
curl -I https://www.puntolegal.online/payment-success
curl -I https://www.puntolegal.online/payment-failure  
curl -I https://www.puntolegal.online/payment-pending

# Probar webhook (debe responder 200 OK)
curl -I https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook
```

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

### **En el Dashboard de MercadoPago:**
- [ ] URLs de éxito configurada
- [ ] URLs de fallo configurada
- [ ] URLs de pendiente configurada
- [ ] Webhook configurado con URL correcta
- [ ] Eventos `payment` habilitados
- [ ] Modo productivo seleccionado
- [ ] Configuración guardada
- [ ] Webhook probado exitosamente

### **En el Código (Ya corregido):**
- [x] URLs usan HTTPS de producción
- [x] URLs incluyen `?source=mercadopago`
- [x] Webhook apunta a Supabase Edge Function
- [x] Todas las referencias a localhost eliminadas

---

## 🧪 **PRUEBA FINAL**

### **Después de configurar el dashboard:**

1. **Ejecutar script de validación:**
```bash
node scripts/mp-sanity-check.mjs
```

2. **Resultado esperado:**
```
✅ Preferencia creada exitosamente!
🎉 Verificación completada exitosamente!
```

3. **Probar flujo completo:**
- Crear una reserva de prueba
- Procesar pago con MercadoPago
- Verificar redirección a URLs de éxito
- Confirmar recepción de webhook

---

## 🚨 **SOLUCIÓN A ERRORES COMUNES**

### **Error: "auto_return invalid. back_url.success must be defined"**
- **Causa:** URLs no configuradas en dashboard
- **Solución:** Configurar URLs en dashboard de MercadoPago

### **Error: "Invalid JWT" en webhook**
- **Causa:** Webhook no configurado correctamente
- **Solución:** Verificar URL del webhook en dashboard

### **Error: "URL not found" en redirección**
- **Causa:** URLs de retorno no existen en el sitio
- **Solución:** Verificar que las páginas existan en puntolegal.online

---

## 📞 **SOPORTE**

Si encuentras problemas:
1. **Verificar logs** en Supabase Dashboard → Edge Functions
2. **Revisar consola** del navegador para errores
3. **Probar webhook** desde el dashboard de MercadoPago
4. **Verificar URLs** con curl o navegador

---

## 🎉 **RESULTADO ESPERADO**

Una vez configurado correctamente:
- ✅ El botón de pago funcionará sin errores
- ✅ Las redirecciones serán exitosas
- ✅ Los webhooks se procesarán correctamente
- ✅ El flujo de pago será completamente funcional
