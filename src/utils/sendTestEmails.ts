/**
 * Pruebas de correo Resend (confirmación cliente + aviso interno).
 * Producción usa la Edge Function `clever-action` desde PaymentSuccessPage / webhook MP.
 */

import { supabase } from "@/integrations/supabase/client";

const ADMIN_TOKEN = "puntolegal-admin-token-2025";

/** Invoca clever-action (mismas plantillas HTML que el pago real). */
export async function sendTestCleverActionEmails(bookingId: string) {
  const { data, error } = await supabase.functions.invoke("clever-action", {
    body: { booking_id: bookingId },
    headers: { "X-Admin-Token": ADMIN_TOKEN },
  });

  if (error) {
    console.error("❌ clever-action:", error);
    throw error;
  }

  console.log("✅ clever-action:", data);
  return data;
}

/** @deprecated Usar sendTestCleverActionEmails; send-booking-email queda por compatibilidad. */
export async function sendTestBookingEmailsLegacy(payload: {
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
}) {
  const { data, error } = await supabase.functions.invoke("send-booking-email", {
    body: payload,
  });

  if (error) throw error;
  return data;
}

export const TEST_INBOX_EMAIL = "puntolegalelgolf@gmail.com";

if (typeof window !== "undefined") {
  (window as unknown as { sendTestCleverActionEmails: typeof sendTestCleverActionEmails }).sendTestCleverActionEmails =
    sendTestCleverActionEmails;
  console.log("✅ Prueba de correos: window.sendTestCleverActionEmails('<uuid-reserva>')");
}
