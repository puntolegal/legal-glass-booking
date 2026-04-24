/**
 * Plantillas de correo Punto Legal — estética alineada al landing (noche, vidrio, cian).
 * Usado por clever-action y send-booking-email (Resend).
 */

import {
  buildBookingWhatsAppPrefillMessage,
  buildWaMeUrl,
} from "./landingServiceTitles.ts";

export function escapeHtml(s: string | undefined | null): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface PuntoLegalClientEmailParams {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  precio: string;
  fecha: string;
  hora: string;
  /** Ej. "lunes 21 de abril de 2026" — recordatorio legible */
  fechaLarga?: string;
  /** Ej. "10:00 · hora Chile" */
  horaEtiqueta?: string;
  tipoReunion: string;
  pagoEstado: string;
  descripcion?: string;
  /** Enlace Meet u otro; opcional */
  meetLink?: string;
  trackingCode?: string;
  bookingId: string;
  adminContactEmail: string;
  siteUrl?: string;
  /** E.164 sin + (ej. 56962321883). Opcional: por defecto en `buildWaMeUrl`. */
  whatsappE164?: string;
}

export interface PuntoLegalAdminEmailParams {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  precio: string;
  fecha: string;
  hora: string;
  fechaLarga?: string;
  horaEtiqueta?: string;
  tipoReunion: string;
  pagoEstado: string;
  pagoMetodo?: string;
  descripcion?: string;
  bookingId: string;
  reservationLabel?: string;
  /** Enlace Meet u otro para la consulta online. */
  meetLink?: string;
}

/** Segundo correo al cliente: preparación previa a diagnóstico laboral gratuito (no constituye asesoría legal). */
export interface TutelaLaboralGratisFollowUpParams {
  nombre: string;
  fecha: string;
  hora: string;
  fechaLarga?: string;
  horaEtiqueta?: string;
  servicio: string;
  descripcion?: string;
  adminContactEmail: string;
  siteUrl?: string;
  whatsappE164?: string;
}

const BASE_STYLES = `
  body { margin:0; padding:0; background:#020617; color:#e2e8f0; font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; -webkit-font-smoothing:antialiased; }
  a { color:#22d3ee; text-decoration:none; }
  .wrap { width:100%; background:linear-gradient(180deg,#020617 0%,#0f172a 100%); padding:32px 16px; }
  .card { max-width:600px; margin:0 auto; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; overflow:hidden; box-shadow:0 24px 50px rgba(0,0,0,0.45); }
  .head { padding:28px 28px 20px; border-bottom:1px solid rgba(255,255,255,0.06); background:radial-gradient(120% 80% at 0% 0%, rgba(34,211,238,0.12), transparent 55%); }
  .brand { font-size:13px; letter-spacing:0.12em; text-transform:uppercase; color:#64748b; font-weight:600; }
  .brand strong { color:#f8fafc; font-weight:700; }
  .sep { display:inline-block; width:1px; height:12px; background:rgba(148,163,184,0.5); margin:0 8px; vertical-align:middle; }
  .title { font-size:22px; font-weight:700; color:#f8fafc; margin:12px 0 6px; letter-spacing:-0.02em; }
  .sub { font-size:15px; color:#94a3b8; line-height:1.5; margin:0; }
  .body { padding:24px 28px 32px; }
  .p { font-size:15px; color:#cbd5e1; line-height:1.65; margin:0 0 16px; }
  .row { display:flex; justify-content:space-between; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:14px; }
  .row:last-child { border-bottom:none; }
  .lbl { color:#94a3b8; font-weight:500; }
  .val { color:#f1f5f9; text-align:right; font-weight:600; max-width:58%; }
  .pill { display:inline-block; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:600;
    background:rgba(34,211,238,0.12); color:#a5f3fc; border:1px solid rgba(34,211,238,0.25); }
  .box { margin-top:20px; padding:16px 18px; border-radius:14px; background:rgba(2,6,23,0.55); border:1px solid rgba(255,255,255,0.06); }
  .btn { display:inline-block; margin-top:16px; padding:14px 22px; border-radius:12px; font-weight:700; font-size:15px; color:#020617 !important;
    background:linear-gradient(135deg,#22d3ee 0%,#38bdf8 45%,#6366f1 100%); box-shadow:0 12px 28px rgba(34,211,238,0.25); }
  .btnWa { display:inline-block; margin-top:14px; padding:14px 22px; border-radius:12px; font-weight:700; font-size:15px; color:#020617 !important;
    background:linear-gradient(135deg,#25D366 0%,#128C7E 100%); box-shadow:0 12px 28px rgba(37,211,102,0.22); }
  .foot { padding:20px 28px 28px; text-align:center; font-size:12px; color:#64748b; border-top:1px solid rgba(255,255,255,0.06); background:rgba(2,6,23,0.35); }
  @media (max-width:600px) {
    .row { flex-direction:column; align-items:flex-start; }
    .val { text-align:left; max-width:100%; }
  }
`;

