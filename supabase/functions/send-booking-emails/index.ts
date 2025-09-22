// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const MAIL_FROM = Deno.env.get("MAIL_FROM") || "Punto Legal <team@puntolegal.online>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const EDGE_ADMIN_TOKEN = Deno.env.get("EDGE_ADMIN_TOKEN")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
};

function formatCL(dt: string | Date) {
  const d = new Date(dt);
  return d.toLocaleString("es-CL", { timeZone: "America/Santiago", hour12: false });
}

function customerTemplate(b: any) {
  return `
    <div style="font-family:Inter,Arial,sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">✅ Reserva confirmada</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Tu consulta ha sido agendada exitosamente</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hola <strong>${b.nombre || b.cliente_nombre || "Cliente"}</strong>,</p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">Nos complace confirmar que tu cita ha sido agendada correctamente. A continuación, los detalles de tu consulta:</p>
        
        <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea;">
          <h3 style="margin: 0 0 15px 0; color: #333;">📋 Detalles de tu Cita</h3>
          <p style="margin: 8px 0;"><strong>Servicio:</strong> ${b.servicio || b.servicio_tipo || "Consulta Legal"}</p>
          <p style="margin: 8px 0;"><strong>Fecha y hora:</strong> ${formatCL(b.fecha || b.starts_at)}</p>
          <p style="margin: 8px 0;"><strong>Duración:</strong> ${b.duracion || 45} min</p>
          <p style="margin: 8px 0;"><strong>Ubicación:</strong> ${b.tipo_reunion === 'online' ? 'Online (Google Meet)' : (b.ubicacion || 'Oficina')}</p>
          <p style="margin: 8px 0;"><strong>Monto:</strong> $${Number(b.precio || b.servicio_precio || 0).toLocaleString('es-CL')} CLP</p>
          <p style="margin: 8px 0;"><strong>ID Reserva:</strong> ${b.id}</p>
        </div>
        
        <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #28a745;">
          <h3 style="margin: 0 0 15px 0; color: #333;">📞 Información de Contacto</h3>
          <p style="margin: 8px 0;"><strong>Email:</strong> puntolegalelgolf@gmail.com</p>
          <p style="margin: 8px 0;"><strong>Teléfono:</strong> +56 9 6232 1883</p>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 15px;"><strong>¿Qué sigue?</strong></p>
        <ul style="font-size: 14px; line-height: 1.6;">
          <li>Recibirás un recordatorio 24 horas antes de tu cita</li>
          <li>Si necesitas reagendar, contáctanos con al menos 24 horas de anticipación</li>
          <li>Prepara cualquier documentación relevante para tu consulta</li>
        </ul>
        
        <p style="font-size: 16px; margin-top: 20px;">Gracias por confiar en Punto Legal. Esperamos poder ayudarte con tu consulta jurídica.</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
        <p>© 2025 Punto Legal - Soluciones Jurídicas Especializadas</p>
        <p>Este email fue enviado automáticamente, por favor no respondas a este mensaje.</p>
      </div>
    </div>
  `;
}

function adminTemplate(b: any) {
  return `
    <div style="font-family:Inter,Arial,sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🧾 Nueva reserva pagada</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Un cliente ha agendado una consulta</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h3 style="margin: 0 0 10px 0; color: #856404;">⚡ Acción Requerida</h3>
          <p style="margin: 0; color: #856404;">Se ha registrado una nueva reserva que requiere tu atención.</p>
        </div>
        
        <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f5576c;">
          <h3 style="margin: 0 0 15px 0; color: #333;">👤 Información del Cliente</h3>
          <p style="margin: 8px 0;"><strong>Nombre:</strong> ${b.nombre || b.cliente_nombre || "N/D"}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> ${b.email || b.cliente_email}</p>
          <p style="margin: 8px 0;"><strong>Teléfono:</strong> ${b.telefono || b.cliente_telefono || "N/D"}</p>
        </div>
        
        <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #28a745;">
          <h3 style="margin: 0 0 15px 0; color: #333;">📅 Detalles de la Cita</h3>
          <p style="margin: 8px 0;"><strong>ID:</strong> ${b.id}</p>
          <p style="margin: 8px 0;"><strong>Servicio:</strong> ${b.servicio || b.servicio_tipo || "N/D"}</p>
          <p style="margin: 8px 0;"><strong>Fecha/hora:</strong> ${formatCL(b.fecha || b.starts_at)}</p>
          <p style="margin: 8px 0;"><strong>Método de pago:</strong> ${b.pago_metodo || "MercadoPago"}</p>
          <p style="margin: 8px 0;"><strong>Monto:</strong> $${Number(b.precio || b.servicio_precio || 0).toLocaleString('es-CL')} CLP</p>
          <p style="margin: 8px 0;"><strong>Estado:</strong> ${b.estado || "confirmada"}</p>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 15px;"><strong>Próximos pasos:</strong></p>
        <ul style="font-size: 14px; line-height: 1.6;">
          <li>Revisar la disponibilidad en tu calendario</li>
          <li>Confirmar la cita con el cliente si es necesario</li>
          <li>Preparar la documentación relevante</li>
          <li>Enviar recordatorio 24 horas antes</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
        <p>© 2025 Punto Legal - Sistema de Gestión de Reservas</p>
        <p>Este es un email automático del sistema de reservas.</p>
      </div>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, html: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: MAIL_FROM, to: [to], subject, html })
  });
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`Resend error ${r.status}: ${body}`);
  }
  return await r.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url);
    // Autorizar llamadas del trigger (backend) con X-Admin-Token
    const adminHeader = req.headers.get("X-Admin-Token");
    const isBackendCall = adminHeader && adminHeader === EDGE_ADMIN_TOKEN;

    const { booking_id } = await req.json();
    if (!booking_id) return new Response(JSON.stringify({ error: "booking_id requerido" }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

    console.log('📧 Procesando emails para reserva:', booking_id);

    // Lee la reserva con service role (RLS bypass)
    const { data: booking, error } = await supabase
      .from("reservas") // Usar tabla 'reservas' que es la que existe en el proyecto
      .select("*")
      .eq("id", booking_id)
      .single();

    if (error || !booking) {
      console.error('❌ Error obteniendo reserva:', error);
      return new Response(JSON.stringify({ error: "Reserva no encontrada", detail: error?.message }), { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Campos esperados (ajusta nombres a tu esquema real)
    const customerEmail = booking.email || booking.cliente_email;
    if (!customerEmail) {
      return new Response(JSON.stringify({ error: "La reserva no tiene email" }), { 
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const customerHtml = customerTemplate(booking);
    const adminHtml = adminTemplate(booking);

    console.log('📧 Enviando email al cliente:', customerEmail);
    console.log('📧 Enviando email al admin:', ADMIN_EMAIL);

    const r1 = await sendEmail(customerEmail, `Confirmación de reserva #${booking.id}`, customerHtml);
    const r2 = await sendEmail(ADMIN_EMAIL, `Nueva reserva pagada #${booking.id}`, adminHtml);

    console.log('✅ Emails enviados exitosamente');
    console.log('📧 Cliente ID:', r1?.id);
    console.log('📧 Admin ID:', r2?.id);

    return new Response(JSON.stringify({ ok: true, providerIds: [r1?.id, r2?.id] }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error('❌ Error enviando emails:', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
