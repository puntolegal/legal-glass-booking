# Configuración del Dashboard de MercadoPago para Punto Legal

## 🎯 Problema Identificado

El botón de pago de MercadoPago no funciona porque las URLs de retorno no están configuradas en el dashboard de MercadoPago. Según la documentación oficial:

> "Las URLs configuradas durante la creación de un pago tendrán prioridad por sobre aquellas configuradas a través de Tus integraciones."

**Ambas configuraciones deben estar correctas:**
1. ✅ URLs en el código (ya configuradas)
2. ❌ URLs en el dashboard (pendiente de configurar)

## 📋 Pasos para Configurar

### 1. Acceder al Dashboard de MercadoPago

- **URL:** https://www.mercadopago.com.ar/developers/panel
- **Iniciar sesión** con tu cuenta de MercadoPago

### 2. Seleccionar tu Aplicación

- En el menú lateral, hacer clic en **"Tus integraciones"**
- Seleccionar la aplicación correspondiente a **"Punto Legal"**

### 3. Configurar URLs de Retorno

- Ir a **"Configuración"** > **"URLs de retorno"**
- Agregar las siguientes URLs:

#### ✅ URL de Éxito (Success)
```
https://www.puntolegal.online/payment-success?source=mercadopago
```

#### ❌ URL de Fallo (Failure)
```
https://www.puntolegal.online/payment-failure?source=mercadopago
```

#### ⏳ URL Pendiente (Pending)
```
https://www.puntolegal.online/payment-pending?source=mercadopago
```

### 4. Configurar Webhook

- Ir a **"Webhooks"** > **"Configurar notificaciones"**
- Asegurarse de estar en la pestaña **"Modo productivo"**
- Configurar:

#### 🔗 URL del Webhook
```
https://www.puntolegal.online/api/mercadopago/webhook
```

#### 📧 Evento
- Seleccionar **"Pagos"** para recibir notificaciones sobre el estado de los pagos

#### 🔐 Clave Secreta
```
ee672ff228a693e920ef6e5948e5b0329241cf76895b95c0c3675c8c286276dd
```

### 5. Guardar y Probar

- Hacer clic en **"Guardar configuración"**
- Utilizar la opción **"Simular"** para enviar una notificación de prueba
- Verificar que el endpoint reciba la notificación correctamente

## 🔍 Verificación

### URLs Configuradas en el Código

Las siguientes URLs ya están configuradas en el código:

#### Frontend (`src/config/mercadopago.ts`)
```typescript
urls: {
  success: `https://www.puntolegal.online/payment-success`,
  failure: `https://www.puntolegal.online/payment-failure`,
  pending: `https://www.puntolegal.online/payment-pending`
}
```

#### Supabase Function (`supabase/functions/create-mercadopago-preference/index.ts`)
```typescript
back_urls: {
  success: `https://www.puntolegal.online/payment-success?source=mercadopago`,
  failure: `https://www.puntolegal.online/payment-failure?source=mercadopago`,
  pending: `https://www.puntolegal.online/payment-pending?source=mercadopago`
}
```

#### Componente de Pago (`src/components/MercadoPagoOfficialButton.tsx`)
```typescript
const backUrls = {
  success: `https://www.puntolegal.online/payment-success?source=mercadopago`,
  failure: `https://www.puntolegal.online/payment-failure?source=mercadopago`,
  pending: `https://www.puntolegal.online/payment-pending?source=mercadopago`
};
```

## 🎯 Resultado Esperado

Una vez configuradas las URLs en el dashboard de MercadoPago:

- ✅ El botón de pago será funcional
- ✅ MercadoPago podrá validar las URLs
- ✅ La redirección funcionará correctamente
- ✅ Los emails se enviarán después del pago
- ✅ El sistema completo funcionará en producción

## 🚨 Importante

- **HTTPS:** Todas las URLs deben usar HTTPS
- **Dominio:** Asegurarse de que `www.puntolegal.online` sea el dominio correcto
- **Parámetros:** Los parámetros como `?source=mercadopago` son útiles para identificar el origen
- **Consistencia:** Las URLs deben ser consistentes en todas las configuraciones

## 📞 Soporte

Si tienes problemas con la configuración:

1. Verificar que las URLs sean exactamente las indicadas
2. Asegurarse de estar en "Modo productivo"
3. Probar con la función "Simular" del dashboard
4. Revisar los logs de la función de Supabase para ver errores

---

**Fecha de creación:** $(date)
**Estado:** Pendiente de configuración en dashboard
**Prioridad:** Alta - Requerido para que MercadoPago funcione
