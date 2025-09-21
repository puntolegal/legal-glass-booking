# 🚀 Guía de Importación en Make.com

## ⚠️ Problema de CSP en Make.com

Si ves errores de Content Security Policy al intentar importar el blueprint en Make.com, sigue esta guía paso a paso.

## 📋 Método 1: Importación Manual (Recomendado)

### Paso 1: Crear Scenario Nuevo
1. Ir a [Make.com](https://www.make.com)
2. Hacer clic en **"Create a new scenario"**
3. Seleccionar **"Create a new scenario"** (NO importar)

### Paso 2: Agregar Módulos Manualmente

#### Módulo 1: Webhook
1. Buscar **"Webhooks"** en la biblioteca
2. Seleccionar **"Webhook"**
3. Configurar:
   - **URL**: Copiar la URL generada
   - **Método**: POST
   - **Content-Type**: application/json

#### Módulo 2: Email Cliente
1. Buscar **"Email"** en la biblioteca
2. Seleccionar **"Send an Email"**
3. Configurar:
   - **To**: `{{1.cliente.email}}`
   - **Subject**: `Confirmación de Consulta Legal - {{1.reserva.tracking_code}}`
   - **Body**: HTML
   - **HTML Body**: Copiar desde el archivo `email-templates/client-email.html`

#### Módulo 3: Email Admin
1. Buscar **"Email"** en la biblioteca
2. Seleccionar **"Send an Email"**
3. Configurar:
   - **To**: `puntolegalelgolf@gmail.com`
   - **Subject**: `Nueva Consulta Legal - {{1.reserva.tracking_code}}`
   - **Body**: HTML
   - **HTML Body**: Copiar desde el archivo `email-templates/admin-email.html`

#### Módulo 4: Google Calendar
1. Buscar **"Google Calendar"** en la biblioteca
2. Seleccionar **"Create an Event"**
3. Configurar:
   - **Calendar**: Primary
   - **Summary**: `Consulta Legal - {{1.cliente.nombre}}`
   - **Description**: `Consulta de {{1.servicio.tipo}} con {{1.cliente.nombre}}`
   - **Start**: `{{1.calendar.start_date}}`
   - **End**: `{{1.calendar.end_date}}`
   - **Attendees**: `{{1.cliente.email}}, puntolegalelgolf@gmail.com`

#### Módulo 5: Response
1. Buscar **"Webhooks"** en la biblioteca
2. Seleccionar **"Webhook Response"**
3. Configurar:
   - **Status**: 200
   - **Body**: JSON
   - **Content**: Copiar desde `response-template.json`

### Paso 3: Conectar Módulos
1. Conectar Webhook → Email Cliente
2. Conectar Webhook → Email Admin
3. Conectar Webhook → Google Calendar
4. Conectar Google Calendar → Response

## 📋 Método 2: Usar Blueprint Simplificado

### Paso 1: Descargar Archivo
1. Descargar `make-scenario-simple.json`
2. Guardar en tu computadora

### Paso 2: Importar en Make.com
1. Ir a Make.com
2. Hacer clic en **"Create a new scenario"**
3. Seleccionar **"Import scenario"**
4. Subir el archivo `make-scenario-simple.json`
5. Hacer clic en **"Import"**

### Paso 3: Configurar Conexiones
1. Configurar Google Calendar
2. Configurar Email (SMTP)
3. Probar con datos de prueba

## 📧 Templates de Email

### Email Cliente (client-email.html)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmación de Consulta Legal</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        header { background: linear-gradient(135deg, #ff6b35, #ff8e53); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
        h1 { margin: 0; font-size: 28px; }
        h2 { color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 10px; }
        .info-box { background: #f8f9fa; border-left: 4px solid #ff6b35; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .highlight { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; margin-top: 30px; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <header>
        <h1>✅ Consulta Legal Confirmada</h1>
        <p>Tu consulta ha sido procesada exitosamente</p>
    </header>
    
    <h2>Hola {{1.cliente.nombre}},</h2>
    <p>¡Tu consulta legal ha sido confirmada exitosamente!</p>
    
    <div class="info-box">
        <h3>📋 DETALLES DE TU CONSULTA</h3>
        <ul>
            <li><strong>Servicio:</strong> {{1.servicio.tipo}}</li>
            <li><strong>Fecha:</strong> {{1.servicio.fecha}}</li>
            <li><strong>Hora:</strong> {{1.servicio.hora}}</li>
            <li><strong>Duración:</strong> 45 minutos</li>
            <li><strong>Precio:</strong> ${{1.servicio.precio}}</li>
        </ul>
    </div>
    
    <div class="highlight">
        <h3>🔗 INFORMACIÓN IMPORTANTE</h3>
        <ul>
            <li><strong>Código de seguimiento:</strong> {{1.reserva.tracking_code}}</li>
            <li><strong>Link de Google Meet:</strong> <a href="{{1.reserva.google_meet_link}}" target="_blank">{{1.reserva.google_meet_link}}</a></li>
            <li><strong>ID de Reserva:</strong> {{1.reserva.id}}</li>
        </ul>
    </div>
    
    <div class="info-box">
        <h3>📅 PRÓXIMOS PASOS</h3>
        <ol>
            <li>Te contactaremos 24 horas antes de tu consulta</li>
            <li>Recibirás un recordatorio con el link de la videollamada</li>
            <li>Guarda este email como comprobante</li>
        </ol>
    </div>
    
    <p>Si tienes alguna pregunta, contáctanos al +56 9 XXXX XXXX</p>
    
    <div class="footer">
        <p><strong>Saludos,</strong><br>Equipo Punto Legal</p>
    </div>
</body>
</html>
```

### Email Admin (admin-email.html)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nueva Consulta Legal</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        header { background: linear-gradient(135deg, #dc3545, #e74c3c); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
        h1 { margin: 0; font-size: 28px; }
        h2 { color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 10px; }
        .info-box { background: #f8f9fa; border-left: 4px solid #dc3545; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .highlight { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; margin-top: 30px; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <header>
        <h1>📋 Nueva Consulta Legal</h1>
        <p>NUEVA CONSULTA LEGAL CONFIRMADA</p>
    </header>
    
    <div class="info-box">
        <h3>👤 CLIENTE</h3>
        <ul>
            <li><strong>Nombre:</strong> {{1.cliente.nombre}}</li>
            <li><strong>Email:</strong> {{1.cliente.email}}</li>
            <li><strong>Teléfono:</strong> {{1.cliente.telefono}}</li>
        </ul>
    </div>
    
    <div class="info-box">
        <h3>📋 SERVICIO</h3>
        <ul>
            <li><strong>Tipo:</strong> {{1.servicio.tipo}}</li>
            <li><strong>Fecha:</strong> {{1.servicio.fecha}}</li>
            <li><strong>Hora:</strong> {{1.servicio.hora}}</li>
            <li><strong>Precio:</strong> ${{1.servicio.precio}}</li>
        </ul>
    </div>
    
    <div class="info-box">
        <h3>💰 PAGO</h3>
        <ul>
            <li><strong>Método:</strong> {{1.pago.metodo}}</li>
            <li><strong>Estado:</strong> {{1.pago.estado}}</li>
            <li><strong>Fecha:</strong> {{1.pago.fecha_pago}}</li>
        </ul>
    </div>
    
    <div class="highlight">
        <h3>🔗 INFORMACIÓN TÉCNICA</h3>
        <ul>
            <li><strong>ID de Reserva:</strong> {{1.reserva.id}}</li>
            <li><strong>Código de seguimiento:</strong> {{1.reserva.tracking_code}}</li>
            <li><strong>Link de Google Meet:</strong> <a href="{{1.reserva.google_meet_link}}" target="_blank">{{1.reserva.google_meet_link}}</a></li>
        </ul>
    </div>
    
    <div class="info-box">
        <h3>📅 ACCIÓN REQUERIDA</h3>
        <ol>
            <li>Crear evento en Google Calendar</li>
            <li>Enviar recordatorio 24h antes</li>
            <li>Preparar documentación del caso</li>
        </ol>
    </div>
    
    <div class="footer">
        <p><strong>Equipo Punto Legal</strong></p>
    </div>
</body>
</html>
```

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

- [ ] Scenario creado en Make.com
- [ ] Webhook configurado
- [ ] Emails configurados con templates
- [ ] Google Calendar conectado
- [ ] Módulos conectados correctamente
- [ ] Probado con datos de prueba
- [ ] Emails se envían correctamente
- [ ] Evento se crea en calendario
- [ ] URL del webhook actualizada en el código

## 🚨 Solución de Problemas

### Error de CSP en Make.com
- **Solución**: Usar método de importación manual
- **Alternativa**: Usar blueprint simplificado

### Emails no se envían
- **Verificar**: Configuración SMTP
- **Revisar**: Credenciales de email
- **Probar**: Con datos de prueba

### Google Calendar no funciona
- **Verificar**: Permisos de Google Calendar
- **Revisar**: Autenticación
- **Probar**: Crear evento manual

### Variables no se mapean
- **Verificar**: Estructura de datos JSON
- **Revisar**: Nombres de variables
- **Probar**: Con datos de prueba
