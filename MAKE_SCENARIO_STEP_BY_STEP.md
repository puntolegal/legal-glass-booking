# 🛠️ Crear Escenario Make.com - Paso a Paso

## ⚠️ Importante: Make.com NO lee archivos JSON

Make.com **NO puede importar archivos JSON**. Debes crear el escenario **manualmente** siguiendo estas instrucciones.

---

## 🎯 Paso 1: Crear Nuevo Escenario

### 1.1 Acceder a Make.com
1. Ve a [make.com](https://www.make.com)
2. Inicia sesión con tu cuenta
3. Haz clic en **"Create a new scenario"**

### 1.2 Nombrar el Escenario
- **Nombre**: `Punto Legal - Sistema de Notificaciones`
- **Descripción**: `Automatización para procesar citas y enviar notificaciones automáticas`

---

## 🔧 Paso 2: Agregar Módulo Webhook

### 2.1 Buscar Webhook
1. En el panel izquierdo, busca **"Webhook"**
2. Arrastra el módulo **"Webhook"** al canvas
3. Colócalo en la posición inicial (izquierda)

### 2.2 Configurar Webhook
1. Haz clic en el módulo webhook
2. En la configuración:
   - **Name**: `Nueva Cita Recibida`
   - **URL**: Se genera automáticamente (copia esta URL)
   - **Method**: `POST`
   - **Response**: `JSON`
   - **Headers**: Dejar por defecto

### 2.3 Copiar URL del Webhook
- Copia la URL que se genera (ejemplo: `https://hook.eu1.make.com/abc123...`)
- **Guarda esta URL** - la necesitarás para la aplicación

---

## 📅 Paso 3: Agregar Google Calendar

### 3.1 Buscar Google Calendar
1. En el panel izquierdo, busca **"Google Calendar"**
2. Arrastra **"Create an event"** al canvas
3. Colócalo a la derecha del webhook

### 3.2 Conectar Google Calendar
1. Haz clic en el módulo Google Calendar
2. Haz clic en **"Add a connection"**
3. Selecciona **"Google Calendar"**
4. Haz clic en **"Add new connection"**
5. Inicia sesión con tu cuenta de Google
6. Autoriza el acceso a Google Calendar
7. Selecciona el calendario de Punto Legal

### 3.3 Configurar Evento
En la configuración del evento:
- **Calendar**: `Tu calendario de Punto Legal`
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
- **End**: `{{cita.fecha}}T{{cita.hora}}:00` (ajustar según duración)
- **Location**: `Google Meet - Enlace será enviado por email`

---

## 📧 Paso 4: Agregar Gmail (Cliente)

### 4.1 Buscar Gmail
1. En el panel izquierdo, busca **"Gmail"**
2. Arrastra **"Send an email"** al canvas
3. Colócalo a la derecha del Google Calendar

### 4.2 Conectar Gmail
1. Haz clic en el módulo Gmail
2. Haz clic en **"Add a connection"**
3. Selecciona **"Gmail"**
4. Haz clic en **"Add new connection"**
5. Inicia sesión con `info@puntolegal.cl`
6. **IMPORTANTE**: Usa contraseña de aplicación, NO tu contraseña normal
7. Autoriza el acceso a Gmail

### 4.3 Configurar Email Cliente
En la configuración del email:
- **To**: `{{cliente.email}}`
- **Subject**: `Confirmación de Cita - Punto Legal`
- **Body**: Copia el template de confirmación (ver abajo)
- **Is HTML**: ✅ Marcar como HTML

### 4.4 Template de Confirmación (Cliente)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Confirmación de Cita - Punto Legal</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="margin: 0;">PUNTO LEGAL</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Asesoría Jurídica Especializada</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1e3c72;">¡Hola {{cliente.nombre}}!</h2>
            
            <p>Tu cita ha sido confirmada exitosamente. Nos complace informarte que tu consulta legal está programada.</p>
            
            <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #1e3c72;">
                <h3 style="color: #1e3c72; margin-top: 0;">📋 Detalles de tu Cita</h3>
                <p><strong>Servicio:</strong> {{servicio.nombre}}</p>
                <p><strong>Fecha:</strong> {{cita.fecha}}</p>
                <p><strong>Hora:</strong> {{cita.hora}}</p>
                <p><strong>Precio:</strong> ${{servicio.precio}}</p>
            </div>
            
            <div style="background: rgba(255, 193, 7, 0.1); border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <strong>📅 Recordatorio:</strong> Te enviaremos un recordatorio 1 hora antes de tu cita con el enlace de la reunión.
            </div>
            
            <p>Si necesitas reprogramar o cancelar tu cita, por favor contáctanos con al menos 24 horas de anticipación.</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666;">
            <p><strong>Contacto:</strong></p>
            <p>📧 info@puntolegal.cl</p>
            <p>📞 +56 9 1234 5678</p>
            <p>🌐 www.puntolegal.cl</p>
        </div>
    </div>
</body>
</html>
```

---

## 📧 Paso 5: Agregar Gmail (Abogado)

### 5.1 Duplicar Módulo Gmail
1. Haz clic derecho en el módulo Gmail del cliente
2. Selecciona **"Duplicate"** o **"Copy"**
3. Pega el módulo duplicado debajo del primero

### 5.2 Configurar Email Abogado
En la configuración del email duplicado:
- **To**: `abogado@puntolegal.cl`
- **Subject**: `Nueva Cita Programada - {{cliente.nombre}}`
- **Body**: Copia el template de notificación al abogado (ver abajo)
- **Is HTML**: ✅ Marcar como HTML

### 5.3 Template de Notificación (Abogado)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Nueva Cita Programada - Punto Legal</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="margin: 0;">NUEVA CITA</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Notificación para Abogado</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #dc3545;">Nueva Cita Programada</h2>
            
            <p>Se ha programado una nueva consulta legal. Revisa los detalles a continuación:</p>
            
            <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc3545;">
                <h3 style="color: #dc3545; margin-top: 0;">👤 Información del Cliente</h3>
                <p><strong>Cliente:</strong> {{cliente.nombre}}</p>
                <p><strong>Email:</strong> {{cliente.email}}</p>
                <p><strong>Teléfono:</strong> {{cliente.telefono}}</p>
                <p><strong>Servicio:</strong> {{servicio.nombre}}</p>
                <p><strong>Fecha:</strong> {{cita.fecha}}</p>
                <p><strong>Hora:</strong> {{cita.hora}}</p>
            </div>
            
            {{#if cita.notas}}
            <div style="background: rgba(255, 193, 7, 0.1); border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <strong>📝 Notas del Cliente:</strong><br>
                {{cita.notas}}
            </div>
            {{/if}}
            
            <div style="background: #e9ecef; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="margin-top: 0;">Acciones Requeridas:</h4>
                <ul>
                    <li>Revisar la información del cliente</li>
                    <li>Preparar la consulta según el servicio solicitado</li>
                    <li>Confirmar disponibilidad para la fecha y hora programada</li>
                    <li>Revisar las notas del cliente si las hay</li>
                </ul>
            </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666;">
            <p>Esta notificación fue generada automáticamente por el sistema de Punto Legal.</p>
        </div>
    </div>
</body>
</html>
```

---

## 🔗 Paso 6: Conectar los Módulos

### 6.1 Conectar Webhook → Google Calendar
1. Haz clic en el **punto de salida** del webhook (círculo pequeño)
2. Arrastra la línea hacia el **punto de entrada** del Google Calendar
3. Se creará una conexión punteada

### 6.2 Conectar Google Calendar → Gmail Cliente
1. Haz clic en el **punto de salida** del Google Calendar
2. Arrastra la línea hacia el **punto de entrada** del primer Gmail
3. Se creará una conexión punteada

### 6.3 Conectar Gmail Cliente → Gmail Abogado
1. Haz clic en el **punto de salida** del primer Gmail
2. Arrastra la línea hacia el **punto de entrada** del segundo Gmail
3. Se creará una conexión vertical

---

## 🧪 Paso 7: Probar el Escenario

### 7.1 Guardar el Escenario
1. Haz clic en **"Save"** en la esquina superior derecha
2. Dale un nombre descriptivo

### 7.2 Probar con Datos de Prueba
1. Haz clic en **"Run once"** en el módulo webhook
2. Copia la URL del webhook
3. Usa el script de prueba:
```bash
node scripts/test-webhook.js
```

### 7.3 Verificar Ejecución
1. Revisa cada módulo en el flujo
2. Confirma que no haya errores (círculos verdes)
3. Verifica que se cree el evento en Google Calendar
4. Confirma que se envíen los emails

---

## ⚙️ Paso 8: Configurar Variables (Opcional)

### 8.1 Agregar Variables
1. En Make.com, ve a **"Variables"** en el panel izquierdo
2. Haz clic en **"Add variable"**
3. Agrega estas variables:
   - `PUNTO_LEGAL_EMAIL`: `info@puntolegal.cl`
   - `ABOGADO_EMAIL`: `abogado@puntolegal.cl`
   - `GOOGLE_CALENDAR_ID`: Tu ID de calendario

### 8.2 Usar Variables en Módulos
- En lugar de escribir emails directamente, usa `{{PUNTO_LEGAL_EMAIL}}`
- Esto hace el escenario más flexible

---

## ✅ Paso 9: Activar el Escenario

### 9.1 Verificar Todo
- [ ] Todos los módulos están conectados
- [ ] No hay errores (círculos rojos)
- [ ] Las conexiones están configuradas
- [ ] Los templates de email están correctos

### 9.2 Activar
1. Haz clic en el **interruptor** en la esquina superior derecha
2. El escenario se activará y estará listo para recibir datos

---

## 🔧 Paso 10: Configurar en la Aplicación

### 10.1 Actualizar URL del Webhook
1. Copia la URL del webhook de Make.com
2. Actualiza `VITE_MAKE_WEBHOOK_URL` en tu archivo `.env`
3. O actualiza directamente en `src/services/reservationService.ts`

### 10.2 Probar desde la Aplicación
1. Ve a http://localhost:8080/agendamiento
2. Crea una cita de prueba
3. Verifica que llegue a Make.com
4. Confirma que se ejecute todo el flujo

---

## 🚨 Solución de Problemas Comunes

### Error: "Module Not Found"
- **Solución**: Haz clic en el módulo y configura la conexión

### Error: "Authentication failed"
- **Solución**: Regenera las credenciales de Google/Gmail

### Error: "Webhook not receiving data"
- **Solución**: Verifica la URL y el método POST

### Error: "Email sending failed"
- **Solución**: Usa contraseña de aplicación para Gmail

---

## 📞 Soporte

Si tienes problemas:
1. Revisa `MAKE_TROUBLESHOOTING.md`
2. Verifica la documentación oficial de Make.com
3. Contacta al soporte de Make.com
4. Revisa los logs de ejecución

---

**🎉 ¡Con estos pasos tendrás tu escenario funcionando en Make.com!** 