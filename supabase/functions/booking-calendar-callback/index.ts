/**
 * Callback desde Zapier tras crear evento en Google Calendar (y Meet si aplica).
 * Actualiza `reservas` y dispara `clever-action` para un único envío Resend.
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ZAPIER_CALLBACK_SECRET,
 *      ADMIN_EDGE_TOKEN (mismo token que clever-action).
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-zapier-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const secret = Deno.env.get("ZAPIER_CALLBACK_SECRET");
  if (!secret || !secret.trim()) {
    console.error("booking-calendar-callback: ZAPIER_CALLBACK_SECRET no configurado");
    return new Response(
      JSON.stringify({ success: false, error: "Servidor no configurado para callbacks Zapier" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const headerSecret = req.headers.get("x-zapier-secret")?.trim();
  if (headerSecret !== secret) {
    return new Response(JSON.stringify({ success: false, error: "No autorizado" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ success: false, error: "Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: "JSON inválido" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const booking_id = String(body.booking_id ?? body.id ?? "").trim();
  if (!booking_id) {
    return new Response(JSON.stringify({ success: false, error: "Se requiere booking_id" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const google_meet_link = body.google_meet_link != null
    ? String(body.google_meet_link).trim() || null
    : null;
  const google_calendar_event_id = body.google_calendar_event_id != null
    ? String(body.google_calendar_event_id).trim() || null
    : null;
  const google_calendar_html_link = body.google_calendar_html_link != null
    ? String(body.google_calendar_html_link).trim() || null
    : null;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { error: upErr } = await supabase
    .from("reservas")
    .update({
      google_meet_link,
      google_calendar_event_id,
      google_calendar_html_link,
      calendar_sync_completed_at: new Date().toISOString(),
    })
    .eq("id", booking_id);

  if (upErr) {
    console.error("booking-calendar-callback: update reserva", upErr);
    return new Response(
      JSON.stringify({ success: false, error: "No se pudo actualizar la reserva", detail: upErr.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const adminToken = Deno.env.get("ADMIN_EDGE_TOKEN") ||
    Deno.env.get("EDGE_ADMIN_TOKEN") ||
    "puntolegal-admin-token-2025";
  const cleverUrl = `${SUPABASE_URL}/functions/v1/clever-action`;

  let cleverRes: Response;
  try {
    cleverRes = await fetch(cleverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken,
      },
      body: JSON.stringify({ booking_id }),
    });
  } catch (e) {
    console.error("booking-calendar-callback: fetch clever-action", e);
    await supabase
      .from("reservas")
      .update({ confirmation_email_status: "failed" })
      .eq("id", booking_id);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error llamando a clever-action",
        detail: e instanceof Error ? e.message : String(e),
      }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const cleverText = await cleverRes.text();
  let cleverJson: Record<string, unknown> = {};
  try {
    cleverJson = cleverText ? JSON.parse(cleverText) : {};
  } catch {
    cleverJson = { raw: cleverText };
  }

  if (!cleverRes.ok || cleverJson.success === false) {
    console.error("booking-calendar-callback: clever-action falló", cleverRes.status, cleverText);
    await supabase
      .from("reservas")
      .update({ confirmation_email_status: "failed" })
      .eq("id", booking_id);
    return new Response(
      JSON.stringify({
        success: false,
        error: "clever-action respondió con error",
        status: cleverRes.status,
        detail: cleverJson,
      }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      booking_id,
      clever_action: cleverJson,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
