import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  reservationId: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  precio: string;
  fecha: string;
  hora: string;
  pagoEstado: string;
  pagoMetodo: string;
  trackingCode: string;
  googleMeetLink: string;
}

// Plantilla HTML para el cliente
const getClientEmailTemplate = (data: BookingEmailRequest) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Consulta - Punto Legal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #1d1d1f;
            background-color: #f5f5f7;
            padding: 40px 20px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .header { 
            background: #1d1d1f;
            color: #ffffff;
            padding: 48px 40px;
            text-align: center;
        }
        .header h1 { 
            font-size: 28px;
            font-weight: 600;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }
        .header p {
            font-size: 17px;
            color: #a1a1a6;
            font-weight: 400;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 22px;
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 16px;
        }
        .intro-text {
            font-size: 17px;
            color: #86868b;
            margin-bottom: 32px;
            line-height: 1.5;
        }
        .detail-card {
            background: #f5f5f7;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e5e7;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-size: 15px;
            color: #86868b;
            font-weight: 500;
        }
        .detail-value {
            font-size: 15px;
            color: #1d1d1f;
            font-weight: 600;
            text-align: right;
        }
        .meet-link {
            background: #0071e3;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 24px;
            border-radius: 8px;
            display: inline-block;
            margin: 24px 0;
            font-size: 15px;
            font-weight: 600;
            transition: background 0.2s ease;
        }
        .divider {
            height: 1px;
            background: #e5e5e7;
            margin: 32px 0;
        }
        .footer-text {
            font-size: 15px;
            color: #86868b;
            line-height: 1.6;
            margin-top: 24px;
        }
        .footer {
            background: #f5f5f7;
            padding: 32px 40px;
            text-align: center;
        }
        .footer-brand {
            font-size: 17px;
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 8px;
        }
        .footer-contact {
            font-size: 13px;
            color: #86868b;
            line-height: 1.8;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Consulta Confirmada</h1>
            <p>Tu asesoría ha sido agendada exitosamente</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hola ${data.nombre},</div>
            <p class="intro-text">
                Hemos confirmado tu consulta legal. A continuación encontrarás todos los detalles de tu cita.
            </p>
            
            <div class="detail-card">
                <div class="detail-row">
                    <span class="detail-label">Servicio</span>
                    <span class="detail-value">${data.servicio}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fecha</span>
                    <span class="detail-value">${data.fecha}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Hora</span>
                    <span class="detail-value">${data.hora}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duración</span>
                    <span class="detail-value">45 minutos</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Inversión</span>
                    <span class="detail-value">$${data.precio}</span>
                </div>
            </div>
            
            <a href="${data.googleMeetLink}" class="meet-link" target="_blank">Unirse a la videollamada</a>
            
            <div class="divider"></div>
            
            <p class="footer-text">
                Recibirás un recordatorio 24 horas antes de tu consulta. Si necesitas reagendar o tienes alguna pregunta, no dudes en contactarnos.
            </p>
            
            <p class="footer-text" style="font-size: 13px; margin-top: 16px;">
                Código de seguimiento: <strong>${data.trackingCode}</strong>
            </p>
        </div>
        
        <div class="footer">
            <div class="footer-brand">Punto Legal</div>
            <div class="footer-contact">
                puntolegalelgolf@gmail.com<br>
                +56 9 6232 1883
            </div>
        </div>
    </div>
</body>
</html>
`;

// Plantilla HTML para el admin
const getAdminEmailTemplate = (data: BookingEmailRequest) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Reserva - Punto Legal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #1d1d1f;
            background-color: #f5f5f7;
            padding: 40px 20px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .header { 
            background: #1d1d1f;
            color: #ffffff;
            padding: 48px 40px;
            text-align: center;
        }
        .header h1 { 
            font-size: 28px;
            font-weight: 600;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }
        .header p {
            font-size: 17px;
            color: #a1a1a6;
            font-weight: 400;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 22px;
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 16px;
        }
        .intro-text {
            font-size: 17px;
            color: #86868b;
            margin-bottom: 32px;
            line-height: 1.5;
        }
        .section-title {
            font-size: 13px;
            font-weight: 600;
            color: #86868b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 32px 0 16px 0;
        }
        .detail-card {
            background: #f5f5f7;
            border-radius: 12px;
            padding: 24px;
            margin: 16px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e5e7;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-size: 15px;
            color: #86868b;
            font-weight: 500;
        }
        .detail-value {
            font-size: 15px;
            color: #1d1d1f;
            font-weight: 600;
            text-align: right;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            background: #d4edda;
            color: #155724;
        }
        .divider {
            height: 1px;
            background: #e5e5e7;
            margin: 32px 0;
        }
        .footer {
            background: #f5f5f7;
            padding: 32px 40px;
            text-align: center;
        }
        .footer-brand {
            font-size: 17px;
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 8px;
        }
        .footer-contact {
            font-size: 13px;
            color: #86868b;
            line-height: 1.8;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Nueva Reserva</h1>
            <p>Se ha agendado una nueva consulta</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hola Equipo,</div>
            <p class="intro-text">
                Se ha registrado una nueva reserva en el sistema. A continuación encontrarás todos los detalles.
            </p>
            
            <div class="status-badge">Confirmada</div>
            
            <div class="section-title">Información del Cliente</div>
            <div class="detail-card">
                <div class="detail-row">
                    <span class="detail-label">Nombre</span>
                    <span class="detail-value">${data.nombre}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${data.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Teléfono</span>
                    <span class="detail-value">${data.telefono}</span>
                </div>
            </div>
            
            <div class="section-title">Detalles de la Consulta</div>
            <div class="detail-card">
                <div class="detail-row">
                    <span class="detail-label">Servicio</span>
                    <span class="detail-value">${data.servicio}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fecha</span>
                    <span class="detail-value">${data.fecha}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Hora</span>
                    <span class="detail-value">${data.hora}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duración</span>
                    <span class="detail-value">45 minutos</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Valor</span>
                    <span class="detail-value">$${data.precio}</span>
                </div>
            </div>
            
            <div class="section-title">Información Técnica</div>
            <div class="detail-card">
                <div class="detail-row">
                    <span class="detail-label">ID de Reserva</span>
                    <span class="detail-value">${data.reservationId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Código de Seguimiento</span>
                    <span class="detail-value">${data.trackingCode}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Estado de Pago</span>
                    <span class="detail-value">${data.pagoEstado}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Método de Pago</span>
                    <span class="detail-value">${data.pagoMetodo}</span>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <p class="intro-text">
                Recuerda preparar la documentación necesaria y enviar un recordatorio al cliente 24 horas antes de la cita.
            </p>
        </div>
        
        <div class="footer">
            <div class="footer-brand">Punto Legal</div>
            <div class="footer-contact">
                Sistema de Gestión de Reservas
            </div>
        </div>
    </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingEmailRequest = await req.json();

    console.log("📧 Enviando emails para reserva:", bookingData.reservationId);

    const mailFrom = Deno.env.get("MAIL_FROM") || "Punto Legal <puntolegalelgolf@gmail.com>";
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "puntolegalelgolf@gmail.com";

    // Enviar email al cliente
    console.log("📧 Enviando email al cliente:", bookingData.email);
    const clientEmailResponse = await resend.emails.send({
      from: mailFrom,
      to: [bookingData.email],
      subject: `Consulta Confirmada - ${bookingData.trackingCode}`,
      html: getClientEmailTemplate(bookingData),
    });

    console.log("✅ Email cliente enviado:", clientEmailResponse);

    // Enviar email al admin
    console.log("📧 Enviando email al admin:", adminEmail);
    const adminEmailResponse = await resend.emails.send({
      from: mailFrom,
      to: [adminEmail],
      subject: `Nueva Reserva - ${bookingData.nombre}`,
      html: getAdminEmailTemplate(bookingData),
    });

    console.log("✅ Email admin enviado:", adminEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        clientEmailId: clientEmailResponse.id,
        adminEmailId: adminEmailResponse.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("❌ Error enviando emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
