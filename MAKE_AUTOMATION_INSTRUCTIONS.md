# Instrucciones para Configurar Automatización en Make.com

## 1. Configuración Inicial en Make.com

### Crear Nuevo Escenario
1. Inicia sesión en Make.com
2. Haz clic en "Create a new scenario"
3. Nombra el escenario: "Punto Legal - Automatización de Citas"

## 2. Configurar Webhook de Entrada

### Paso 1: Agregar Webhook
1. Busca "Webhook" en los módulos
2. Arrastra "Webhook" al canvas
3. Configura:
   - **Name**: "Nueva Cita Recibida"
   - **URL**: Copia la URL que se genera automáticamente
   - **Method**: POST
   - **Response**: JSON

### Paso 2: Configurar Estructura de Datos
En el webhook, configura la estructura esperada:
```json
{
  "cliente": {
    "nombre": "string",
    "email": "string",
    "telefono": "string"
  },
  "servicio": {
    "nombre": "string",
    "precio": "number",
    "duracion": "number"
  },
  "cita": {
    "fecha": "string (ISO)",
    "hora": "string",
    "notas": "string"
  }
}
```

## 3. Configurar Google Calendar

### Paso 1: Conectar Google Calendar
1. Busca "Google Calendar" en los módulos
2. Arrastra "Create an event" al canvas
3. Conecta tu cuenta de Google
4. Selecciona el calendario de Punto Legal

### Paso 2: Configurar Evento
Configura el evento con estos datos:
- **Calendar**: Calendario de Punto Legal
- **Summary**: `Consulta Legal - {{cliente.nombre}}`
- **Description**: 
```
Cliente: {{cliente.nombre}}
Email: {{cliente.email}}
Teléfono: {{cliente.telefono}}
Servicio: {{servicio.nombre}}
Notas: {{cita.notas}}
```
- **Start**: `{{cita.fecha}}T{{cita.hora}}:00`
- **End**: `{{cita.fecha}}T{{cita.hora}}:00` + duración del servicio
- **Location**: "Google Meet - Enlace será enviado por email"

## 4. Configurar Gmail para Cliente

### Paso 1: Conectar Gmail
1. Busca "Gmail" en los módulos
2. Arrastra "Send an email" al canvas
3. Conecta tu cuenta de Gmail de Punto Legal

### Paso 2: Configurar Email de Confirmación
Configura el email:
- **To**: `{{cliente.email}}`
- **Subject**: `Confirmación de Cita - Punto Legal`
- **Body**: Usa el template HTML que se encuentra en `src/config/emailTemplates.ts`

## 5. Configurar Gmail para Abogado

### Paso 1: Agregar Segundo Módulo Gmail
1. Duplica el módulo Gmail anterior
2. Configura para enviar al abogado

### Paso 2: Configurar Email para Abogado
- **To**: `abogado@puntolegal.cl` (o el email del abogado)
- **Subject**: `Nueva Cita Programada - {{cliente.nombre}}`
- **Body**: Template de notificación para abogado

## 6. Configurar Recordatorios

### Paso 1: Agregar Router
1. Busca "Router" en los módulos
2. Arrastra al canvas después del webhook
3. Configura 2 rutas: "Confirmación" y "Recordatorio"

### Paso 2: Configurar Recordatorio
1. En la ruta "Recordatorio", agrega un módulo "Schedule"
2. Configura para ejecutar 1 hora antes de la cita
3. Conecta con Gmail para enviar recordatorio con enlace de Google Meet

## 7. Configurar Google Meet

### Paso 1: Agregar Módulo Google Meet
1. Busca "Google Meet" en los módulos
2. Arrastra "Create a meeting" al canvas
3. Conecta tu cuenta de Google

### Paso 2: Configurar Reunión
- **Summary**: `Consulta Legal - {{cliente.nombre}}`
- **Start**: `{{cita.fecha}}T{{cita.hora}}:00`
- **Duration**: `{{servicio.duracion}}` minutos
- **Attendees**: `{{cliente.email}}`

## 8. Configurar Supabase

### Paso 1: Conectar Supabase
1. Busca "Supabase" en los módulos
2. Arrastra "Insert a record" al canvas
3. Conecta tu base de datos Supabase

### Paso 2: Configurar Inserción
- **Table**: `reservations`
- **Data**: Mapea los campos del webhook a las columnas de la tabla

## 9. Flujo Completo del Escenario

### Orden de Ejecución:
1. **Webhook** → Recibe datos de la cita
2. **Router** → Decide si es confirmación o recordatorio
3. **Google Meet** → Crea reunión virtual
4. **Google Calendar** → Crea evento en calendario
5. **Supabase** → Guarda cita en base de datos
6. **Gmail Cliente** → Envía confirmación al cliente
7. **Gmail Abogado** → Notifica al abogado

## 10. Configuración de Webhook en la Aplicación

### Actualizar URL del Webhook
En `src/services/reservationService.ts`, actualiza la URL del webhook con la generada en Make.com:

```typescript
const MAKE_WEBHOOK_URL = 'TU_URL_DE_MAKE_AQUI';
```

## 11. Testing y Validación

### Probar el Flujo:
1. Crea una cita desde la aplicación
2. Verifica que se reciba en Make.com
3. Confirma que se cree el evento en Google Calendar
4. Verifica que se envíen los emails
5. Confirma que se guarde en Supabase

## 12. Configuración de Variables de Entorno

### En Make.com, configura estas variables:
- `PUNTO_LEGAL_EMAIL`: Email de Punto Legal
- `ABOGADO_EMAIL`: Email del abogado
- `GOOGLE_CALENDAR_ID`: ID del calendario de Google
- `SUPABASE_URL`: URL de tu base de datos
- `SUPABASE_KEY`: Clave de API de Supabase

## 13. Activación del Escenario

### Pasos Finales:
1. Revisa toda la configuración
2. Haz clic en "Save" para guardar el escenario
3. Haz clic en "Run once" para probar
4. Si todo funciona correctamente, activa el escenario

## 14. Monitoreo y Mantenimiento

### Configurar Alertas:
1. En Make.com, ve a "Monitoring"
2. Configura alertas para errores
3. Revisa los logs regularmente
4. Actualiza templates de email según sea necesario

## Notas Importantes:

- **Seguridad**: Asegúrate de que las credenciales estén protegidas
- **Backup**: Haz respaldo de la configuración del escenario
- **Testing**: Prueba con datos reales antes de activar en producción
- **Mantenimiento**: Revisa y actualiza la automatización regularmente

## Soporte:

Si encuentras problemas:
1. Revisa los logs en Make.com
2. Verifica las conexiones de las aplicaciones
3. Confirma que las credenciales sean correctas
4. Contacta al equipo de desarrollo si es necesario 