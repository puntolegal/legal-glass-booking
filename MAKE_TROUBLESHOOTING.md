# 🔧 Solución de Problemas - Make.com

## ❌ Error: "Module Not Found"

### Problema Común
Los módulos muestran "Module Not Found" cuando:
- Las conexiones no están configuradas
- Los módulos no están conectados correctamente
- Faltan credenciales de las aplicaciones

## 🛠️ Solución Paso a Paso

### 1. Configurar Webhook

**Paso 1: Configurar Módulo Webhook**
1. Haz clic en el módulo webhook (círculo con icono de reloj)
2. En la configuración del módulo:
   - **Name**: "Nueva Cita Recibida"
   - **URL**: Se genera automáticamente
   - **Method**: POST
   - **Response**: JSON

**Paso 2: Copiar URL del Webhook**
1. Una vez configurado, copia la URL del webhook
2. Actualiza `MAKE_WEBHOOK_URL` en tu archivo `.env`
3. Actualiza `src/services/reservationService.ts`

### 2. Configurar Google Calendar

**Paso 1: Conectar Google Calendar**
1. Haz clic en el módulo "google-calendar:createAnEvent"
2. Selecciona "Add a connection"
3. Elige "Google Calendar"
4. Haz clic en "Add new connection"

**Paso 2: Autorizar Google**
1. Inicia sesión con tu cuenta de Google
2. Autoriza el acceso a Google Calendar
3. Selecciona el calendario de Punto Legal
4. Haz clic en "Allow"

**Paso 3: Configurar Evento**
```json
{
  "Calendar": "Punto Legal Calendar",
  "Summary": "Consulta Legal - {{cliente.nombre}}",
  "Description": "Cliente: {{cliente.nombre}}\nEmail: {{cliente.email}}\nServicio: {{servicio.nombre}}\nNotas: {{cita.notas}}",
  "Start": "{{cita.fecha}}T{{cita.hora}}:00",
  "End": "{{cita.fecha}}T{{cita.hora}}:00",
  "Location": "Google Meet - Enlace será enviado por email"
}
```

### 3. Configurar Gmail (Cliente)

**Paso 1: Conectar Gmail**
1. Haz clic en el primer módulo "gmail:SendEmail"
2. Selecciona "Add a connection"
3. Elige "Gmail"
4. Haz clic en "Add new connection"

**Paso 2: Autorizar Gmail**
1. Inicia sesión con info@puntolegal.cl
2. Habilita "Less secure app access" o usa contraseña de aplicación
3. Autoriza el acceso a Gmail
4. Haz clic en "Allow"

**Paso 3: Configurar Email**
```json
{
  "To": "{{cliente.email}}",
  "Subject": "Confirmación de Cita - Punto Legal",
  "Body": "Usar template HTML de confirmación",
  "Is HTML": true
}
```

### 4. Configurar Gmail (Abogado)

**Paso 1: Conectar Gmail**
1. Haz clic en el segundo módulo "gmail:SendEmail"
2. Selecciona "Add a connection"
3. Elige "Gmail"
4. Usa la misma conexión o crea una nueva

**Paso 2: Configurar Email**
```json
{
  "To": "abogado@puntolegal.cl",
  "Subject": "Nueva Cita Programada - {{cliente.nombre}}",
  "Body": "Usar template HTML de notificación al abogado",
  "Is HTML": true
}
```

## 🔄 Flujo Correcto del Escenario

### Orden de Ejecución:
1. **Webhook** → Recibe datos de la cita
2. **Google Calendar** → Crea evento en calendario
3. **Gmail Cliente** → Envía confirmación al cliente
4. **Gmail Abogado** → Notifica al abogado

### Conexiones entre Módulos:
- Webhook → Google Calendar (línea punteada)
- Google Calendar → Gmail Cliente (línea punteada)
- Gmail Cliente → Gmail Abogado (línea vertical)

## 🧪 Testing del Escenario

### Paso 1: Probar Webhook
1. Haz clic en "Run once" en el módulo webhook
2. Copia la URL del webhook
3. Usa Postman o curl para enviar datos de prueba:

```bash
curl -X POST "TU_URL_DEL_WEBHOOK" \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": {
      "nombre": "Juan Pérez",
      "email": "juan@test.com",
      "telefono": "+56912345678"
    },
    "servicio": {
      "nombre": "Consulta Laboral",
      "precio": 50000,
      "duracion": 60
    },
    "cita": {
      "fecha": "2025-01-15",
      "hora": "14:00",
      "notas": "Consulta sobre despido"
    }
  }'
```

### Paso 2: Verificar Ejecución
1. Revisa cada módulo en el flujo
2. Verifica que no haya errores
3. Confirma que se cree el evento en Google Calendar
4. Verifica que se envíen los emails

## 🚨 Errores Comunes y Soluciones

### Error: "Authentication failed"
**Solución:**
1. Revisa las credenciales de Google
2. Asegúrate de que la cuenta tenga permisos
3. Regenera las credenciales si es necesario

### Error: "Calendar not found"
**Solución:**
1. Verifica que el calendario existe
2. Asegúrate de que tienes permisos de escritura
3. Usa el ID correcto del calendario

### Error: "Email sending failed"
**Solución:**
1. Verifica la configuración SMTP
2. Usa contraseña de aplicación en lugar de contraseña normal
3. Habilita "Less secure app access"

### Error: "Webhook not receiving data"
**Solución:**
1. Verifica que la URL del webhook sea correcta
2. Asegúrate de que el método sea POST
3. Verifica el formato JSON de los datos

## 📋 Checklist de Verificación

### Antes de Activar el Escenario:
- [ ] Webhook configurado y funcionando
- [ ] Google Calendar conectado y autorizado
- [ ] Gmail conectado y autorizado
- [ ] Templates de email configurados
- [ ] Datos de prueba enviados exitosamente
- [ ] Eventos creados en Google Calendar
- [ ] Emails enviados correctamente
- [ ] URL del webhook actualizada en la aplicación

### Después de Activar:
- [ ] Escenario activado
- [ ] Monitoreo configurado
- [ ] Alertas de error configuradas
- [ ] Logs revisados regularmente

## 🔗 Recursos Adicionales

- [Documentación de Make.com](https://www.make.com/en/help)
- [Google Calendar API](https://developers.google.com/calendar)
- [Gmail API](https://developers.google.com/gmail/api)
- [Webhook Testing](https://webhook.site/)

## 📞 Soporte

Si los problemas persisten:
1. Revisa los logs de Make.com
2. Verifica la documentación oficial
3. Contacta al soporte de Make.com
4. Revisa las políticas de seguridad de Google 