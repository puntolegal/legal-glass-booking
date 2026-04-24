/**
 * Envío puntual Resend — invitación Meet (misma estética que puntoLegalBookingEmail).
 * Uso: node --import dotenv/config scripts/send-catalina-meet-invite.mjs
 * Variables: RESEND_API_KEY (o en .env.local)
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const RESEND = process.env.RESEND_API_KEY;
const FROM = process.env.MAIL_FROM || "Punto Legal <team@puntolegal.online>";
const MEET = "https://meet.google.com/gnw-xhjf-epa";
const ADMIN = "puntolegalelgolf@gmail.com";
const TO = "catalina.jorga@gmail.com";
const NOMBRE = "Catalina";

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
  .box { margin-top:20px; padding:16px 18px; border-radius:14px; background:rgba(2,6,23,0.55); border:1px solid rgba(255,255,255,0.06); }
  .btn { display:inline-block; margin-top:16px; padding:14px 22px; border-radius:12px; font-weight:700; font-size:15px; color:#020617 !important;
    background:linear-gradient(135deg,#22d3ee 0%,#38bdf8 45%,#6366f1 100%); box-shadow:0 12px 28px rgba(34,211,238,0.25); text-decoration:none; }
  .foot { padding:20px 28px 28px; text-align:center; font-size:12px; color:#64748b; border-top:1px solid rgba(255,255,255,0.06); background:rgba(2,6,23,0.35); }
`;

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <title>Consulta — Punto Legal Chile</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <div class="brand">Punto Legal <strong>Chile</strong><span class="sep"></span>Consulta</div>
        <div class="title">Tu videollamada con Punto Legal</div>
        <p class="sub">Hola ${NOMBRE}, aquí tienes el enlace para conectarte por <strong style="color:#e2e8f0;">Google Meet</strong>. Las consultas y coordinaciones se gestionan por correo a <a href="mailto:${ADMIN}" style="color:#22d3ee;">${ADMIN}</a>.</p>
      </div>
      <div class="body">
        <div class="box" style="border:1px solid rgba(34,211,238,0.35);background:rgba(34,211,238,0.08);">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:600;">Enlace de la reunión</p>
          <p style="margin:0;font-size:15px;color:#cbd5e1;line-height:1.6;">Usa el botón para unirte el día y la hora acordados. Si el navegador no abre Meet, copia y pega el enlace en una pestaña nueva.</p>
        </div>
        <a class="btn" href="${MEET}" target="_blank" rel="noopener">Unirse a la videollamada (Google Meet)</a>
        <div class="box" style="margin-top:20px;">
          <p class="p" style="margin:0;font-size:14px;"><strong style="color:#f1f5f9;">Importante.</strong> Todas las consultas y comunicación formal con el equipo deben dirigirse al correo <a href="mailto:${ADMIN}">${ADMIN}</a>. Revisamos ese buzón de forma prioritaria.</p>
        </div>
        <p class="p" style="margin-top:18px;font-size:13px;color:#64748b;">Enlace directo: <a href="${MEET}" style="color:#22d3ee;word-break:break-all;">${MEET}</a></p>
      </div>
      <div class="foot">
        Secreto profesional · Código de Ética del Colegio de Abogados<br/>
        <a href="https://puntolegal.online" style="color:#22d3ee;">puntolegal.online</a> · El Golf, Las Condes, Santiago
      </div>
    </div>
  </div>
</body>
</html>`;

if (!RESEND) {
  console.error("Falta RESEND_API_KEY en el entorno (.env.local / .env).");
  process.exit(1);
}

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${RESEND}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: FROM,
    to: [TO, ADMIN],
    reply_to: ADMIN,
    subject: "Tu consulta Punto Legal — enlace Google Meet",
    html,
  }),
});

const body = await res.text();
if (!res.ok) {
  console.error("Resend error:", res.status, body);
  process.exit(1);
}
console.log("OK:", body);
