# 🚀 Instrucciones para Importar Blueprint en Make.com

## 📋 Paso a Paso

### 1. Preparar el Blueprint
1. Abrir el archivo `make-scenario-blueprint.json`
2. Copiar todo el contenido del archivo
3. Guardar como `punto-legal-emails.json` en tu computadora

### 2. Crear Scenario en Make.com
1. Ir a [Make.com](https://www.make.com)
2. Iniciar sesión en tu cuenta
3. Hacer clic en **"Create a new scenario"**
4. Seleccionar **"Import scenario"**
5. Subir el archivo `punto-legal-emails.json`
6. Hacer clic en **"Import"**

### 3. Configurar Webhook
1. Hacer clic en el módulo **"Webhook Trigger"**
2. Copiar la URL del webhook generada
3. Ir a `src/services/makeEmailService.ts`
4. Reemplazar `https://hook.us2.make.com/your-webhook-url-here` con tu URL real
5. Guardar el archivo

### 4. Configurar Google Calendar
1. Hacer clic en el módulo **"Google Calendar Event"**
2. Hacer clic en **"Add connection"**
3. Seleccionar **"Google Calendar"**
4. Autorizar acceso a tu cuenta de Google
5. Seleccionar el calendario principal
6. Hacer clic en **"Save"**

### 5. Configurar Emails
1. Hacer clic en el módulo **"Email Cliente"**
2. Configurar tu servicio de email (Gmail, Outlook, etc.)
3. Hacer clic en **"Save"**
4. Repetir para el módulo **"Email Admin"**

### 6. Probar el Scenario
1. Hacer clic en **"Run once"**
2. Usar los datos de prueba del archivo JSON
3. Verificar que se envíen los emails
4. Confirmar que se cree el evento en Google Calendar

### 7. Activar el Scenario
1. Hacer clic en el botón **"Turn on"**
2. El scenario estará activo y funcionando
3. Probar con datos reales desde la aplicación

## 🧪 Datos de Prueba

```json
{
  "cliente": {
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "telefono": "+56 9 1234 5678"
  },
  "servicio": {
    "tipo": "Consulta Laboral",
    "precio": "30000",
    "fecha": "2024-01-15",
    "hora": "10:00"
  },
  "pago": {
    "metodo": "MercadoPago",
    "estado": "Aprobado",
    "fecha_pago": "2024-01-10T10:30:00Z"
  },
  "reserva": {
    "id": "12345",
    "tracking_code": "PL-ABC123",
    "google_meet_link": "https://meet.google.com/abc-def-ghi"
  },
  "calendar": {
    "start_date": "2024-01-15T10:00:00",
    "end_date": "2024-01-15T10:45:00"
  }
}
```

## ✅ Checklist de Verificación

- [ ] Blueprint importado correctamente
- [ ] Webhook URL actualizada en el código
- [ ] Google Calendar conectado
- [ ] Emails configurados
- [ ] Scenario probado con datos de prueba
- [ ] Emails se envían correctamente
- [ ] Evento se crea en Google Calendar
- [ ] Scenario activado en producción

## 🚨 Notas Importantes

1. **Seguridad:** No compartir URLs de webhook públicamente
2. **Testing:** Siempre probar antes de activar en producción
3. **Backup:** Guardar configuración del scenario
4. **Monitoreo:** Revisar logs de Make.com regularmente

## 🔧 Troubleshooting

### Webhook no recibe datos
- Verificar que la URL esté correcta
- Confirmar que el método sea POST
- Revisar que el Content-Type sea application/json

### Emails no se envían
- Verificar credenciales de email
- Confirmar configuración SMTP
- Revisar límites de envío

### Google Calendar no funciona
- Verificar permisos de Google Calendar
- Confirmar autenticación
- Revisar formato de fechas

## 📞 Soporte

Si tienes problemas con la configuración:
1. Revisar logs de Make.com
2. Verificar configuración de módulos
3. Probar con datos de prueba
4. Contactar soporte de Make.com si es necesario
