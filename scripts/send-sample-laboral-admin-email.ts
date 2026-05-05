/**
 * Envía al admin un correo de muestra con la plantilla admin actual (modo claro glass + teal laboral),
 * como si hubiera una nueva reserva laboral / diagnóstico gratis.
 *
 * Requiere RESEND_API_KEY en el entorno (.env.local cargado por npm si lo añades manualmente).
 *
 * Uso: npx tsx scripts/send-sample-laboral-admin-email.ts
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { buildPuntoLegalAdminEmailHtml } from "../supabase/functions/_shared/puntoLegalBookingEmail.ts";

function loadEnvFile(filename: string) {
  const p = resolve(process.cwd(), filename);
  if (!existsSync(p)) return;
  const raw = readFileSync(p, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");
loadEnvFile(".env.backend");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM || "Punto Legal <team@puntolegal.online>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "puntolegalelgolf@gmail.com";

async function main() {
  if (!RESEND_API_KEY) {
    console.error("Falta RESEND_API_KEY (añádela a .env.local o export RESEND_API_KEY=...)");
    process.exit(1);
  }

  const html = buildPuntoLegalAdminEmailHtml({
    nombre: "María Contreras (muestra)",
    email: "maria.ejemplo.trabajadora@email.com",
    telefono: "+56 9 8765 4321",
    servicio: "Punto Legal Laboral — Diagnóstico gratis",
    precio: "Gratis",
    fecha: "2026-05-12",
    hora: "16:00",
    fechaLarga: "lunes 12 de mayo de 2026",
    horaEtiqueta: "16:00 · hora Chile",
    tipoReunion: "Videollamada (Google Meet)",
    pagoEstado: "aprobado",
    pagoMetodo: "Consulta gratuita",
    descripcion:
      "Muestra de diseño: consulta por despido y posible nulidad; traeré carta de término y últimas liquidaciones.",
    bookingId: "muestra-laboral-diseno-PL",
    meetLink: "https://meet.google.com/lookup/demo-punto-legal-laboral",
  });

  const asuntoFecha = " · 12 may 16:00";
  const subject = `[Muestra HTML] Nueva consulta${asuntoFecha} — María Contreras (muestra) · Punto Legal Laboral — Diagnóstico gratis`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [ADMIN_EMAIL],
      subject,
      html,
    }),
  });

  const text = await res.text();
  console.log("Resend HTTP", res.status, text);
  if (!res.ok) process.exit(1);
  console.log("Enviado a", ADMIN_EMAIL);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
