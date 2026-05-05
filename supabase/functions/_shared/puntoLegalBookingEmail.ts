/**
 * Plantillas de correo Punto Legal — modo claro glass iOS con acento teal laboral.
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

/** Modo claro glass iOS · acento teal laboral (alineado a tokens laboral en web). */
const LIGHT_GLASS_STYLES = `
  html { margin:0; padding:0; background:#f1f5f9; }
  body.email-body { margin:0; padding:0; background:#f1f5f9; color:#0f172a; font-family:Inter,Manrope,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; -webkit-font-smoothing:antialiased; }
  a { color:#0f7668; text-decoration:none; }
  a:hover { text-decoration:underline; }
  .wrap { width:100%; background-color:#f8fafc; background:linear-gradient(180deg,#f8fafc 0%,#e2e8f0 100%); padding:32px 16px; box-sizing:border-box; }
  .card { max-width:600px; margin:0 auto; background:rgba(255,255,255,0.88); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(15,23,42,0.08); border-radius:20px; overflow:hidden; box-shadow:0 20px 48px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9); }
  .head { padding:28px 28px 20px; border-bottom:1px solid rgba(15,23,42,0.06); background:radial-gradient(120% 80% at 0% 0%, rgba(13,148,136,0.10), transparent 55%); }
  .brand { font-size:13px; letter-spacing:0.12em; text-transform:uppercase; color:#64748b; font-weight:600; }
  .brand strong { color:#0f172a; font-weight:700; }
  .sep { display:inline-block; width:1px; height:12px; background:rgba(100,116,139,0.45); margin:0 8px; vertical-align:middle; }
  .title { font-size:22px; font-weight:700; color:#0f172a; margin:12px 0 6px; letter-spacing:-0.02em; }
  .sub { font-size:15px; color:#475569; line-height:1.5; margin:0; }
  .body { padding:24px 28px 32px; }
  .p { font-size:15px; color:#334155; line-height:1.65; margin:0 0 16px; }
  .row { display:flex; justify-content:space-between; gap:12px; padding:12px 0; border-bottom:1px solid rgba(15,23,42,0.06); font-size:14px; }
  .row:last-child { border-bottom:none; }
  .lbl { color:#64748b; font-weight:500; }
  .val { color:#0f172a; text-align:right; font-weight:600; max-width:58%; }
  .pill { display:inline-block; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:600;
    background:rgba(13,148,136,0.10); color:#0f7668; border:1px solid rgba(13,148,136,0.22); }
  .box { margin-top:20px; padding:16px 18px; border-radius:14px; background:rgba(248,250,252,0.95); border:1px solid rgba(15,23,42,0.07); }
  .btn { display:inline-block; margin-top:16px; padding:14px 22px; border-radius:12px; font-weight:700; font-size:15px; color:#fff !important;
    background:linear-gradient(135deg,#0d9488 0%,#14b8a6 50%,#0f7668 100%); box-shadow:0 10px 26px rgba(13,148,136,0.28); }
  .btnWa { display:inline-block; margin-top:14px; padding:14px 22px; border-radius:12px; font-weight:700; font-size:15px; color:#fff !important;
    background:linear-gradient(135deg,#25D366 0%,#128C7E 100%); box-shadow:0 10px 24px rgba(37,211,102,0.22); }
  .foot { padding:20px 28px 28px; text-align:center; font-size:12px; color:#64748b; border-top:1px solid rgba(15,23,42,0.06); background:rgba(241,245,249,0.65); }
`;

/** Textos que deben invertir bien en OS oscuro (evita gris ilegible si el cliente fuerza dark). */
const EMAIL_THEME_UTILITIES = `
  .pl-em { color:#0f172a; }
  .pl-teal { color:#115e59; }
  .pl-muted { color:#475569; }
  .pl-meta { color:#64748b; }
  .pl-body-text { color:#334155; }
  .hl-teal-box { border:1px solid rgba(13,148,136,0.28); background:rgba(13,148,136,0.07); }
  .hl-neutral-box { border:1px solid rgba(148,163,184,0.35); }
  .admin-brand-strong { color:#0f172a; }
`;

