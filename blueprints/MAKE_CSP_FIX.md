# 🔧 Solución para Errores de CSP en Make.com

## ❌ Problemas Identificados

Los errores que estás viendo son causados por:
1. **Content Security Policy** de Make.com bloquea scripts inline
2. **Recursos externos** no permitidos (cdn.rudderlabs.com)
3. **CORB (Cross-Origin Read Blocking)** bloquea respuestas

## ✅ Solución: Crear Scenario Manualmente

### Paso 1: Crear Scenario Nuevo
1. Ir a [Make.com](https://www.make.com)
2. Hacer clic en **"Create a new scenario"**
3. Seleccionar **"Create a new scenario"** (NO importar JSON)

### Paso 2: Agregar Módulos Uno por Uno

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
   - **Subject**: `Confirmacion de Consulta Legal - {{1.reserva.tracking_code}}`
   - **Body**: HTML
   - **HTML Body**: Copiar desde abajo

#### Módulo 3: Email Admin
1. Buscar **"Email"** en la biblioteca
2. Seleccionar **"Send an Email"**
3. Configurar:
   - **To**: `puntolegalelgolf@gmail.com`
   - **Subject**: `Nueva Consulta Legal - {{1.reserva.tracking_code}}`
   - **Body**: HTML
   - **HTML Body**: Copiar desde abajo

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
   - **Content**: 
   ```json
   {
     "success": true,
     "message": "Emails enviados exitosamente",
     "tracking_code": "{{1.reserva.tracking_code}}",
     "google_meet_link": "{{1.reserva.google_meet_link}}",
     "reservation_id": "{{1.reserva.id}}"
   }
   ```

### Paso 3: Conectar Módulos
1. Conectar Webhook → Email Cliente
2. Conectar Webhook → Email Admin
3. Conectar Webhook → Google Calendar
4. Conectar Google Calendar → Response

## 📧 Templates de Email (Sin Caracteres Especiales)

### Email Cliente
```html
<h1>Consulta Legal Confirmada</h1>
<p>Hola {{1.cliente.nombre}},</p>
<p>Tu consulta legal ha sido confirmada exitosamente.</p>

<h2>Detalles de tu consulta:</h2>
<ul>
<li>Servicio: {{1.servicio.tipo}}</li>
<li>Fecha: {{1.servicio.fecha}}</li>
<li>Hora: {{1.servicio.hora}}</li>
<li>Precio: ${{1.servicio.precio}}</li>
</ul>

<h2>Informacion importante:</h2>
<ul>
<li>Codigo de seguimiento: {{1.reserva.tracking_code}}</li>
<li>Link de Google Meet: <a href="{{1.reserva.google_meet_link}}">{{1.reserva.google_meet_link}}</a></li>
<li>ID de Reserva: {{1.reserva.id}}</li>
</ul>

<p>Te contactaremos 24 horas antes de tu consulta.</p>
<p>Saludos,<br>Equipo Punto Legal</p>
```

### Email Admin
```html
<h1>Nueva Consulta Legal</h1>

<h2>Cliente:</h2>
<ul>
<li>Nombre: {{1.cliente.nombre}}</li>
<li>Email: {{1.cliente.email}}</li>
<li>Telefono: {{1.cliente.telefono}}</li>
</ul>

<h2>Servicio:</h2>
<ul>
<li>Tipo: {{1.servicio.tipo}}</li>
<li>Fecha: {{1.servicio.fecha}}</li>
<li>Hora: {{1.servicio.hora}}</li>
<li>Precio: ${{1.servicio.precio}}</li>
</ul>

<h2>Pago:</h2>
<ul>
<li>Metodo: {{1.pago.metodo}}</li>
<li>Estado: {{1.pago.estado}}</li>
<li>Fecha: {{1.pago.fecha_pago}}</li>
</ul>

<h2>Informacion tecnica:</h2>
<ul>
<li>ID de Reserva: {{1.reserva.id}}</li>
<li>Codigo de seguimiento: {{1.reserva.tracking_code}}</li>
<li>Link de Google Meet: <a href="{{1.reserva.google_meet_link}}">{{1.reserva.google_meet_link}}</a></li>
</ul>

<p>Equipo Punto Legal</p>
```

## 🧪 Datos de Prueba

```json
{
  "cliente": {
    "nombre": "Juan Perez",
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

## 🔧 Configuración de Conexiones

### Google Calendar
1. Hacer clic en el módulo Google Calendar
2. Hacer clic en **"Add connection"**
3. Seleccionar **"Google Calendar"**
4. Autorizar acceso a tu cuenta de Google
5. Seleccionar el calendario principal

### Email
1. Hacer clic en el módulo Email
2. Hacer clic en **"Add connection"**
3. Seleccionar tu servicio de email (Gmail, Outlook, etc.)
4. Autorizar acceso
5. Configurar remitente

## ✅ Checklist de Verificación

- [ ] Scenario creado manualmente
- [ ] Webhook configurado
- [ ] Emails configurados con templates simples
- [ ] Google Calendar conectado
- [ ] Módulos conectados correctamente
- [ ] Probado con datos de prueba
- [ ] Emails se envían correctamente
- [ ] Evento se crea en calendario
- [ ] URL del webhook actualizada en el código

## 🚨 Solución de Problemas

### Error de CSP
- **Solución**: Crear scenario manualmente
- **Evitar**: Importar JSON con caracteres especiales

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

## 📝 Notas Importantes

1. **Evitar caracteres especiales** en templates HTML
2. **Usar HTML simple** sin CSS inline
3. **Crear scenario manualmente** para evitar CSP
4. **Probar cada módulo** individualmente
5. **Verificar conexiones** antes de activar
