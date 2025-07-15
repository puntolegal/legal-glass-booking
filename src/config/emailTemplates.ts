// Templates de Email para Automatización de Punto Legal

export const emailTemplates = {
  // Template para confirmación de cita al cliente
  confirmacionCliente: (datos: {
    nombre: string;
    email: string;
    servicio: string;
    fecha: string;
    hora: string;
    meetLink?: string;
  }) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Cita - Punto Legal</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 24px;
            color: #1e3c72;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .details {
            background: rgba(30, 60, 114, 0.05);
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            padding: 10px 0;
            border-bottom: 1px solid rgba(30, 60, 114, 0.1);
        }
        .detail-label {
            font-weight: 600;
            color: #1e3c72;
        }
        .detail-value {
            color: #333;
        }
        .meet-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin: 25px 0;
            text-align: center;
        }
        .meet-button {
            display: inline-block;
            background: white;
            color: #1e3c72;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin-top: 15px;
            transition: all 0.3s ease;
        }
        .meet-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
        }
        .contact-info {
            margin: 20px 0;
        }
        .contact-item {
            margin: 10px 0;
        }
        .reminder {
            background: rgba(255, 193, 7, 0.1);
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 10px 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">PUNTO LEGAL</div>
            <div class="subtitle">Asesoría Jurídica Especializada</div>
        </div>
        
        <div class="content">
            <div class="greeting">¡Hola ${datos.nombre}!</div>
            
            <p>Tu cita ha sido confirmada exitosamente. Nos complace informarte que tu consulta legal está programada.</p>
            
            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Servicio:</span>
                    <span class="detail-value">${datos.servicio}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fecha:</span>
                    <span class="detail-value">${datos.fecha}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Hora:</span>
                    <span class="detail-value">${datos.hora}</span>
                </div>
            </div>
            
            ${datos.meetLink ? `
            <div class="meet-section">
                <h3>📹 Consulta Virtual</h3>
                <p>Tu consulta se realizará a través de Google Meet. Haz clic en el botón para unirte a la reunión:</p>
                <a href="${datos.meetLink}" class="meet-button">Unirse a la Reunión</a>
            </div>
            ` : ''}
            
            <div class="reminder">
                <strong>📅 Recordatorio:</strong> Te enviaremos un recordatorio 1 hora antes de tu cita con el enlace de la reunión.
            </div>
            
            <p>Si necesitas reprogramar o cancelar tu cita, por favor contáctanos con al menos 24 horas de anticipación.</p>
        </div>
        
        <div class="footer">
            <div class="contact-info">
                <div class="contact-item">📧 info@puntolegal.cl</div>
                <div class="contact-item">📞 +56 9 1234 5678</div>
                <div class="contact-item">🌐 www.puntolegal.cl</div>
            </div>
            <p>Gracias por confiar en Punto Legal para tus necesidades legales.</p>
        </div>
    </div>
</body>
</html>
  `,

  // Template para notificación al abogado
  notificacionAbogado: (datos: {
    nombre: string;
    email: string;
    telefono: string;
    servicio: string;
    fecha: string;
    hora: string;
    notas: string;
    meetLink?: string;
  }) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Cita Programada - Punto Legal</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 24px;
            color: #dc3545;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .client-info {
            background: rgba(220, 53, 69, 0.05);
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            padding: 10px 0;
            border-bottom: 1px solid rgba(220, 53, 69, 0.1);
        }
        .info-label {
            font-weight: 600;
            color: #dc3545;
        }
        .info-value {
            color: #333;
        }
        .meet-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin: 25px 0;
            text-align: center;
        }
        .meet-button {
            display: inline-block;
            background: white;
            color: #1e3c72;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin-top: 15px;
            transition: all 0.3s ease;
        }
        .meet-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .notes {
            background: rgba(255, 193, 7, 0.1);
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 10px 10px 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">NUEVA CITA</div>
            <div class="subtitle">Notificación para Abogado</div>
        </div>
        
        <div class="content">
            <div class="greeting">Nueva Cita Programada</div>
            
            <p>Se ha programado una nueva consulta legal. Revisa los detalles a continuación:</p>
            
            <div class="client-info">
                <div class="info-row">
                    <span class="info-label">Cliente:</span>
                    <span class="info-value">${datos.nombre}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${datos.email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Teléfono:</span>
                    <span class="info-value">${datos.telefono}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Servicio:</span>
                    <span class="info-value">${datos.servicio}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Fecha:</span>
                    <span class="info-value">${datos.fecha}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Hora:</span>
                    <span class="info-value">${datos.hora}</span>
                </div>
            </div>
            
            ${datos.notas ? `
            <div class="notes">
                <strong>📝 Notas del Cliente:</strong><br>
                ${datos.notas}
            </div>
            ` : ''}
            
            ${datos.meetLink ? `
            <div class="meet-section">
                <h3>📹 Enlace de Reunión</h3>
                <p>La consulta se realizará a través de Google Meet:</p>
                <a href="${datos.meetLink}" class="meet-button">Ver Reunión</a>
            </div>
            ` : ''}
            
            <p><strong>Acciones Requeridas:</strong></p>
            <ul>
                <li>Revisar la información del cliente</li>
                <li>Preparar la consulta según el servicio solicitado</li>
                <li>Confirmar disponibilidad para la fecha y hora programada</li>
                <li>Revisar las notas del cliente si las hay</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>Esta notificación fue generada automáticamente por el sistema de Punto Legal.</p>
        </div>
    </div>
</body>
</html>
  `,

  // Template para recordatorio de cita
  recordatorioCita: (datos: {
    nombre: string;
    servicio: string;
    fecha: string;
    hora: string;
    meetLink: string;
  }) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recordatorio de Cita - Punto Legal</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 24px;
            color: #e0a800;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .urgent-notice {
            background: rgba(255, 193, 7, 0.2);
            border: 2px solid #ffc107;
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        .meet-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin: 25px 0;
            text-align: center;
        }
        .meet-button {
            display: inline-block;
            background: white;
            color: #1e3c72;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin-top: 15px;
            transition: all 0.3s ease;
            font-size: 18px;
        }
        .meet-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .details {
            background: rgba(30, 60, 114, 0.05);
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            padding: 10px 0;
            border-bottom: 1px solid rgba(30, 60, 114, 0.1);
        }
        .detail-label {
            font-weight: 600;
            color: #1e3c72;
        }
        .detail-value {
            color: #333;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
        }
        .tips {
            background: rgba(40, 167, 69, 0.1);
            border-left: 4px solid #28a745;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 10px 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⏰ RECORDATORIO</div>
            <div class="subtitle">Tu cita comienza en 1 hora</div>
        </div>
        
        <div class="content">
            <div class="greeting">¡Hola ${datos.nombre}!</div>
            
            <div class="urgent-notice">
                <h2>🚨 Tu cita comienza en 1 hora</h2>
                <p>Es hora de prepararte para tu consulta legal con Punto Legal.</p>
            </div>
            
            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Servicio:</span>
                    <span class="detail-value">${datos.servicio}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fecha:</span>
                    <span class="detail-value">${datos.fecha}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Hora:</span>
                    <span class="detail-value">${datos.hora}</span>
                </div>
            </div>
            
            <div class="meet-section">
                <h3>📹 ¡Únete a tu consulta ahora!</h3>
                <p>Haz clic en el botón para acceder a tu reunión virtual:</p>
                <a href="${datos.meetLink}" class="meet-button">Unirse a la Reunión</a>
            </div>
            
            <div class="tips">
                <strong>💡 Consejos para tu consulta:</strong>
                <ul>
                    <li>Asegúrate de tener una conexión estable a internet</li>
                    <li>Encuentra un lugar tranquilo para la consulta</li>
                    <li>Tén preparados tus documentos si es necesario</li>
                    <li>Llega 5 minutos antes para verificar tu conexión</li>
                </ul>
            </div>
            
            <p>Si tienes problemas para conectarte, contáctanos inmediatamente.</p>
        </div>
        
        <div class="footer">
            <div class="contact-info">
                <div class="contact-item">📧 info@puntolegal.cl</div>
                <div class="contact-item">📞 +56 9 1234 5678</div>
            </div>
            <p>¡Nos vemos en tu consulta!</p>
        </div>
    </div>
</body>
</html>
  `
};

// Función helper para formatear fecha
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Función helper para formatear hora
export const formatTime = (time: string) => {
  return time;
}; 