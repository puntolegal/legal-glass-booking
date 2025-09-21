# 📧 Configuración de Make.com para Emails Automáticos

## 🎯 Objetivo
Configurar Make.com para enviar emails automáticos al cliente y admin, y crear eventos en Google Calendar.

## 🔧 Configuración Requerida

### 1. Webhook de Entrada
- **URL:** `https://hook.us2.make.com/your-webhook-url-here`
- **Método:** POST
- **Content-Type:** application/json

### 2. Datos de Entrada
```json
{
  "cliente": {
    "nombre": "string",
    "email": "string", 
    "telefono": "string"
  },
  "servicio": {
    "tipo": "string",
    "precio": "string",
    "fecha": "string",
    "hora": "string"
  },
  "pago": {
    "metodo": "string",
    "estado": "string",
    "fecha_pago": "string"
  },
  "reserva": {
    "id": "string",
    "tracking_code": "string",
    "google_meet_link": "string"
  },
  "emails": {
    "cliente": {
      "to": "string",
      "subject": "string",
      "template": "string"
    },
    "admin": {
      "to": "string",
      "subject": "string", 
      "template": "string"
    }
  },
  "calendar": {
    "title": "string",
    "description": "string",
    "start_date": "string",
    "duration_minutes": "number",
    "google_meet_link": "string",
    "attendees": ["array"]
  }
}
```

## 📧 Email al Cliente

### Template: `booking_confirmation_client`
```
Asunto: ✅ Confirmación de Consulta Legal - {{tracking_code}}

Hola {{cliente.nombre}},

¡Tu consulta legal ha sido confirmada exitosamente!

📋 DETALLES DE TU CONSULTA:
• Servicio: {{servicio.tipo}}
• Fecha: {{servicio.fecha}}
• Hora: {{servicio.hora}}
• Duración: 45 minutos
• Precio: ${{servicio.precio}}

🔗 INFORMACIÓN IMPORTANTE:
• Código de seguimiento: {{tracking_code}}
• Link de Google Meet: {{google_meet_link}}
• ID de Reserva: {{reserva.id}}

📅 PRÓXIMOS PASOS:
1. Te contactaremos 24 horas antes de tu consulta
2. Recibirás un recordatorio con el link de la videollamada
3. Guarda este email como comprobante

Si tienes alguna pregunta, contáctanos al +56 9 XXXX XXXX

Saludos,
Equipo Punto Legal
```

## 📧 Email al Admin

### Template: `booking_confirmation_admin`
```
Asunto: 📋 Nueva Consulta Legal - {{tracking_code}}

NUEVA CONSULTA LEGAL CONFIRMADA

👤 CLIENTE:
• Nombre: {{cliente.nombre}}
• Email: {{cliente.email}}
• Teléfono: {{cliente.telefono}}

📋 SERVICIO:
• Tipo: {{servicio.tipo}}
• Fecha: {{servicio.fecha}}
• Hora: {{servicio.hora}}
• Precio: ${{servicio.precio}}

💰 PAGO:
• Método: {{pago.metodo}}
• Estado: {{pago.estado}}
• Fecha: {{pago.fecha_pago}}

🔗 INFORMACIÓN TÉCNICA:
• ID de Reserva: {{reserva.id}}
• Código de seguimiento: {{tracking_code}}
• Link de Google Meet: {{google_meet_link}}

📅 ACCIÓN REQUERIDA:
1. Crear evento en Google Calendar
2. Enviar recordatorio 24h antes
3. Preparar documentación del caso

Equipo Punto Legal
```

## 📅 Google Calendar

### Configuración del Evento
- **Título:** `Consulta Legal - {{cliente.nombre}}`
- **Descripción:** `Consulta de {{servicio.tipo}} con {{cliente.nombre}}`
- **Fecha de inicio:** `{{calendar.start_date}}`
- **Duración:** `{{calendar.duration_minutes}} minutos`
- **Link de Google Meet:** `{{calendar.google_meet_link}}`
- **Asistentes:** `{{calendar.attendees}}`

## 🔧 Pasos de Configuración

### 1. Crear Scenario en Make.com
1. Ir a [Make.com](https://www.make.com)
2. Crear nuevo scenario
3. Agregar trigger "Webhook"

### 2. Configurar Webhook
1. Copiar URL del webhook
2. Actualizar en `src/services/makeEmailService.ts`
3. Configurar método POST

### 3. Agregar Módulos
1. **Email al Cliente:** Módulo de Email
2. **Email al Admin:** Módulo de Email  
3. **Google Calendar:** Módulo de Google Calendar

### 4. Configurar Templates
1. Crear templates de email
2. Configurar variables dinámicas
3. Probar envío

### 5. Activar Scenario
1. Activar el scenario
2. Probar con datos reales
3. Verificar emails y calendario

## 🧪 Testing

### Datos de Prueba
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
  }
}
```

## ✅ Checklist de Implementación

- [ ] Crear webhook en Make.com
- [ ] Configurar módulos de email
- [ ] Configurar Google Calendar
- [ ] Crear templates de email
- [ ] Actualizar URL del webhook en el código
- [ ] Probar envío de emails
- [ ] Probar creación de eventos
- [ ] Activar scenario en producción

## 🚨 Notas Importantes

1. **Seguridad:** No exponer credenciales en el código
2. **Fallback:** Mantener sistema de email simple como respaldo
3. **Logs:** Monitorear envío de emails y errores
4. **Testing:** Probar con datos reales antes de producción