export function buildPuntoLegalClientEmailHtml(p: PuntoLegalClientEmailParams): string {
  const site = p.siteUrl || "https://puntolegal.online";
  const meet = p.meetLink?.trim();
  const track = p.trackingCode?.trim();
  const desc = p.descripcion?.trim();
  const fechaLarga = p.fechaLarga?.trim();
  const horaEtiqueta = p.horaEtiqueta?.trim();

  const whenLine =
    fechaLarga && horaEtiqueta
      ? `${fechaLarga}, ${horaEtiqueta}`
      : [String(p.fecha || "").trim(), String(p.hora || "").trim()].filter(Boolean).join(" · ") ||
        "la fecha y hora indicadas en este correo";

  const waUrl = buildWaMeUrl(
    p.whatsappE164,
    buildBookingWhatsAppPrefillMessage({
      nombre: p.nombre,
      servicio: p.servicio,
      whenLine,
    }),
  );

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <title>Confirmación — Punto Legal Chile</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <div class="brand">Punto Legal <strong>Chile</strong><span class="sep"></span>Consulta confirmada</div>
        <div class="title">Tu cita quedó registrada</div>
        <p class="sub">Hola ${escapeHtml(p.nombre)}, confirmamos tu consulta en Punto Legal. <strong style="color:#e2e8f0;">Revisa la fecha y hora</strong> que elegiste (también aparecen resumidas más abajo).</p>
      </div>
      <div class="body">
        <span class="pill">${escapeHtml(p.servicio)}</span>
        ${
          fechaLarga && horaEtiqueta
            ? `<div class="box" style="margin-top:18px;border:1px solid rgba(34,211,238,0.35);background:rgba(34,211,238,0.08);">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:600;">Cuándo es tu consulta</p>
          <p style="margin:0;font-size:19px;font-weight:700;color:#f8fafc;line-height:1.25;">${escapeHtml(fechaLarga)}</p>
          <p style="margin:10px 0 0;font-size:16px;font-weight:600;color:#a5f3fc;">${escapeHtml(horaEtiqueta)}</p>
          <p style="margin:10px 0 0;font-size:12px;color:#94a3b8;">Referencia: misma franja que elegiste en Chile. Si adjuntamos archivo .ics, ábrelo para guardar el evento en tu calendario.</p>
        </div>`
            : ""
        }
        <div class="box" style="margin-top:18px;">
          <div class="row"><span class="lbl">Fecha (registro)</span><span class="val">${escapeHtml(p.fecha)}</span></div>
          <div class="row"><span class="lbl">Hora (registro)</span><span class="val">${escapeHtml(p.hora)}</span></div>
          <div class="row"><span class="lbl">Modalidad</span><span class="val">${escapeHtml(p.tipoReunion)}</span></div>
          <div class="row"><span class="lbl">Monto</span><span class="val">${escapeHtml(p.precio)}</span></div>
          <div class="row"><span class="lbl">Estado del pago</span><span class="val">${escapeHtml(p.pagoEstado)}</span></div>
        </div>
        ${desc ? `<p class="p" style="margin-top:18px;"><strong style="color:#e2e8f0;">Motivo declarado:</strong><br/>${escapeHtml(desc).replace(/\n/g, "<br/>")}</p>` : ""}
        <div class="box" style="margin-top:18px;border:1px solid rgba(148,163,184,0.18);">
          <p class="p" style="margin:0;font-size:14px;"><strong style="color:#f1f5f9;">Confidencialidad.</strong> Desde ya quedas protegido/a por el <strong style="color:#e2e8f0;">secreto profesional</strong> del ejercicio de la abogacía. La información que nos entregaste se maneja de forma confidencial en <strong style="color:#e2e8f0;">Punto Legal</strong>.</p>
        </div>
        ${meet ? `<a class="btn" href="${escapeHtml(meet)}" target="_blank" rel="noopener">Unirse a la videollamada</a>` : `<p class="p" style="margin-top:16px;">Te enviaremos el enlace de la reunión por este mismo canal antes de la hora acordada.</p>`}
        <a class="btnWa" href="${escapeHtml(waUrl)}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
        ${track ? `<p class="p" style="font-size:13px;color:#64748b;">Código de referencia: <strong style="color:#94a3b8;">${escapeHtml(track)}</strong></p>` : ""}
        <p class="p" style="font-size:13px;color:#64748b;">ID interno: ${escapeHtml(p.bookingId)}</p>
        <div class="box" style="margin-top:8px;">
          <p class="p" style="margin:0;font-size:14px;">¿Dudas? Escríbenos a <a href="mailto:${escapeHtml(p.adminContactEmail)}">${escapeHtml(p.adminContactEmail)}</a>.</p>
        </div>
      </div>
      <div class="foot">
        Tus datos se custodian con criterios de confidencialidad en Punto Legal.<br/>
        Secreto profesional · Código de Ética del Colegio de Abogados<br/>
        <a href="${escapeHtml(site)}" style="color:#22d3ee;">puntolegal.online</a> · El Golf, Las Condes, Santiago
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Correo de seguimiento informativo tras agendar consulta / diagnóstico laboral gratuito.
 * Orientación general; el criterio jurídico concreto se aborda en la sesión con el abogado.
 */
export function buildTutelaLaboralGratisFollowUpHtml(
  p: TutelaLaboralGratisFollowUpParams,
): string {
  const site = p.siteUrl || "https://puntolegal.online";
  const desc = p.descripcion?.trim();
  const fl = p.fechaLarga?.trim() || p.fecha;
  const he = p.horaEtiqueta?.trim() || p.hora;
  const whenLine =
    p.fechaLarga?.trim() && p.horaEtiqueta?.trim()
      ? `${p.fechaLarga.trim()}, ${p.horaEtiqueta.trim()}`
      : `${fl}, ${he}`;

  const waUrl = buildWaMeUrl(
    p.whatsappE164,
    buildBookingWhatsAppPrefillMessage({
      nombre: p.nombre,
      servicio: p.servicio,
      whenLine,
    }),
  );

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <title>Antes de tu cita — Punto Legal</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <div class="brand">Punto Legal <strong>Chile</strong><span class="sep"></span>Seguimiento</div>
        <div class="title">Antes de tu consulta laboral gratuita</div>
        <p class="sub">Hola ${escapeHtml(p.nombre)}, gracias por agendar <strong style="color:#e2e8f0;">${escapeHtml(p.servicio)}</strong>. <strong style="color:#e2e8f0;">Recuerda:</strong> tu cita quedó el <strong style="color:#e2e8f0;">${escapeHtml(fl)}</strong> a las <strong style="color:#e2e8f0;">${escapeHtml(he)}</strong>.</p>
      </div>
      <div class="body">
        <p class="p">Este mensaje es complementario al correo de confirmación: aquí van ideas prácticas para aprovechar mejor los 45 minutos. <strong style="color:#e2e8f0;">No sustituye la revisión de tu caso por un abogado.</strong></p>
        <div class="box">
          <p class="p" style="margin:0 0 10px;font-weight:600;color:#f1f5f9;">Qué te conviene tener a mano (si existe)</p>
          <ul style="margin:0;padding-left:20px;color:#cbd5e1;font-size:15px;line-height:1.65;">
            <li>Contrato de trabajo, modificaciones o comunicaciones escritas del empleador.</li>
            <li>Boletas de honorarios, liquidaciones de remuneraciones o comprobantes de pago.</li>
            <li>Correos, mensajes o registros que documenten hostigamiento, presiones o cambios de jornada.</li>
            <li>Actas de amonestación, suspensiones o cualquier documento disciplinario.</li>
            <li>Cronología breve (fechas) de los hechos que quieras contar.</li>
          </ul>
        </div>
        <div class="box" style="margin-top:16px;">
          <p class="p" style="margin:0 0 10px;font-weight:600;color:#f1f5f9;">Sobre denuncias y vías administrativas (información general)</p>
          <p class="p" style="margin:0;">En Chile, según la materia, pueden existir <strong style="color:#e2e8f0;">plazos y competencias distintas</strong> (por ejemplo, fiscalización ante la Dirección del Trabajo frente a ciertas infracciones laborales, o vías judiciales en tribunales laborales). Qué procede en <em>tu</em> situación —incluido si conviene denunciar y en qué orden— lo definirá el abogado contigo en la sesión, según los hechos y la documentación.</p>
        </div>
        <p class="p">Si tu motivo de consulta incluye <strong style="color:#e2e8f0;">Ley Karin</strong>, relaciones de honorarios mal encuadradas u otras irregularidades laborales, trae todo lo que tengas aunque no esté ordenado: en la reunión lo priorizamos.</p>
        ${desc ? `<div class="box" style="margin-top:16px;"><p class="p" style="margin:0 0 8px;font-weight:600;color:#f1f5f9;">Lo que dejaste escrito al agendar</p><p class="p" style="margin:0;font-size:14px;">${escapeHtml(desc).replace(/\n/g, "<br/>")}</p></div>` : ""}
        <div class="box" style="margin-top:16px;border:1px solid rgba(148,163,184,0.18);">
          <p class="p" style="margin:0;font-size:14px;"><strong style="color:#f1f5f9;">Confidencialidad.</strong> Desde ya aplicas el <strong style="color:#e2e8f0;">secreto profesional</strong>; tus datos se tratan con reserva en <strong style="color:#e2e8f0;">Punto Legal</strong>.</p>
        </div>
        <a class="btnWa" href="${escapeHtml(waUrl)}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
        <div class="box" style="margin-top:16px;">
          <p class="p" style="margin:0;font-size:14px;">¿Dudas? Escríbenos a <a href="mailto:${escapeHtml(p.adminContactEmail)}">${escapeHtml(p.adminContactEmail)}</a>.</p>
        </div>
        <p class="p" style="font-size:12px;color:#64748b;margin-bottom:0;">Este correo es meramente informativo. La asesoría jurídica personalizada se presta en la consulta agendada, con sujeción al secreto profesional.</p>
      </div>
      <div class="foot">
        <a href="${escapeHtml(site)}" style="color:#22d3ee;">puntolegal.online</a> · El Golf, Las Condes, Santiago
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function buildPuntoLegalAdminEmailHtml(p: PuntoLegalAdminEmailParams): string {
  const extra = p.reservationLabel || p.bookingId;
  const met = p.pagoMetodo || "—";
  const fechaLarga = p.fechaLarga?.trim();
  const horaEtiqueta = p.horaEtiqueta?.trim();

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <title>Nueva reserva — Punto Legal</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <div class="brand">Panel interno<span class="sep"></span><strong style="color:#f8fafc;">Nueva consulta</strong></div>
        <div class="title">Reserva pagada / confirmada</div>
        <p class="sub"><strong style="color:#e2e8f0;">Fecha y hora de la consulta:</strong> ${escapeHtml(fechaLarga || p.fecha)} — ${escapeHtml(horaEtiqueta || p.hora)} · ${escapeHtml(p.servicio)}</p>
      </div>
      <div class="body">
        ${
          fechaLarga && horaEtiqueta
            ? `<div class="box" style="border:1px solid rgba(34,211,238,0.35);background:rgba(34,211,238,0.08);margin-bottom:16px;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:600;">Recordatorio cita (admin)</p>
          <p style="margin:0;font-size:17px;font-weight:700;color:#f8fafc;">${escapeHtml(fechaLarga)}</p>
          <p style="margin:8px 0 0;font-size:15px;font-weight:600;color:#a5f3fc;">${escapeHtml(horaEtiqueta)}</p>
        </div>`
            : ""
        }
        <div class="box">
          <div class="row"><span class="lbl">Cliente</span><span class="val">${escapeHtml(p.nombre)}</span></div>
          <div class="row"><span class="lbl">Correo</span><span class="val">${escapeHtml(p.email)}</span></div>
          <div class="row"><span class="lbl">Teléfono</span><span class="val">${escapeHtml(p.telefono)}</span></div>
        </div>
        <div class="box" style="margin-top:16px;">
          <div class="row"><span class="lbl">Fecha (BD)</span><span class="val">${escapeHtml(p.fecha)}</span></div>
          <div class="row"><span class="lbl">Hora (BD)</span><span class="val">${escapeHtml(p.hora)}</span></div>
          <div class="row"><span class="lbl">Servicio</span><span class="val">${escapeHtml(p.servicio)}</span></div>
          <div class="row"><span class="lbl">Monto</span><span class="val">${escapeHtml(p.precio)}</span></div>
          <div class="row"><span class="lbl">Modalidad</span><span class="val">${escapeHtml(p.tipoReunion)}</span></div>
          <div class="row"><span class="lbl">Pago</span><span class="val">${escapeHtml(p.pagoEstado)} · ${escapeHtml(met)}</span></div>
          ${
            p.meetLink?.trim()
              ? `<div class="row" style="flex-direction:column;align-items:stretch;"><span class="lbl">Videollamada</span><span class="val" style="text-align:left;max-width:100%;"><a href="${escapeHtml(p.meetLink.trim())}" target="_blank" rel="noopener">${escapeHtml(p.meetLink.trim())}</a></span></div>`
              : ""
          }
          ${p.descripcion ? `<div class="row" style="flex-direction:column;align-items:stretch;"><span class="lbl">Descripción / notas</span><span class="val" style="text-align:left;max-width:100%;font-weight:500;margin-top:6px;">${escapeHtml(p.descripcion).replace(/\n/g, "<br/>")}</span></div>` : ""}
        </div>
        <p class="p" style="font-size:13px;color:#64748b;margin-top:16px;">Ref: ${escapeHtml(extra)} · ID ${escapeHtml(p.bookingId)}</p>
      </div>
      <div class="foot">Sistema Punto Legal · Notificación automática</div>
    </div>
  </div>
</body>
</html>`;
}

/** Adaptador send-booking-email (payload con Meet y tracking) */
export interface LegacyBookingEmailRequest {
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

export function legacyClientHtml(data: LegacyBookingEmailRequest, adminEmail: string): string {
  return buildPuntoLegalClientEmailHtml({
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    servicio: data.servicio,
    precio: data.precio,
    fecha: data.fecha,
    hora: data.hora,
    tipoReunion: "Videollamada",
    pagoEstado: data.pagoEstado,
    meetLink: data.googleMeetLink,
    trackingCode: data.trackingCode,
    bookingId: data.reservationId,
    adminContactEmail: adminEmail,
  });
}

export function legacyAdminHtml(data: LegacyBookingEmailRequest): string {
  return buildPuntoLegalAdminEmailHtml({
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    servicio: data.servicio,
    precio: data.precio,
    fecha: data.fecha,
    hora: data.hora,
    tipoReunion: "Videollamada",
    pagoEstado: data.pagoEstado,
    pagoMetodo: data.pagoMetodo,
    bookingId: data.reservationId,
    reservationLabel: data.trackingCode,
    meetLink: data.googleMeetLink,
  });
}
