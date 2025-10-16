/**
 * Utility para enviar emails de prueba
 * Este archivo se puede ejecutar desde la consola del navegador
 */

import { supabase } from "@/integrations/supabase/client";

interface TestEmailData {
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

export async function sendTestBookingEmails(data: TestEmailData) {
  try {
    console.log("📧 Enviando emails de prueba...");
    console.log("📋 Datos:", data);

    const { data: response, error } = await supabase.functions.invoke(
      "send-booking-email",
      {
        body: data,
      }
    );

    if (error) {
      console.error("❌ Error:", error);
      throw error;
    }

    console.log("✅ Emails enviados exitosamente:", response);
    return response;
  } catch (error) {
    console.error("❌ Error enviando emails:", error);
    throw error;
  }
}

// Función helper para enviar emails de la última reserva
export async function sendEmailsForLastReservation() {
  try {
    // Consultar la última reserva de benja.soza@gmail.com
    const { data: reserva, error } = await supabase
      .from("reservas")
      .select("*")
      .eq("email", "benja.soza@gmail.com")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !reserva) {
      console.error("❌ No se encontró la reserva:", error);
      throw new Error("No se encontró la reserva");
    }

    console.log("📋 Reserva encontrada:", reserva);

    // Generar datos para el email
    const emailData: TestEmailData = {
      reservationId: reserva.id,
      nombre: reserva.nombre,
      email: reserva.email,
      telefono: reserva.telefono,
      servicio: reserva.servicio,
      precio: reserva.precio,
      fecha: new Date(reserva.fecha).toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      hora: reserva.hora,
      pagoEstado: reserva.pago_estado || "Aprobado",
      pagoMetodo: "MercadoPago",
      trackingCode: reserva.external_reference || "PL-TEST-001",
      googleMeetLink: "https://meet.google.com/abc-defg-hij",
    };

    return await sendTestBookingEmails(emailData);
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// Hacer las funciones disponibles globalmente para testing
if (typeof window !== "undefined") {
  (window as any).sendTestBookingEmails = sendTestBookingEmails;
  (window as any).sendEmailsForLastReservation = sendEmailsForLastReservation;
  console.log("✅ Funciones de testing disponibles:");
  console.log("   - window.sendTestBookingEmails(data)");
  console.log("   - window.sendEmailsForLastReservation()");
}
