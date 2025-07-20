# 🚀 Guía de Configuración de Make.com para Punto Legal

## 📋 Resumen

Esta guía te ayudará a configurar un escenario completo en Make.com que procese las solicitudes de consulta de tu aplicación web Punto Legal.

## 🎯 Qué hace el escenario

1. **Recibe datos** del webhook cuando un usuario solicita una consulta
2. **Valida** que los campos requeridos estén presentes
3. **Guarda** la solicitud en la base de datos Supabase
4. **Envía email** al administrador con los detalles
5. **Envía email** de confirmación al cliente
6. **Actualiza** el estado de la notificación

## 📋 Paso a Paso

### PASO 1: Crear un nuevo escenario

1. Ve a [https://eu2.make.com](https://eu2.make.com)
2. Inicia sesión en tu cuenta
3. Haz clic en **"Create a new scenario"**
4. Busca y selecciona **"Webhook"** como primer módulo

### PASO 2: Configurar el Webhook

1. En el módulo Webhook, haz clic en **"Add"**
2. Selecciona **"Custom webhook"**
3. Copia la **URL del webhook** que se genera
4. **Guarda esta URL** - la necesitarás para tu aplicación

### PASO 3: Agregar módulo JSON Parser

1. Haz clic en el **"+"** después del webhook
2. Busca **"JSON"** y selecciona **"JSON"**
3. Configura:
   - **Operation**: Parse JSON
   - **Source**: `{{webhook.body}}`

### PASO 4: Agregar módulo Filter

1. Haz clic en el **"+"** después del JSON parser
2. Busca **"Filter"** y selecciona **"Filter"**
3. Configura las condiciones:
   - `{{json.name}}` **is not empty**
   - `{{json.email}}` **is not empty**
   - `{{json.phone}}` **is not empty**

### PASO 5: Agregar módulo Database (Supabase)

1. Haz clic en el **"+"** después del filter
2. Busca **"Supabase"** y selecciona **"Supabase"**
3. Configura la conexión a tu base de datos:
   - **URL**: Tu URL de Supabase
   - **API Key**: Tu API key de Supabase
4. Configura:
   - **Operation**: Insert a record
   - **Table**: `notifications`
   - **Data**:
     ```json
     {
       "user_id": "{{json.user_id}}",
       "type": "consultation_request",
       "title": "Nueva solicitud de consulta",
       "message": "Cliente {{json.name}} solicitó una consulta para {{json.service}}",
       "data": "{{json}}",
       "status": "pending",
       "created_at": "{{now}}"
     }
     ```

### PASO 6: Agregar módulo Email (Gmail/SMTP)

1. Haz clic en el **"+"** después del database
2. Busca **"Gmail"** o **"SMTP"** y selecciona
3. Configura la conexión de email
4. Configura:
   - **To**: `admin@puntolegal.cl`
   - **Subject**: `Nueva solicitud de consulta - {{json.name}}`
   - **Body**: (ver template abajo)

### PASO 7: Agregar segundo módulo Email

1. Haz clic en el **"+"** después del primer email
2. Configura email de confirmación al cliente:
   - **To**: `{{json.email}}`
   - **Subject**: `Confirmación de solicitud - Punto Legal`
   - **Body**: (ver template abajo)

### PASO 8: Actualizar estado de notificación

1. Haz clic en el **"+"** después del segundo email
2. Busca **"Supabase"** y selecciona
3. Configura:
   - **Operation**: Update a record
   - **Table**: `notifications`
   - **Where**: `id = {{database.id}}`
   - **Data**:
     ```json
     {
       "status": "processed",
       "processed_at": "{{now}}"
     }
     ```

### PASO 9: Activar el escenario

1. Haz clic en **"Save"**
2. Haz clic en **"Run once"** para probar
3. Si funciona, haz clic en **"Set up a schedule"**
4. Selecciona **"Manual"** para ejecución manual

## 📧 Templates de Email

### Email al Administrador

```
Se ha recibido una nueva solicitud de consulta:

Nombre: {{json.name}}
Email: {{json.email}}
Teléfono: {{json.phone}}
Servicio: {{json.service}}
Fecha: {{json.date}}
Hora: {{json.time}}
Mensaje: {{json.message}}

Responder a: {{json.email}}
```

### Email de Confirmación al Cliente

```
Hola {{json.name}},

Hemos recibido tu solicitud de consulta para {{json.service}}.

Fecha solicitada: {{json.date}}
Hora: {{json.time}}

Nos pondremos en contacto contigo pronto para confirmar los detalles.

Saludos,
Equipo Punto Legal
```

## 🔗 Configurar la URL del Webhook

Una vez que tengas la URL del webhook, actualízala en tu aplicación:

### En `src/config/notifications.ts`:

```typescript
export const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/TU_WEBHOOK_ID';
```

### O como variable de entorno:

```bash
MAKE_WEBHOOK_URL=https://hook.eu2.make.com/TU_WEBHOOK_ID
```

## 🧪 Probar el Webhook

Usa el script de prueba incluido:

```bash
# Configurar la URL del webhook
export MAKE_WEBHOOK_URL="https://hook.eu2.make.com/TU_WEBHOOK_ID"

# Ejecutar la prueba
node scripts/test-make-webhook.js
```

## 📊 Verificar que funciona

1. **En Make.com**: Revisa los logs de ejecución del escenario
2. **En Supabase**: Verifica que se crearon las notificaciones
3. **En tu email**: Confirma que recibiste los emails
4. **En la aplicación**: Prueba enviando una solicitud real

## 🔧 Solución de Problemas

### El webhook no responde
- Verifica que la URL sea correcta
- Asegúrate de que el escenario esté activo
- Revisa los logs de Make.com

### Los emails no se envían
- Verifica las credenciales de email
- Revisa la configuración SMTP/Gmail
- Confirma que las direcciones de email sean válidas

### Error en la base de datos
- Verifica las credenciales de Supabase
- Confirma que la tabla `notifications` existe
- Revisa los permisos de la API key

### Datos faltantes
- Verifica que el JSON se esté parseando correctamente
- Confirma que los campos requeridos estén presentes
- Revisa el formato de los datos enviados

## 📝 Notas Importantes

- **Backup**: Guarda una copia de tu escenario
- **Testing**: Siempre prueba con datos de prueba antes de usar en producción
- **Monitoring**: Revisa regularmente los logs de ejecución
- **Security**: No compartas las URLs de webhook públicamente

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu sistema de notificaciones estará funcionando completamente. Cada vez que un usuario solicite una consulta en tu aplicación, Make.com procesará automáticamente la solicitud y enviará las notificaciones correspondientes. 