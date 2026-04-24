/**
 * clever-action — envío de confirmaciones vía Resend tras pago confirmado.
 * Requiere: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY.
 * Opcional: MAIL_FROM, ADMIN_EMAIL, ADMIN_EDGE_TOKEN, WHATSAPP_E164 (solo dígitos, ej. 56962321883).
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildPuntoLegalAdminEmailHtml,
  buildPuntoLegalClientEmailHtml,
  buildTutelaLaboralGratisFollowUpHtml,
} from "../_shared/puntoLegalBookingEmail.ts";
import {
  buildBookingIcs,
  formatFechaCortaAsunto,
  formatFechaLargaEs,
  hasConcreteBookingSlot,
  icsToBase64,
  normalizeFechaYmd,
} from "../_shared/bookingIcs.ts";

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

/** Monto en CLP; 0 o texto "gratis" = consulta gratuita (no mostrar $0). */
function parseClpToNumber(precio: unknown): number {
  const raw = String(precio ?? "").trim().toLowerCase();
  if (raw === "gratis" || raw === "gratuito" || raw === "free") return 0;
  const digits = String(precio).replace(/[^0-9]/g, "");
  if (!digits) return 0;
  const n = parseInt(digits, 10);
  return Number.isNaN(n) ? 0 : n;
}

function formatPrecioForEmail(precio: unknown): string {
  const n = parseClpToNumber(precio);
  if (n === 0) return "Gratis";
  return `$${n.toLocaleString("es-CL")} CLP`;
}

/** Diagnóstico / consulta laboral gratuita (plan tutela-laboral), no otros planes gratis. */
function shouldSendTutelaLaboralGratisFollowUp(reserva: {
  servicio: string | null;
  precio: unknown;
}): boolean {
  if (parseClpToNumber(reserva.precio) !== 0) return false;
  const s = String(reserva.servicio ?? "").toLowerCase();
  if (s.includes("tutela")) return true;
  if (s.includes("diagnóstico") && s.includes("gratis")) return true;
  if (s.includes("laboral") && s.includes("diagnóstico")) return true;
  return false;
}

