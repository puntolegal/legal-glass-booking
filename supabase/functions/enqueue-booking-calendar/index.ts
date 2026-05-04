/**
 * Encola Zapier (Calendar/Meet) para reservas sin Mercado Pago, p. ej. evaluación inmobiliaria.
 * Misma cola que mercadopago-webhook: pending_calendar + POST al Catch Hook.
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ZAPIER_BOOKING_HOOK_URL,
 *      EDGE_ADMIN_TOKEN o ADMIN_EDGE_TOKEN (fallback clever-action).
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildZapierBookingPayloadFromRow } from "../_shared/zapierBookingPayload.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const WAIVED = "waived_inmobiliario";
const MAX_AGE_MS = 45 * 60 * 1000;

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

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

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const ZAPIER_BOOKING_HOOK_URL = (Deno.env.get("ZAPIER_BOOKING_HOOK_URL") || "").trim();
  const EDGE_ADMIN_TOKEN = Deno.env.get("EDGE_ADMIN_TOKEN") ||
    Deno.env.get("ADMIN_EDGE_TOKEN") ||
    "puntolegal-admin-token-2025";

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ success: false, error: "Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let body: { booking_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: "JSON inválido" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const booking_id = String(body.booking_id ?? "").trim();
  if (!booking_id || !isUuid(booking_id)) {
    return new Response(JSON.stringify({ success: false, error: "Se requiere booking_id UUID" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: row, error: fetchErr } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", booking_id)
    .maybeSingle();

  if (fetchErr || !row) {
    return new Response(
      JSON.stringify({ success: false, error: "Reserva no encontrada", detail: fetchErr?.message }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const pagoEstado = String(row.pago_estado ?? "").toLowerCase();
  if (pagoEstado !== WAIVED) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Solo reservas con pago_estado waived_inmobiliario pueden usar esta cola",
      }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const servicio = String(row.servicio ?? "").toLowerCase();
  if (!servicio.includes("inmobiliario") && !servicio.includes("evaluación")) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Servicio no autorizado para cola sin pago",
      }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const createdAt = row.created_at ? new Date(String(row.created_at)).getTime() : NaN;
  if (!Number.isFinite(createdAt) || Date.now() - createdAt > MAX_AGE_MS) {
    return new Response(
      JSON.stringify({ success: false, error: "Reserva demasiado antigua para encolar" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  if (row.email_enviado === true) {
    return new Response(JSON.stringify({ success: true, message: "Ya enviado, sin acción" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (row.confirmation_email_status === "pending_calendar" && row.calendar_sync_requested_at) {
    return new Response(JSON.stringify({ success: true, message: "Ya en cola Zapier" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const invokeCleverAction = async (): Promise<boolean> => {
    try {
      const emailResponse = await supabase.functions.invoke("clever-action", {
        body: { booking_id },
        headers: { "x-admin-token": EDGE_ADMIN_TOKEN },
      });
      if (emailResponse.error) {
        console.error("enqueue-booking-calendar clever-action:", emailResponse.error);
        return false;
      }
      return true;
    } catch (e) {
      console.error("enqueue-booking-calendar clever-action ex:", e);
      return false;
    }
  };

  if (!ZAPIER_BOOKING_HOOK_URL) {
    console.log("ZAPIER_BOOKING_HOOK_URL no configurada — clever-action directo");
    const ok = await invokeCleverAction();
    return new Response(
      JSON.stringify({ success: ok, path: "clever_action_direct" }),
      { status: ok ? 200 : 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const nowIso = new Date().toISOString();
  const { error: pendErr } = await supabase
    .from("reservas")
    .update({
      confirmation_email_status: "pending_calendar",
      calendar_sync_requested_at: nowIso,
    })
    .eq("id", booking_id);

  if (pendErr) {
    console.error("enqueue-booking-calendar pending_calendar:", pendErr);
    const ok = await invokeCleverAction();
    return new Response(
      JSON.stringify({ success: ok, fallback: "clever_action_after_pending_error" }),
      { status: ok ? 200 : 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const zapPayload = buildZapierBookingPayloadFromRow(row as Record<string, unknown>);

  try {
    const zr = await fetch(ZAPIER_BOOKING_HOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zapPayload),
    });
    if (!zr.ok) {
      const zt = await zr.text();
      console.error("enqueue-booking-calendar Zapier HTTP", zr.status, zt);
      await supabase
        .from("reservas")
        .update({ confirmation_email_status: "failed" })
        .eq("id", booking_id);
      const ok = await invokeCleverAction();
      return new Response(
        JSON.stringify({ success: ok, zapier_status: zr.status, fallback: !ok ? "failed" : "clever_action" }),
        { status: ok ? 200 : 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  } catch (zapErr) {
    console.error("enqueue-booking-calendar Zapier red:", zapErr);
    await supabase
      .from("reservas")
      .update({ confirmation_email_status: "failed" })
      .eq("id", booking_id);
    const ok = await invokeCleverAction();
    return new Response(
      JSON.stringify({ success: ok, fallback: "clever_action_after_network" }),
      { status: ok ? 200 : 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({ success: true, zapierDispatched: true, booking_id }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