/** Glass oscuro tipo landing/navy cuando el sistema está en dark mode (p. ej. Mail iOS). */
const EMAIL_DARK_GLASS = `
@media (prefers-color-scheme: dark) {
  html { background:#020617 !important; background-color:#020617 !important; }
  body.email-body { background:#020617 !important; background-color:#020617 !important; color:#e2e8f0 !important; }
  .wrap { background-color:#020617 !important; background:linear-gradient(180deg,#020617 0%,#0f172a 100%) !important; }
  .card {
    background:#1e293b !important;
    background-color:#1e293b !important;
    backdrop-filter:none !important;
    -webkit-backdrop-filter:none !important;
    border:1px solid rgba(255,255,255,0.12) !important;
    box-shadow:0 20px 48px rgba(0,0,0,0.55) !important;
  }
  .head { border-bottom:1px solid rgba(255,255,255,0.08) !important;
    background:radial-gradient(120% 80% at 0% 0%, rgba(45,212,191,0.14), transparent 55%) !important; }
  .brand { color:#94a3b8 !important; }
  .brand strong { color:#f8fafc !important; }
  .admin-brand-strong { color:#f8fafc !important; }
  .sep { background:rgba(148,163,184,0.40) !important; }
  .title { color:#f8fafc !important; }
  .sub { color:#cbd5e1 !important; }
  .p { color:#cbd5e1 !important; }
  .row { border-bottom:1px solid rgba(255,255,255,0.07) !important; }
  .lbl { color:#94a3b8 !important; }
  .val { color:#f1f5f9 !important; }
  .pill { background:rgba(45,212,191,0.14) !important; color:#5eead4 !important; border-color:rgba(45,212,191,0.38) !important; }
  .box { background:rgba(15,23,42,0.58) !important; border:1px solid rgba(255,255,255,0.09) !important; }
  .foot { background:rgba(15,23,42,0.55) !important; border-top:1px solid rgba(255,255,255,0.08) !important; color:#94a3b8 !important; }
  a { color:#5eead4 !important; }
  .btn { color:#020617 !important;
    background:linear-gradient(135deg,#5eead4 0%,#2dd4bf 48%,#14b8a6 100%) !important;
    box-shadow:0 12px 30px rgba(45,212,191,0.28) !important; }
  .btnWa { color:#ecfdf5 !important; }
  .pl-em { color:#f1f5f9 !important; }
  .pl-teal { color:#5eead4 !important; }
  .pl-muted { color:#94a3b8 !important; }
  .pl-meta { color:#94a3b8 !important; }
  .pl-body-text { color:#cbd5e1 !important; }
  .hl-teal-box { border-color:rgba(45,212,191,0.38) !important; background:rgba(45,212,191,0.12) !important; }
  .hl-neutral-box { border-color:rgba(148,163,184,0.28) !important; }
  ul.pl-list { color:#cbd5e1 !important; }
  ul.pl-list li { color:#cbd5e1 !important; }
}
`;

/** Fondo del viewport en Mail iOS / WebKit (evita “marco” claro alrededor del mensaje). */
const EMAIL_DARK_WEBKIT_MAIL = `
@media (prefers-color-scheme: dark) {
  #MessageViewBody, #MessageWebViewDiv { background:#020617 !important; background-color:#020617 !important; }
}
`;

/** iPhone / clients estrechos: tipografía legible y CTAs a ancho completo. */
const EMAIL_RESPONSIVE = `
  html { -webkit-text-size-adjust:100%; text-size-adjust:100%; }
  @media (max-width:600px) {
    .row { flex-direction:column !important; align-items:flex-start !important; }
    .val { text-align:left !important; max-width:100% !important; }
    .wrap { padding:20px 12px !important; }
    .head { padding:22px 18px 16px !important; }
    .body { padding:18px 18px 26px !important; }
    .title { font-size:19px !important; line-height:1.25 !important; }
    .sub { font-size:14px !important; }
    .p { font-size:14px !important; }
    .btn, .btnWa { display:block !important; width:100% !important; box-sizing:border-box !important;
      text-align:center !important; margin-left:0 !important; margin-right:0 !important; }
    .card { border-radius:16px !important; }
  }
`;