/** Fila compatible con `reservas` para armar correos cuando sólo existe el intake (paso 1). */
function mapIntakeToReservaRow(intake: Record<string, unknown>): Record<string, unknown> {
  const id = String(intake.id ?? "");
  return {
    id,
    nombre: intake.nombre,
    email: intake.email,
    telefono: intake.telefono,
    servicio: intake.servicio_nombre ?? intake.servicio_slug ?? "Consulta",
    precio: intake.precio_indicativo ?? "0",
    fecha: "Por elegir en el calendario de agendamiento",
    hora: "Pendiente (mismo flujo en puntolegal.online)",
    tipo_reunion: "online",
    descripcion: intake.descripcion ?? null,
    pago_estado: "Lead / consulta gratuita",
  };
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

    const body = await req.json();
    const booking_id = body?.booking_id as string | undefined;
    const intake_id = body?.intake_id as string | undefined;

    if (!booking_id && !intake_id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Se requiere booking_id (reserva) o intake_id (agendamiento_intakes)",
        }),
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

    let reserva: Record<string, unknown>;
    /** Si existe fila en `reservas`, actualizamos email_enviado; si sólo intake, no. */
    let persistedReservaId: string | null = null;
    let resolution: "reserva" | "reserva_por_intake" | "intake_solo" = "reserva";

    if (booking_id) {
      const { data, error: reservaError } = await supabase
        .from("reservas")
        .select("*")
        .eq("id", booking_id)
        .single();
      if (reservaError || !data) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Reserva no encontrada",
            detail: reservaError?.message,
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      reserva = data;
      persistedReservaId = booking_id;
    } else {
      const iid = intake_id as string;
      const { data: linked, error: linkErr } = await supabase
        .from("reservas")
        .select("*")
        .eq("agendamiento_intake_id", iid)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (linkErr) {
        console.error("clever-action reserva por intake:", linkErr);
      }
      if (linked) {
        reserva = linked;
        persistedReservaId = String(linked.id);
        resolution = "reserva_por_intake";
      } else {
        const { data: intake, error: intakeErr } = await supabase
          .from("agendamiento_intakes")
          .select("*")
          .eq("id", iid)
          .single();
        if (intakeErr || !intake) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Intake no encontrado y sin reserva vinculada",
              detail: intakeErr?.message,
            }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        reserva = mapIntakeToReservaRow(intake);
        persistedReservaId = null;
        resolution = "intake_solo";
      }
    }

    const tipoLabel = mapTipoReunion(reserva.tipo_reunion as string | null | undefined);
    const precioDisplay = formatPrecioForEmail(reserva.precio);
    const isFreeConsult = parseClpToNumber(reserva.precio) === 0;

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
    const WHATSAPP_E164 = Deno.env.get("WHATSAPP_E164") || "56962321883";

    const bookingIdForEmail = persistedReservaId ?? `intake:${String(reserva.id)}`;

    const fechaRaw = normalizeFechaYmd(String(reserva.fecha ?? "").trim());
    const horaRaw = String(reserva.hora ?? "").trim();
    const slotOk = hasConcreteBookingSlot(fechaRaw, horaRaw);
    const fechaLarga = slotOk ? formatFechaLargaEs(fechaRaw) : undefined;
    const horaHm = horaRaw
      .replace(/\s*hrs?$/i, "")
      .trim()
      .replace(/^(\d{1,2}:\d{2}):\d{2}$/, "$1");
    const horaEtiqueta = slotOk ? `${horaHm} · hora Chile` : undefined;
    const fechaCortaAsunto = slotOk ? formatFechaCortaAsunto(fechaRaw) : "";
    const asuntoFecha = slotOk && fechaCortaAsunto
      ? ` · ${fechaCortaAsunto} ${horaHm}`
      : "";

    const meetFromDb = String(
      (reserva as { google_meet_link?: string }).google_meet_link ?? "",
    ).trim() || undefined;

    const clientParams = {
      nombre: reserva.nombre as string,
      email: reserva.email as string,
      telefono: reserva.telefono as string,
      servicio: reserva.servicio as string,
      precio: precioDisplay,
      fecha: fechaRaw,
      hora: horaRaw,
      ...(fechaLarga && horaEtiqueta ? { fechaLarga, horaEtiqueta } : {}),
      tipoReunion: tipoLabel,
      pagoEstado: String(reserva.pago_estado || "aprobado"),
      descripcion: (reserva.descripcion as string | undefined) || undefined,
      bookingId: bookingIdForEmail,
      adminContactEmail: ADMIN_EMAIL,
      whatsappE164: WHATSAPP_E164,
      ...(meetFromDb ? { meetLink: meetFromDb } : {}),
    };

    const adminParams = {
      nombre: reserva.nombre as string,
      email: reserva.email as string,
      telefono: reserva.telefono as string,
      servicio: reserva.servicio as string,
      precio: precioDisplay,
      fecha: fechaRaw,
      hora: horaRaw,
      ...(fechaLarga && horaEtiqueta ? { fechaLarga, horaEtiqueta } : {}),
      tipoReunion: tipoLabel,
      pagoEstado: String(reserva.pago_estado || "aprobado"),
      pagoMetodo: isFreeConsult ? "Consulta gratuita" : "MercadoPago",
      descripcion: (reserva.descripcion as string | undefined) || undefined,
      bookingId: bookingIdForEmail,
      ...(meetFromDb ? { meetLink: meetFromDb } : {}),
    };

    const clientHtml = buildPuntoLegalClientEmailHtml(clientParams);
    const adminHtml = buildPuntoLegalAdminEmailHtml(adminParams);

    const icsContent = slotOk
      ? buildBookingIcs({
        title: `Consulta — ${String(reserva.servicio)} · Punto Legal`,
        description: `Cliente: ${String(reserva.nombre)}. Referencia: ${bookingIdForEmail}.`,
        fechaYmd: fechaRaw,
        horaHm: horaHm,
        durationMinutes: 45,
        uid: `${bookingIdForEmail.replace(/[^a-zA-Z0-9@-]/g, "")}@puntolegal.online`,
        ...(meetFromDb ? { meetUrl: meetFromDb } : {}),
      })
      : null;

    const clientePayload: Record<string, unknown> = {
      from: MAIL_FROM,
      to: [reserva.email],
      subject: `Consulta confirmada${asuntoFecha} — ${reserva.servicio} · Punto Legal`,
      html: clientHtml,
    };
    if (icsContent) {
      clientePayload.attachments = [
        { filename: "cita-punto-legal.ics", content: icsToBase64(icsContent) },
      ];
    }

    const clienteEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientePayload),
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
        subject: `Nueva consulta${asuntoFecha} — ${reserva.nombre} · ${reserva.servicio}`,
        html: adminHtml,
      }),
    });

    if (clienteEmailResponse.ok && adminEmailResponse.ok) {
      let followUpOk: boolean | null = null;
      let followUpDetail: string | undefined;

      if (shouldSendTutelaLaboralGratisFollowUp(reserva as { servicio: string | null; precio: unknown })) {
        await new Promise((r) => setTimeout(r, 1200));
        const followUpHtml = buildTutelaLaboralGratisFollowUpHtml({
          nombre: reserva.nombre as string,
          fecha: fechaRaw,
          hora: horaRaw,
          ...(fechaLarga && horaEtiqueta ? { fechaLarga, horaEtiqueta } : {}),
          servicio: String(reserva.servicio),
          descripcion: (reserva.descripcion as string | undefined) || undefined,
          adminContactEmail: ADMIN_EMAIL,
          whatsappE164: WHATSAPP_E164,
        });
        const followUpPayload: Record<string, unknown> = {
          from: MAIL_FROM,
          to: [reserva.email],
          subject: `Antes de tu cita${asuntoFecha} — qué preparar · ${reserva.servicio} · Punto Legal`,
          html: followUpHtml,
        };
        if (icsContent) {
          followUpPayload.attachments = [
            { filename: "cita-punto-legal.ics", content: icsToBase64(icsContent) },
          ];
        }
        const followUpRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(followUpPayload),
        });
        followUpOk = followUpRes.ok;
        if (!followUpRes.ok) {
          followUpDetail = await followUpRes.text();
          console.error("clever-action: falló correo de seguimiento laboral gratis:", followUpDetail);
        }
      }

      if (persistedReservaId) {
        const now = new Date().toISOString();
        await supabase
          .from("reservas")
          .update({
            email_enviado: true,
            email_enviado_at: now,
            confirmation_email_status: "sent",
          })
          .eq("id", persistedReservaId);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Emails enviados exitosamente",
          resolution,
          booking_id: persistedReservaId ?? undefined,
          intake_id: intake_id ?? undefined,
          email: reserva.email,
          admin_email: ADMIN_EMAIL,
          calendar_ics_attached: Boolean(icsContent),
          follow_up_laboral_gratis_sent: followUpOk,
          ...(followUpDetail ? { follow_up_error: followUpDetail } : {}),
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
