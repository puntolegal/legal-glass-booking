import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { legacyAdminHtml, legacyClientHtml } from "../_shared/puntoLegalBookingEmail.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY no configurada" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const bookingData: BookingEmailRequest = await req.json();

    console.log("📧 Enviando emails (send-booking-email):", bookingData.reservationId);

    const mailFrom = Deno.env.get("MAIL_FROM") ||
      "Punto Legal <team@puntolegal.online>";
    const adminEmail = Deno.env.get("ADMIN_EMAIL") ||
      "puntolegalelgolf@gmail.com";

    const clientEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: mailFrom,
        to: [bookingData.email],
        subject: `Consulta confirmada — ${bookingData.servicio} · Punto Legal`,
        html: legacyClientHtml(bookingData, adminEmail),
      }),
    });

    if (!clientEmailResponse.ok) {
      throw new Error(`Cliente: ${await clientEmailResponse.text()}`);
    }

    const clientData = await clientEmailResponse.json();
    console.log("✅ Email cliente:", clientData);

    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: mailFrom,
        to: [adminEmail],
        subject: `Nueva consulta — ${bookingData.nombre} · ${bookingData.servicio}`,
        html: legacyAdminHtml(bookingData),
      }),
    });

    if (!adminEmailResponse.ok) {
      throw new Error(`Admin: ${await adminEmailResponse.text()}`);
    }

    const adminData = await adminEmailResponse.json();
    console.log("✅ Email admin:", adminData);

    return new Response(
      JSON.stringify({
        success: true,
        clientEmailId: clientData.id,
        adminEmailId: adminData.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Error enviando emails:", message);
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);
