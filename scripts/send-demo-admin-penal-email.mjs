/**
 * Demo: correo de admin como si hubieran pagado consulta Penal (landing + agendamiento).
 * Uso: desde la raíz del repo, con RESEND_API_KEY en el entorno:
 *   export $(grep -v '^#' .env.local | xargs) 2>/dev/null; node scripts/send-demo-admin-penal-email.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvFile(name) {
  try {
    const raw = readFileSync(join(root, name), "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const k = t.slice(0, eq).trim();
      let v = t.slice(eq + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    /* omitir */
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const RESEND = process.env.RESEND_API_KEY;
const FROM = process.env.MAIL_FROM || "Punto Legal <team@puntolegal.online>";
const ADMIN = process.env.ADMIN_EMAIL || "puntolegalelgolf@gmail.com";

if (!RESEND) {
  console.error("Falta RESEND_API_KEY (define en .env.local o export manual).");
  process.exit(1);
}

/** Replica mínima de buildPuntoLegalAdminEmailHtml (misma estructura visual). */
function adminPenalDemoHtml() {
  const p = {
    nombre: "Usuario Demo Penal",
    email: "cliente.demo@example.com",
    telefono: "+56 9 0000 0000",
    servicio: "Punto Legal Penal",
    precio: "$169.000 CLP",
    fecha: "2026-04-28",
    hora: "11:00",
    fechaLarga: "martes 28 de abril de 2026",
    horaEtiqueta: "11:00 · hora Chile",
    tipoReunion: "Videollamada (Google Meet)",
    pagoEstado: "aprobado",
    pagoMetodo: "MercadoPago",
    descripcion: "Consulta penal (demo desde script — flujo landing/agendamiento).",
    bookingId: "demo-penal-" + Date.now(),
  };
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"/><title>Nueva reserva — Punto Legal</title></head>
<body style="margin:0;background:#020617;color:#e2e8f0;font-family:system-ui,sans-serif;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:24px;">
    <p style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Panel interno · <strong style="color:#f8fafc;">Nueva consulta</strong></p>
    <h1 style="font-size:20px;color:#f8fafc;margin:8px 0;">Reserva pagada / confirmada</h1>
    <p style="color:#94a3b8;"><strong style="color:#e2e8f0;">Fecha y hora:</strong> ${esc(p.fechaLarga)} — ${esc(p.horaEtiqueta)} · ${esc(p.servicio)}</p>
    <div style="margin-top:16px;padding:16px;border-radius:14px;border:1px solid rgba(34,211,238,0.35);background:rgba(34,211,238,0.08);">
      <p style="margin:0;font-size:11px;color:#64748b;text-transform:uppercase;">Recordatorio cita (admin)</p>
      <p style="margin:4px 0 0;font-size:17px;font-weight:700;color:#f8fafc;">${esc(p.fechaLarga)}</p>
      <p style="margin:8px 0 0;font-size:15px;font-weight:600;color:#a5f3fc;">${esc(p.horaEtiqueta)}</p>
    </div>
    <table style="width:100%;margin-top:16px;font-size:14px;border-collapse:collapse;">
      <tr><td style="color:#94a3b8;padding:8px 0;">Cliente</td><td style="text-align:right;font-weight:600;">${esc(p.nombre)}</td></tr>
      <tr><td style="color:#94a3b8;padding:8px 0;">Correo</td><td style="text-align:right;font-weight:600;">${esc(p.email)}</td></tr>
      <tr><td style="color:#94a3b8;padding:8px 0;">Teléfono</td><td style="text-align:right;font-weight:600;">${esc(p.telefono)}</td></tr>
      <tr><td style="color:#94a3b8;padding:8px 0;">Fecha (BD)</td><td style="text-align:right;font-weight:600;">${esc(p.fecha)}</td></tr>
      <tr><td style="color:#94a3b8;padding:8px 0;">Hora (BD)</td><td style="text-align:right;font-weight:600;">${esc(p.hora)}</td></tr>
      <tr><td style="color:#94a3b8;padding:8px 0;">Servicio</td><td style="text-align:right;font-weight:600;">${esc(p.servicio)}</td></tr>
      <tr><td style="color:#94a3b8;padding:8px 0;">Monto</td><td style="text-align:right;font-weight:600;">${esc(p.precio)}</td></tr>
      <tr><td style="color:#94a3b8;padding:8px 0;">Modalidad</td><td style="text-align:right;font-weight:600;">${esc(p.tipoReunion)}</td></tr>
      <tr><td style="color:#94a3b8;padding:8px 0;">Pago</td><td style="text-align:right;font-weight:600;">${esc(p.pagoEstado)} · ${esc(p.pagoMetodo)}</td></tr>
    </table>
    <p style="margin-top:16px;font-size:13px;color:#64748b;">${esc(p.descripcion)}</p>
    <p style="font-size:12px;color:#64748b;">ID demo: ${esc(p.bookingId)}</p>
  </div>
</body></html>`;
}

const html = adminPenalDemoHtml();
const subject = `Nueva consulta · lun 28 abr 11:00 — Usuario Demo Penal · Punto Legal Penal [DEMO]`;

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${RESEND}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: FROM,
    to: [ADMIN],
    subject,
    html,
  }),
});

const text = await res.text();
if (!res.ok) {
  console.error("Resend error:", res.status, text);
  process.exit(1);
}
console.log("Enviado a", ADMIN, "→", text);
