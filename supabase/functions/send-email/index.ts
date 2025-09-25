// Supabase Edge Function para enviar emails con Resend
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { emailData } = await req.json();

    if (!emailData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Datos de email requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Resend API Key from Supabase environment variables
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no está configurado en las variables de entorno de Supabase.');
    }

    // Llamada a Resend API desde el servidor
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error de Resend API:', errorData);
      throw new Error(`Resend API Error: ${errorData.message || 'Error desconocido'}`);
    }

    const result = await response.json();

    console.log('✅ Email enviado exitosamente:', result.id);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: result.id,
        message: 'Email enviado exitosamente'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en Supabase Function send-email:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
