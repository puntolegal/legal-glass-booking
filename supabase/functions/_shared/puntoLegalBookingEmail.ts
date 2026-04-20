/**
 * Plantillas de correo Punto Legal — estética alineada al landing (noche, vidrio, cian).
 * Usado por clever-action y send-booking-email (Resend).
 */

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
  tipoReunion: string;
  pagoEstado: string;
  descripcion?: string;
  /** Enlace Meet u otro; opcional */
  meetLink?: string;
  trackingCode?: string;
  bookingId: string;
  adminContactEmail: string;
  siteUrl?: string;
}

export interface PuntoLegalAdminEmailParams {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  precio: string;
  fecha: string;
  hora: string;
  tipoReunion: string;
  pagoEstado: string;
  pagoMetodo?: string;
  descripcion?: string;
  bookingId: string;
  reservationLabel?: string;
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
        <p class="sub">Hola ${escapeHtml(p.nombre)}, estos son los datos de tu consulta. Si necesitas cambiar la fecha, responde a este correo.</p>
      </div>
      <div class="body">
        <span class="pill">${escapeHtml(p.servicio)}</span>
        <div class="box" style="margin-top:18px;">
          <div class="row"><span class="lbl">Fecha</span><span class="val">${escapeHtml(p.fecha)}</span></div>
          <div class="row"><span class="lbl">Hora</span><span class="val">${escapeHtml(p.hora)}</span></div>
          <div class="row"><span class="lbl">Modalidad</span><span class="val">${escapeHtml(p.tipoReunion)}</span></div>
          <div class="row"><span class="lbl">Monto</span><span class="val">${escapeHtml(p.precio)}</span></div>
          <div class="row"><span class="lbl">Estado del pago</span><span class="val">${escapeHtml(p.pagoEstado)}</span></div>
        </div>
        ${desc ? `<p class="p" style="margin-top:18px;"><strong style="color:#e2e8f0;">Motivo declarado:</strong><br/>${escapeHtml(desc).replace(/\n/g, "<br/>")}</p>` : ""}
        ${meet ? `<a class="btn" href="${escapeHtml(meet)}" target="_blank" rel="noopener">Unirse a la videollamada</a>` : `<p class="p" style="margin-top:16px;">Te enviaremos el enlace de la reunión por este mismo canal antes de la hora acordada.</p>`}
        ${track ? `<p class="p" style="font-size:13px;color:#64748b;">Código de referencia: <strong style="color:#94a3b8;">${escapeHtml(track)}</strong></p>` : ""}
        <p class="p" style="font-size:13px;color:#64748b;">ID interno: ${escapeHtml(p.bookingId)}</p>
        <div class="box" style="margin-top:8px;">
          <p class="p" style="margin:0;font-size:14px;">¿Dudas? Escríbenos a <a href="mailto:${escapeHtml(p.adminContactEmail)}">${escapeHtml(p.adminContactEmail)}</a> o WhatsApp +56 9 6232 1883.</p>
        </div>
      </div>
      <div class="foot">
        Secreto profesional · Código de Ética del Colegio de Abogados<br/>
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
        <p class="sub">Cita ${escapeHtml(p.fecha)} a las ${escapeHtml(p.hora)} · ${escapeHtml(p.servicio)}</p>
      </div>
      <div class="body">
        <div class="box">
          <div class="row"><span class="lbl">Cliente</span><span class="val">${escapeHtml(p.nombre)}</span></div>
          <div class="row"><span class="lbl">Correo</span><span class="val">${escapeHtml(p.email)}</span></div>
          <div class="row"><span class="lbl">Teléfono</span><span class="val">${escapeHtml(p.telefono)}</span></div>
        </div>
        <div class="box" style="margin-top:16px;">
          <div class="row"><span class="lbl">Servicio</span><span class="val">${escapeHtml(p.servicio)}</span></div>
          <div class="row"><span class="lbl">Monto</span><span class="val">${escapeHtml(p.precio)}</span></div>
          <div class="row"><span class="lbl">Modalidad</span><span class="val">${escapeHtml(p.tipoReunion)}</span></div>
          <div class="row"><span class="lbl">Pago</span><span class="val">${escapeHtml(p.pagoEstado)} · ${escapeHtml(met)}</span></div>
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
  });
}
