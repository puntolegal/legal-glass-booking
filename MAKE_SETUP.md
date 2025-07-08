# 🔧 Configuración de Make.com para Punto Legal

Esta guía te ayudará a configurar Make.com (anteriormente Integromat) para automatizar el envío de emails personalizados con recordatorios de citas y comprobantes de pago.

## 📋 Requisitos Previos

1. **Cuenta en Make.com**: Crear cuenta gratuita en [make.com](https://make.com)
2. **Proveedor de Email**: Gmail, Outlook, SendGrid, o similar
3. **Acceso a la aplicación**: Panel administrativo de Punto Legal

## 🚀 Paso 1: Crear el Escenario Principal

### 1.1 Crear Nuevo Escenario
1. Ve a Make.com Dashboard
2. Clic en "Create a new scenario"
3. Nombra el escenario: "Punto Legal - Notificaciones"

### 1.2 Configurar Webhook (Trigger)
1. Busca "Webhooks" en los módulos
2. Selecciona "Custom webhook"
3. Clic en "Add" para crear un nuevo webhook
4. Copia la URL generada (ejemplo: `https://hook.eu2.make.com/abc123def456`)
5. **IMPORTANTE**: Guarda esta URL en tu archivo `.env` como `VITE_MAKE_WEBHOOK_URL`

## 📧 Paso 2: Configurar Módulos de Email

### 2.1 Agregar Módulo de Gmail/Email
1. Busca "Gmail" o tu proveedor de email preferido
2. Selecciona "Send an Email"
3. Conecta tu cuenta de email
4. Autoriza los permisos necesarios

### 2.2 Configurar Router (Enrutador)
1. Agrega un módulo "Router" después del webhook
2. Esto permitirá manejar diferentes tipos de notificaciones:
   - `nueva_reserva` → Email de confirmación
   - `recordatorio` → Email de recordatorio
   - `comprobante` → Email con comprobante de pago

## 🎨 Paso 3: Crear Templates de Email

### 3.1 Template de Confirmación de Reserva

**Asunto**: `✅ Confirmación de cita - {{reserva.servicio}} - Punto Legal`

**Cuerpo HTML**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .btn { display: inline-block; background: #f97316; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 ¡Cita Confirmada!</h1>
            <p>Tu reunión con Punto Legal está agendada</p>
        </div>
        
        <div class="content">
            <p>Estimado/a <strong>{{reserva.nombre}}</strong>,</p>
            
            <p>Nos complace confirmar que tu cita ha sido agendada exitosamente. A continuación los detalles:</p>
            
            <div class="info-box">
                <h3>📋 Detalles de la Cita</h3>
                <ul>
                    <li><strong>Servicio:</strong> {{reserva.servicio}}</li>
                    <li><strong>Fecha:</strong> {{reserva.fecha}}</li>
                    <li><strong>Hora:</strong> {{reserva.hora}}</li>
                    <li><strong>Precio:</strong> ${{reserva.precio}}</li>
                    <li><strong>Categoría:</strong> {{reserva.categoria}}</li>
                    <li><strong>Tipo:</strong> {{reserva.tipo_reunion}}</li>
                </ul>
            </div>
            
            <div class="info-box">
                <h3>📍 Información de Contacto</h3>
                <ul>
                    <li><strong>Dirección:</strong> {{empresa.direccion}}</li>
                    <li><strong>Teléfono:</strong> {{empresa.telefono}}</li>
                    <li><strong>Email:</strong> {{empresa.email}}</li>
                    <li><strong>WhatsApp:</strong> <a href="{{empresa.whatsapp}}">Contactar</a></li>
                </ul>
            </div>
            
            <p><strong>🔔 Recordatorio:</strong> Te enviaremos un recordatorio 24 horas antes de tu cita.</p>
            
            <p><strong>💼 Preparación:</strong> Por favor trae todos los documentos relevantes a tu consulta.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{empresa.website}}" class="btn">Visitar Punto Legal</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Punto Legal - Expertos en derecho</p>
            <p><small>Este email fue enviado automáticamente. No responder a este mensaje.</small></p>
        </div>
    </div>
</body>
</html>
```

### 3.2 Template de Recordatorio

**Asunto**: `🔔 Recordatorio: Tu cita con Punto Legal es mañana`

**Cuerpo HTML**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px; }
        .btn-secondary { background: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Recordatorio de Cita</h1>
            <p>Tu reunión es mañana</p>
        </div>
        
        <div class="content">
            <p>Hola <strong>{{reserva.nombre}}</strong>,</p>
            
            <div class="alert-box">
                <h3>⏰ Tu cita es MAÑANA</h3>
                <p>Te recordamos que tienes una cita agendada con nosotros.</p>
            </div>
            
            <div class="info-box">
                <h3>📋 Detalles de tu Cita</h3>
                <ul>
                    <li><strong>Servicio:</strong> {{reserva.servicio}}</li>
                    <li><strong>Fecha:</strong> {{reserva.fecha}}</li>
                    <li><strong>Hora:</strong> {{reserva.hora}}</li>
                    <li><strong>Dirección:</strong> {{empresa.direccion}}</li>
                </ul>
            </div>
            
            <div class="info-box">
                <h3>📝 Qué traer a la cita</h3>
                <ul>
                    <li>Documentos de identidad</li>
                    <li>Documentación relevante al caso</li>
                    <li>Lista de preguntas preparadas</li>
                    <li>Cualquier correspondencia previa</li>
                </ul>
            </div>
            
            <p><strong>📱 Contacto de emergencia:</strong> {{empresa.telefono}}</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{enlace_reagendar}}" class="btn">Reprogramar Cita</a>
                <a href="{{enlace_cancelar}}" class="btn btn-secondary">Cancelar Cita</a>
                <a href="{{empresa.whatsapp}}" class="btn">WhatsApp</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Punto Legal - Te esperamos mañana</p>
            <p><small>Si necesitas cambiar tu cita, hazlo al menos 2 horas antes.</small></p>
        </div>
    </div>
</body>
</html>
```

### 3.3 Template de Comprobante de Pago

**Asunto**: `💰 Comprobante de pago - {{pago.numero_comprobante}} - Punto Legal`

**Cuerpo HTML**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border: 2px solid #059669; }
        .amount { font-size: 2em; color: #059669; font-weight: bold; text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .btn { display: inline-block; background: #059669; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
        .label { font-weight: bold; color: #374151; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💰 Comprobante de Pago</h1>
            <p>Tu pago ha sido procesado exitosamente</p>
        </div>
        
        <div class="content">
            <p>Estimado/a <strong>{{reserva.nombre}}</strong>,</p>
            
            <p>Hemos recibido tu pago exitosamente. A continuación el comprobante:</p>
            
            <div class="receipt-box">
                <h3 style="text-align: center; color: #059669;">🧾 COMPROBANTE DE PAGO</h3>
                
                <div class="amount">${{pago.monto}}</div>
                
                <table>
                    <tr>
                        <td class="label">Número de Comprobante:</td>
                        <td>{{pago.numero_comprobante}}</td>
                    </tr>
                    <tr>
                        <td class="label">Fecha de Pago:</td>
                        <td>{{pago.fecha_pago}}</td>
                    </tr>
                    <tr>
                        <td class="label">Servicio:</td>
                        <td>{{reserva.servicio}}</td>
                    </tr>
                    <tr>
                        <td class="label">Método de Pago:</td>
                        <td>{{pago.metodo}}</td>
                    </tr>
                    <tr>
                        <td class="label">Número de Transacción:</td>
                        <td>{{pago.numero_transaccion}}</td>
                    </tr>
                    <tr>
                        <td class="label">Estado:</td>
                        <td style="color: #059669; font-weight: bold;">✅ PAGADO</td>
                    </tr>
                </table>
            </div>
            
            <p><strong>📅 Recordatorio de tu cita:</strong></p>
            <ul>
                <li><strong>Fecha:</strong> {{reserva.fecha}}</li>
                <li><strong>Hora:</strong> {{reserva.hora}}</li>
                <li><strong>Dirección:</strong> {{empresa.direccion}}</li>
            </ul>
            
            <p><strong>💼 Información importante:</strong></p>
            <ul>
                <li>Guarda este comprobante para tus registros</li>
                <li>Puedes presentarlo el día de tu cita</li>
                <li>Para cualquier consulta, contacta a {{empresa.telefono}}</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{empresa.website}}" class="btn">Punto Legal</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Punto Legal - Comprobante válido</p>
            <p><small>Este documento es un comprobante oficial de pago.</small></p>
        </div>
    </div>
</body>
</html>
```

## 🔄 Paso 4: Configurar Filtros y Condiciones

### 4.1 Configurar Router con Filtros
1. **Ruta 1 - Nueva Reserva**:
   - Filtro: `{{1.tipo_evento}} = nueva_reserva`
   - Acción: Enviar email de confirmación

2. **Ruta 2 - Recordatorio**:
   - Filtro: `{{1.tipo_evento}} = recordatorio`
   - Acción: Enviar email de recordatorio

3. **Ruta 3 - Comprobante**:
   - Filtro: `{{1.tipo_evento}} = comprobante`
   - Acción: Enviar email con comprobante

### 4.2 Mapear Variables en Cada Email
Para cada ruta, mapea las variables del webhook a los campos del email:

**Variables disponibles del webhook**:
- `{{1.reserva.nombre}}`
- `{{1.reserva.email}}`
- `{{1.reserva.telefono}}`
- `{{1.reserva.fecha}}`
- `{{1.reserva.hora}}`
- `{{1.reserva.servicio}}`
- `{{1.reserva.precio}}`
- `{{1.empresa.nombre}}`
- `{{1.empresa.telefono}}`
- `{{1.empresa.email}}`
- `{{1.pago.numero_comprobante}}` (solo para comprobantes)

## 🎯 Paso 5: Configurar Recordatorios Automáticos

### 5.1 Crear Escenario de Recordatorios
1. Crear nuevo escenario: "Punto Legal - Recordatorios Diarios"
2. Trigger: Webhook o Scheduler (ejecutar diariamente)
3. Conectar con la base de datos de reservas
4. Filtrar citas para mañana
5. Enviar webhook al escenario principal

### 5.2 Configurar Scheduler
1. Usar módulo "Schedule"
2. Configurar: Todos los días a las 18:00
3. Conectar con tu base de datos
4. Filtrar reservas para el día siguiente
5. Para cada reserva, enviar webhook de tipo "recordatorio"

## 🛠️ Paso 6: Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# Make.com Configuration
VITE_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/TU_WEBHOOK_ID_AQUI

# Empresa Information
VITE_EMPRESA_NOMBRE=Punto Legal
VITE_EMPRESA_EMAIL=puntolegalelgolf@gmail.com
VITE_EMPRESA_TELEFONO=+56962321883
VITE_EMPRESA_WHATSAPP=https://wa.me/56962321883
VITE_EMPRESA_DIRECCION=El Golf, Las Condes, Santiago
VITE_EMPRESA_WEBSITE=https://punto-legal.cl
```

## 🧪 Paso 7: Probar el Sistema

### 7.1 Prueba Manual
1. Usa el panel de notificaciones en la aplicación
2. Clic en "Probar Conexión"
3. Verifica que llegue el email de prueba

### 7.2 Prueba de Reserva Real
1. Agenda una cita desde la aplicación
2. Verifica que llegue el email de confirmación
3. Comprueba que se registre en Make

### 7.3 Prueba de Recordatorios
1. Ejecuta manualmente el escenario de recordatorios
2. Verifica emails para citas de mañana

## 📊 Paso 8: Monitoreo y Logs

### 8.1 Ver Logs en Make
1. Ve a "History" en tu escenario
2. Revisa ejecuciones exitosas y fallidas
3. Diagnostica errores en los datos

### 8.2 Panel de Administración
Usa el panel de notificaciones en la aplicación para:
- Ver estadísticas de envío
- Reenviar notificaciones fallidas
- Ejecutar recordatorios manualmente
- Probar conexiones

## 🚨 Solución de Problemas

### Problemas Comunes:

1. **Webhook no recibe datos**:
   - Verifica la URL del webhook
   - Revisa las variables de entorno
   - Comprueba la conexión a internet

2. **Emails no se envían**:
   - Verifica conexión del proveedor de email
   - Revisa permisos de la cuenta
   - Comprueba filtros de spam

3. **Variables vacías en emails**:
   - Verifica mapeo de variables
   - Revisa estructura del JSON enviado
   - Comprueba sintaxis de plantillas

4. **Recordatorios no se ejecutan**:
   - Verifica configuración del scheduler
   - Revisa filtros de fecha
   - Comprueba estado de las reservas

## 📞 Soporte

Para soporte adicional:
- **Email**: puntolegalelgolf@gmail.com
- **WhatsApp**: +56962321883
- **Documentación Make**: [help.make.com](https://help.make.com)

---

**¡Tu sistema de notificaciones automáticas está listo! 🎉**

Los clientes ahora recibirán:
- ✅ Confirmación inmediata de reserva
- 🔔 Recordatorio 24h antes de la cita  
- 💰 Comprobante de pago automático 