/**
 * Envía correos de prueba (cliente + admin) vía Edge Function clever-action + Resend.
 * Requiere: SUPABASE_URL, SUPABASE_ANON_KEY (o VITE_*), y opcional SUPABASE_SERVICE_ROLE_KEY
 * para crear una reserva de prueba si no existe.
 *
 * Uso: node scripts/send-test-booking-emails.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const TEST_EMAIL = "puntolegalelgolf@gmail.com";

function loadEnvFile(filename) {
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

const URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://qrgelocijmwnxcckxbdg.supabase.co";

/** Misma clave anónima pública del front (solo para invocar Edge Functions). */
const FALLBACK_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI";

const ANON =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  FALLBACK_ANON;

const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_TOKEN =
  process.env.ADMIN_EDGE_TOKEN || "puntolegal-admin-token-2025";

async function main() {
  if (!SERVICE_ROLE) {
    console.warn(
      "⚠️ Sin SUPABASE_SERVICE_ROLE_KEY: no se puede crear/buscar reserva por email; define TEST_BOOKING_ID o añade la clave en .env.local",
    );
  }

  let bookingId =
    process.env.TEST_BOOKING_ID || process.env.BOOKING_ID || null;
  if (bookingId) {
    console.log("BOOKING_ID desde entorno:", bookingId);
  }

  if (!bookingId && SERVICE_ROLE) {
    const admin = createClient(URL, SERVICE_ROLE);
    const { data: found } = await admin
      .from("reservas")
      .select("id")
      .eq("email", TEST_EMAIL)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (found?.id) {
      bookingId = found.id;
      console.log("Usando reserva existente:", bookingId);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const { data: inserted, error } = await admin
        .from("reservas")
        .insert({
          nombre: "Prueba correo Punto Legal",
          email: TEST_EMAIL,
          telefono: "+56 9 6232 1883",
          rut: "12345678-9",
          servicio: "Prueba diseño de correo",
          precio: "89000",
          fecha: today,
          hora: "10:00",
          descripcion: "Registro generado por scripts/send-test-booking-emails.mjs",
          estado: "pendiente",
          pago_estado: "aprobado",
          tipo_reunion: "videollamada",
        })
        .select("id")
        .single();

      if (error) {
        console.error("No se pudo crear reserva de prueba:", error.message);
        process.exit(1);
      }
      bookingId = inserted.id;
      console.log("Creada reserva de prueba:", bookingId);
    }
  }

  if (!bookingId) {
    console.error(
      "No hay reserva de prueba. Configura SUPABASE_SERVICE_ROLE_KEY o TEST_BOOKING_ID=<uuid>",
    );
    process.exit(1);
  }

  const res = await fetch(`${URL}/functions/v1/clever-action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON}`,
      "X-Admin-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify({ booking_id: bookingId }),
  });

  const text = await res.text();
  console.log("HTTP", res.status, text);

  if (!res.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