const PUNTO_LEGAL_EMAIL_STYLES =
  `${LIGHT_GLASS_STYLES}${EMAIL_THEME_UTILITIES}${EMAIL_DARK_GLASS}${EMAIL_DARK_WEBKIT_MAIL}${EMAIL_RESPONSIVE}`;

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
  <meta name="color-scheme" content="light dark"/>
  <meta name="supported-color-schemes" content="light dark"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700&display=swap" rel="stylesheet"/>
  <title>Confirmación — Punto Legal Chile</title>
  <style>${PUNTO_LEGAL_EMAIL_STYLES}</style>
</head>
<body class="email-body">
  <div class="wrap">
    <div class="card">
      <div class="head">
        <div class="brand">Punto Legal <strong>Chile</strong><span class="sep"></span>Consulta confirmada</div>
        <div class="title">Tu cita quedó registrada</div>
        <p class="sub">Hola ${escapeHtml(p.nombre)}, confirmamos tu consulta en Punto Legal. <strong class="pl-em">Revisa la fecha y hora</strong> que elegiste (también aparecen resumidas más abajo).</p>
      </div>
      <div class="body">
        <span class="pill">${escapeHtml(p.servicio)}</span>
        ${
          fechaLarga && horaEtiqueta
            ? `<div class="box hl-teal-box" style="margin-top:18px;">
          <p class="pl-meta" style="margin:0 0 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;">Cuándo es tu consulta</p>
          <p class="pl-em" style="margin:0;font-size:19px;font-weight:700;line-height:1.25;">${escapeHtml(fechaLarga)}</p>
          <p class="pl-teal" style="margin:10px 0 0;font-size:16px;font-weight:600;">${escapeHtml(horaEtiqueta)}</p>
          <p class="pl-meta" style="margin:10px 0 0;font-size:12px;">Referencia: misma franja que elegiste en Chile. Si adjuntamos archivo .ics, ábrelo para guardar el evento en tu calendario.</p>
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
        ${desc ? `<p class="p" style="margin-top:18px;"><strong class="pl-em">Motivo declarado:</strong><br/>${escapeHtml(desc).replace(/\n/g, "<br/>")}</p>` : ""}
        <div class="box hl-neutral-box" style="margin-top:18px;">
          <p class="p" style="margin:0;font-size:14px;"><strong class="pl-em">Confidencialidad.</strong> Desde ya quedas protegido/a por el <strong class="pl-teal">secreto profesional</strong> del ejercicio de la abogacía. La información que nos entregaste se maneja de forma confidencial en <strong class="pl-teal">Punto Legal</strong>.</p>
        </div>
        ${meet ? `<a class="btn" href="${escapeHtml(meet)}" target="_blank" rel="noopener">Unirse a la videollamada</a>` : `<p class="p" style="margin-top:16px;">Te enviaremos el enlace de la reunión por este mismo canal antes de la hora acordada.</p>`}
        <a class="btnWa" href="${escapeHtml(waUrl)}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
        ${track ? `<p class="p pl-meta" style="font-size:13px;">Código de referencia: <strong class="pl-muted">${escapeHtml(track)}</strong></p>` : ""}
        <p class="p pl-meta" style="font-size:13px;">ID interno: ${escapeHtml(p.bookingId)}</p>
        <div class="box" style="margin-top:8px;">
          <p class="p" style="margin:0;font-size:14px;">¿Dudas? Escríbenos a <a href="mailto:${escapeHtml(p.adminContactEmail)}">${escapeHtml(p.adminContactEmail)}</a>.</p>
        </div>
      </div>
      <div class="foot">
        Tus datos se custodian con criterios de confidencialidad en Punto Legal.<br/>
        Secreto profesional · Código de Ética del Colegio de Abogados<br/>
        <a href="${escapeHtml(site)}">puntolegal.online</a> · El Golf, Las Condes, Santiago
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
  <meta name="color-scheme" content="light dark"/>
  <meta name="supported-color-schemes" content="light dark"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700&display=swap" rel="stylesheet"/>
  <title>Antes de tu cita — Punto Legal</title>
  <style>${PUNTO_LEGAL_EMAIL_STYLES}</style>
</head>
<body class="email-body">
  <div class="wrap">
    <div class="card">
      <div class="head">
        <div class="brand">Punto Legal <strong>Chile</strong><span class="sep"></span>Seguimiento</div>
        <div class="title">Antes de tu consulta laboral gratuita</div>
        <p class="sub">Hola ${escapeHtml(p.nombre)}, gracias por agendar <strong class="pl-em">${escapeHtml(p.servicio)}</strong>. <strong class="pl-teal">Recuerda:</strong> tu cita quedó el <strong class="pl-em">${escapeHtml(fl)}</strong> a las <strong class="pl-em">${escapeHtml(he)}</strong>. Conéctate puntual a la videollamada (o modalidad acordada): los datos ya están en tu correo de confirmación.</p>
      </div>
      <div class="body">
        <p class="p">Este mensaje es complementario al correo de confirmación: aquí van ideas prácticas para aprovechar mejor los 45 minutos. <strong class="pl-em">No sustituye la revisión de tu caso por un abogado.</strong></p>

        <div class="box">
          <p class="p pl-em" style="margin:0 0 10px;font-weight:600;">Documentos y antecedentes útiles (orientación)</p>
          <p class="p pl-muted" style="margin:0 0 12px;font-size:14px;">Lista para ordenar la reunión; lo que aplica depende de tu situación y lo revisamos contigo.</p>
          <p class="p pl-teal" style="margin:0 0 6px;font-size:13px;font-weight:600;">Despido o impugnación de despido / nulidad</p>
          <ul class="pl-list pl-body-text" style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.65;">
            <li>Carta de término, comunicación de despido o finiquito (si ya existe).</li>
            <li>Causales alegadas por el empleador y respuestas por escrito que tengas.</li>
            <li>Contrato y modificaciones; órdenes internas relevantes si aplican.</li>
          </ul>
          <p class="p pl-teal" style="margin:0 0 6px;font-size:13px;font-weight:600;">Liquidaciones y remuneraciones</p>
          <ul class="pl-list pl-body-text" style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.65;">
            <li>Últimas liquidaciones de sueldo y, si hubo, liquidación final / finiquito detallado.</li>
            <li>Comprobantes de pago o transferencias que respalden diferencias.</li>
          </ul>
          <p class="p pl-teal" style="margin:0 0 6px;font-size:13px;font-weight:600;">Mediación DT y plazos (información general)</p>
          <p class="p pl-body-text" style="margin:0 0 14px;font-size:14px;">En algunos asuntos puede existir instancia de mediación ante la Dirección del Trabajo u otros plazos procesales según la vía. No hay resultado garantizado: el abogado te explicará qué reglas pueden aplicar a <em>tu</em> caso con los documentos que traigas.</p>
          <p class="p pl-teal" style="margin:0 0 6px;font-size:13px;font-weight:600;">Ley Karin / hostigamiento</p>
          <ul class="pl-list pl-body-text" style="margin:0;padding-left:20px;font-size:15px;line-height:1.65;">
            <li>Denuncias internas, correos o mensajes y protocolo de la empresa, si los tienen.</li>
            <li>Orden cronológico breve de hechos (fechas aproximadas).</li>
          </ul>
        </div>

        <div class="box" style="margin-top:16px;">
          <p class="p pl-em" style="margin:0 0 10px;font-weight:600;">Qué más ayuda en la sesión</p>
          <ul class="pl-list pl-body-text" style="margin:0;padding-left:20px;font-size:15px;line-height:1.65;">
            <li>Correos o registros que documenten presiones, cambios de jornada o incumplimientos.</li>
            <li>Actas de amonestación o suspensiones si existen.</li>
            <li>Cualquier carta o comunicación formal con el empleador.</li>
          </ul>
        </div>
        <div class="box" style="margin-top:16px;">
          <p class="p pl-em" style="margin:0 0 10px;font-weight:600;">Sobre denuncias y vías (información general)</p>
          <p class="p" style="margin:0;">En Chile pueden coexistir <strong class="pl-em">plazos y competencias distintas</strong> (por ejemplo, fiscalización ante la Dirección del Trabajo en ciertas materias, o vías judiciales laborales). Qué procede en tu situación lo definirá el abogado contigo en la sesión.</p>
        </div>
        <p class="p">Si tu motivo incluye <strong class="pl-teal">Ley Karin (21.643)</strong> u otras irregularidades laborales, trae todo lo que tengas aunque no esté ordenado: en la reunión lo priorizamos.</p>
        ${desc ? `<div class="box" style="margin-top:16px;"><p class="p pl-em" style="margin:0 0 8px;font-weight:600;">Lo que dejaste escrito al agendar</p><p class="p" style="margin:0;font-size:14px;">${escapeHtml(desc).replace(/\n/g, "<br/>")}</p></div>` : ""}
        <div class="box hl-neutral-box" style="margin-top:16px;">
          <p class="p" style="margin:0;font-size:14px;"><strong class="pl-em">Confidencialidad.</strong> Aplicas el <strong class="pl-teal">secreto profesional</strong>; tus datos se tratan con reserva en <strong class="pl-teal">Punto Legal</strong>.</p>
        </div>
        <a class="btnWa" href="${escapeHtml(waUrl)}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
        <div class="box" style="margin-top:16px;">
          <p class="p" style="margin:0;font-size:14px;">¿Dudas? Escríbenos a <a href="mailto:${escapeHtml(p.adminContactEmail)}">${escapeHtml(p.adminContactEmail)}</a>.</p>
        </div>
        <p class="p pl-meta" style="font-size:12px;margin-bottom:0;">Este correo es meramente informativo. La asesoría jurídica personalizada se presta en la consulta agendada, con sujeción al secreto profesional.</p>
      </div>
      <div class="foot">
        <a href="${escapeHtml(site)}">puntolegal.online</a> · El Golf, Las Condes, Santiago
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
  <meta name="color-scheme" content="light dark"/>
  <meta name="supported-color-schemes" content="light dark"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700&display=swap" rel="stylesheet"/>
  <title>Nueva reserva — Punto Legal</title>
  <style>${PUNTO_LEGAL_EMAIL_STYLES}</style>
</head>
<body class="email-body">
  <div class="wrap">
    <div class="card">
      <div class="head">
        <div class="brand">Panel interno<span class="sep"></span><strong class="admin-brand-strong">Nueva consulta</strong></div>
        <div class="title">Reserva pagada / confirmada</div>
        <p class="sub"><strong class="pl-teal">Fecha y hora de la consulta:</strong> ${escapeHtml(fechaLarga || p.fecha)} — ${escapeHtml(horaEtiqueta || p.hora)} · ${escapeHtml(p.servicio)}</p>
      </div>
      <div class="body">
        ${
          fechaLarga && horaEtiqueta
            ? `<div class="box hl-teal-box" style="margin-bottom:16px;">
          <p class="pl-meta" style="margin:0 0 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;">Recordatorio cita (admin)</p>
          <p class="pl-em" style="margin:0;font-size:17px;font-weight:700;">${escapeHtml(fechaLarga)}</p>
          <p class="pl-teal" style="margin:8px 0 0;font-size:15px;font-weight:600;">${escapeHtml(horaEtiqueta)}</p>
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
        <p class="p pl-meta" style="font-size:13px;margin-top:16px;">Ref: ${escapeHtml(extra)} · ID ${escapeHtml(p.bookingId)}</p>
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
