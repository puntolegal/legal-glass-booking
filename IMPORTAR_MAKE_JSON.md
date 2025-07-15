# 📥 Guía para Importar JSON en Make.com

## 🎯 Objetivo
Importar el archivo `make-automation-blueprint.json` en Make.com para crear automáticamente el escenario de automatización.

## ⚠️ Importante: Limitaciones de Make.com

**Make.com NO permite importar archivos JSON directamente.** El archivo JSON que creamos es una **plantilla de referencia** que debes recrear manualmente en Make.com.

## 🔄 Proceso Alternativo: Recreación Manual

### Paso 1: Crear Nuevo Escenario
1. Inicia sesión en Make.com
2. Haz clic en "Create a new scenario"
3. Nombra el escenario: **"Sistema de Notificaciones Completo"**

### Paso 2: Agregar Módulos (Uno por Uno)

#### **Módulo 1: Webhook**
1. Busca "Webhook" en los módulos
2. Arrastra "Webhook" al canvas
3. Configura:
   - **Name**: "Nueva Cita Recibida"
   - **URL**: Se genera automáticamente
   - **Method**: POST
   - **Response**: JSON

#### **Módulo 2: Google Calendar**
1. Busca "Google Calendar" en los módulos
2. Arrastra "Create an event" al canvas
3. Conecta tu cuenta de Google
4. Configura:
   - **Calendar**: Tu calendario de Punto Legal
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
   - **End**: `{{cita.fecha}}T{{cita.hora}}:00` + duración

#### **Módulo 3: Gmail (Cliente)**
1. Busca "Gmail" en los módulos
2. Arrastra "Send an email" al canvas
3. Conecta tu cuenta de Gmail
4. Configura:
   - **To**: `{{cliente.email}}`
   - **Subject**: "Confirmación de Cita - Punto Legal"
   - **Body**: Usa el template HTML de confirmación

#### **Módulo 4: Gmail (Abogado)**
1. Duplica el módulo Gmail anterior
2. Configura:
   - **To**: `abogado@puntolegal.cl`
   - **Subject**: "Nueva Cita Programada - {{cliente.nombre}}"
   - **Body**: Usa el template HTML de notificación al abogado

#### **Módulo 5: Supabase (Opcional)**
1. Busca "Supabase" en los módulos
2. Arrastra "Insert a record" al canvas
3. Conecta tu base de datos Supabase
4. Configura:
   - **Table**: `reservations`
   - **Data**: Mapea los campos del webhook

### Paso 3: Conectar los Módulos
1. **Webhook** → **Google Calendar** (línea punteada)
2. **Google Calendar** → **Gmail Cliente** (línea punteada)
3. **Gmail Cliente** → **Gmail Abogado** (línea vertical)
4. **Webhook** → **Supabase** (línea punteada)

## 📋 Usar el Archivo JSON como Referencia

### Estructura del JSON
El archivo `make-automation-blueprint.json` contiene:

```json
{
  "modules": [
    {
      "id": "webhook-1",
      "name": "Nueva Cita Recibida",
      "type": "webhook",
      "config": {
        "method": "POST",
        "response": "JSON"
      }
    },
    {
      "id": "google-calendar-1",
      "name": "Crear Evento en Calendar",
      "type": "google-calendar",
      "config": {
        "action": "createAnEvent",
        "summary": "Consulta Legal - {{cliente.nombre}}"
      }
    }
  ]
}
```

### Configuraciones Específicas

#### **Datos del Webhook**
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
    "fecha": "string",
    "hora": "string",
    "notas": "string"
  }
}
```

#### **Configuración de Google Calendar**
- **Summary**: `Consulta Legal - {{cliente.nombre}}`
- **Description**: Incluir todos los datos del cliente
- **Start**: `{{cita.fecha}}T{{cita.hora}}:00`
- **End**: Calcular basado en duración del servicio

#### **Configuración de Gmail**
- **Cliente**: Template de confirmación
- **Abogado**: Template de notificación
- **HTML**: Habilitado para ambos

## 🧪 Testing del Escenario

### Paso 1: Probar Webhook
1. Copia la URL del webhook generada
2. Usa el script de prueba:
```bash
node scripts/test-webhook.js
```

### Paso 2: Verificar Ejecución
1. Revisa cada módulo en Make.com
2. Confirma que no haya errores
3. Verifica eventos en Google Calendar
4. Confirma envío de emails

## 🔧 Configuración de Variables

### En Make.com, configura estas variables:
- `PUNTO_LEGAL_EMAIL`: info@puntolegal.cl
- `ABOGADO_EMAIL`: abogado@puntolegal.cl
- `GOOGLE_CALENDAR_ID`: Tu ID de calendario
- `SUPABASE_URL`: URL de tu base de datos
- `SUPABASE_KEY`: Clave de API de Supabase

## 📝 Templates de Email

### Template de Confirmación (Cliente)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Confirmación de Cita - Punto Legal</title>
</head>
<body>
    <h1>¡Hola {{cliente.nombre}}!</h1>
    <p>Tu cita ha sido confirmada para el {{cita.fecha}} a las {{cita.hora}}.</p>
    <p><strong>Servicio:</strong> {{servicio.nombre}}</p>
    <p><strong>Precio:</strong> ${{servicio.precio}}</p>
    <p>Gracias por confiar en Punto Legal.</p>
</body>
</html>
```

### Template de Notificación (Abogado)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Nueva Cita Programada</title>
</head>
<body>
    <h1>Nueva Cita Programada</h1>
    <p><strong>Cliente:</strong> {{cliente.nombre}}</p>
    <p><strong>Email:</strong> {{cliente.email}}</p>
    <p><strong>Teléfono:</strong> {{cliente.telefono}}</p>
    <p><strong>Servicio:</strong> {{servicio.nombre}}</p>
    <p><strong>Fecha:</strong> {{cita.fecha}} {{cita.hora}}</p>
    <p><strong>Notas:</strong> {{cita.notas}}</p>
</body>
</html>
```

## 🚨 Solución de Problemas

### Error: "Module Not Found"
- Verifica que las conexiones estén configuradas
- Revisa las credenciales de las aplicaciones
- Asegúrate de que los módulos estén conectados

### Error: "Authentication failed"
- Regenera las credenciales de Google
- Verifica permisos de la cuenta
- Usa contraseñas de aplicación para Gmail

### Error: "Webhook not receiving data"
- Verifica la URL del webhook
- Confirma el método POST
- Revisa el formato JSON de los datos

## ✅ Checklist de Verificación

- [ ] Escenario creado en Make.com
- [ ] Webhook configurado y funcionando
- [ ] Google Calendar conectado
- [ ] Gmail conectado para cliente y abogado
- [ ] Supabase conectado (opcional)
- [ ] Módulos conectados correctamente
- [ ] Templates de email configurados
- [ ] Variables de entorno configuradas
- [ ] Testing realizado exitosamente
- [ ] Escenario activado

## 📞 Soporte

Si tienes problemas:
1. Revisa `MAKE_TROUBLESHOOTING.md`
2. Verifica la documentación oficial de Make.com
3. Contacta al soporte de Make.com
4. Revisa los logs de ejecución

---

**Nota**: El archivo JSON es una referencia. Debes recrear el escenario manualmente en Make.com siguiendo esta guía. 