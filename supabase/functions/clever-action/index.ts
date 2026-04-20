/**
 * clever-action — envío de confirmaciones vía Resend tras pago confirmado.
 * Requiere variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildPuntoLegalAdminEmailHtml,
  buildPuntoLegalClientEmailHtml,
} from "../_shared/puntoLegalBookingEmail.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

function mapTipoReunion(raw: string | null | undefined): string {
  const r = (raw || "online").toLowerCase();
  if (r.includes("video") || r === "videollamada" || r === "online") {
    return "Videollamada (Google Meet)";
  }
  if (r.includes("tel") || r === "telefonica") return "Llamada telefónica";
  if (r.includes("presencial")) return "Presencial";
  return raw || "Videollamada";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const adminToken = req.headers.get("x-admin-token");
    const expectedToken = Deno.env.get("ADMIN_EDGE_TOKEN") ||
      "puntolegal-admin-token-2025";

    if (adminToken !== expectedToken) {
      return new Response(
        JSON.stringify({ success: false, error: "Token de admin requerido" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { booking_id } = await req.json();
    if (!booking_id) {
      return new Response(
        JSON.stringify({ success: false, error: "booking_id es requerido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(
        JSON.stringify({ success: false, error: "Configuración del servidor incompleta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: reserva, error: reservaError } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", booking_id)
      .single();

    if (reservaError || !reserva) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Reserva no encontrada",
          detail: reservaError?.message,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const tipoLabel = mapTipoReunion(reserva.tipo_reunion);
    const precioDisplay = String(reserva.precio || "").startsWith("$")
      ? String(reserva.precio)
      : `$${reserva.precio}`;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "RESEND_API_KEY no configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const MAIL_FROM = Deno.env.get("MAIL_FROM") ||
      "Punto Legal <team@puntolegal.online>";
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ||
      "puntolegalelgolf@gmail.com";

    const clientParams = {
      nombre: reserva.nombre,
      email: reserva.email,
      telefono: reserva.telefono,
      servicio: reserva.servicio,
      precio: precioDisplay,
      fecha: String(reserva.fecha),
      hora: String(reserva.hora),
      tipoReunion: tipoLabel,
      pagoEstado: reserva.pago_estado || "aprobado",
      descripcion: reserva.descripcion || undefined,
      bookingId: booking_id,
      adminContactEmail: ADMIN_EMAIL,
    };

    const adminParams = {
      nombre: reserva.nombre,
      email: reserva.email,
      telefono: reserva.telefono,
      servicio: reserva.servicio,
      precio: precioDisplay,
      fecha: String(reserva.fecha),
      hora: String(reserva.hora),
      tipoReunion: tipoLabel,
      pagoEstado: reserva.pago_estado || "aprobado",
      pagoMetodo: "MercadoPago",
      descripcion: reserva.descripcion || undefined,
      bookingId: booking_id,
    };

    const clientHtml = buildPuntoLegalClientEmailHtml(clientParams);
    const adminHtml = buildPuntoLegalAdminEmailHtml(adminParams);

    const clienteEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [reserva.email],
        subject: `Consulta confirmada — ${reserva.servicio} · Punto Legal`,
        html: clientHtml,
      }),
    });

    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [ADMIN_EMAIL],
        subject: `Nueva consulta — ${reserva.nombre} · ${reserva.servicio}`,
        html: adminHtml,
      }),
    });

    if (clienteEmailResponse.ok && adminEmailResponse.ok) {
      await supabase
        .from("reservas")
        .update({
          email_enviado: true,
          email_enviado_at: new Date().toISOString(),
        })
        .eq("id", booking_id);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Emails enviados exitosamente",
          booking_id,
          email: reserva.email,
          admin_email: ADMIN_EMAIL,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const clienteError = await clienteEmailResponse.text();
    const adminError = await adminEmailResponse.text();

    return new Response(
      JSON.stringify({
        success: false,
        error: "Error enviando emails",
        detail: { cliente: clienteError, admin: adminError },
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ success: false, error: "Error interno", detail: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
