import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailCampaign {
  leadId: string;
  email: string;
  name: string;
  planRecommended: string;
  servicioInteresado: string;
  daysSinceCreated: number;
  campaignType: 'recovery' | 'nurturing' | 'urgency' | 'testimonial';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get leads for campaigns
    const { data: quizLeads, error: leadsError } = await supabaseClient
      .from('leads_quiz')
      .select('*')
      .in('status', ['lead', 'contacted'])
      .order('created_at', { ascending: false });

    if (leadsError) {
      throw new Error(`Error fetching leads: ${leadsError.message}`)
    }

    const emailsSent = [];
    const currentDate = new Date();

    for (const lead of quizLeads || []) {
      const createdDate = new Date(lead.created_at);
      const daysSinceCreated = Math.floor(
        (currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Determine campaign type based on days
      let campaignType: string | null = null;
      
      if (daysSinceCreated === 1) {
        campaignType = 'recovery';
      } else if (daysSinceCreated === 3) {
        campaignType = 'nurturing';
      } else if (daysSinceCreated === 6) {
        campaignType = 'urgency';
      } else if (daysSinceCreated === 10) {
        campaignType = 'testimonial';
      }

      if (!campaignType) continue;

      // Check if we already sent this campaign type
      const { data: existingCampaign } = await supabaseClient
        .from('email_campaigns_sent')
        .select('id')
        .eq('lead_id', lead.id)
        .eq('campaign_type', campaignType)
        .single();

      if (existingCampaign) continue;

      // Generate email content
      const emailContent = generateEmailContent({
        leadId: lead.id,
        email: lead.email,
        name: lead.name,
        planRecommended: lead.plan_recommended,
        servicioInteresado: lead.quiz_answers.servicio,
        daysSinceCreated,
        campaignType: campaignType as any
      });

      // Send email using Supabase Auth
      const { error: emailError } = await supabaseClient.auth.admin.sendRawEmail({
        to: emailContent.to,
        subject: emailContent.subject,
        html: emailContent.html
      });

      if (!emailError) {
        // Record campaign sent
        await supabaseClient
          .from('email_campaigns_sent')
          .insert({
            lead_id: lead.id,
            campaign_type: campaignType,
            sent_at: new Date().toISOString()
          });

        // Update lead status
        await supabaseClient
          .from('leads_quiz')
          .update({ 
            status: 'contacted',
            updated_at: new Date().toISOString()
          })
          .eq('id', lead.id);

        emailsSent.push({
          leadId: lead.id,
          email: lead.email,
          campaignType
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailsSent,
        totalProcessed: emailsSent.length
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    )
  }
})

// Email template generation functions
function generateEmailContent(campaign: EmailCampaign) {
  const templates = {
    recovery: {
      subject: `${campaign.name}, tu plan legal te está esperando 🎯`,
      getContent: () => ({
        preheader: 'Recupera tu 50% de descuento antes de que expire',
        headline: `Hola ${campaign.name}, notamos que no completaste tu reserva`,
        body: `
          <p>Hace unos días nos visitaste buscando ayuda con <strong>${getServiceName(campaign.servicioInteresado)}</strong>.</p>
          
          <p>Entendemos que tomar decisiones legales requiere tiempo, pero no queremos que pierdas esta oportunidad:</p>
          
          <div style="background-color: #FEF2F2; border-left: 4px solid #F87171; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #991B1B;">⏰ Tu descuento del 50% expira en 48 horas</p>
            <p style="margin: 10px 0 0 0; color: #7F1D1D;">Después de este plazo, el precio volverá a su valor normal.</p>
          </div>
          
          <h3>¿Por qué actuar ahora?</h3>
          <ul>
            <li>📊 <strong>92% de casos exitosos</strong> en Derecho de Familia</li>
            <li>⚡ <strong>Respuesta en menos de 24 horas</strong> para casos urgentes</li>
            <li>💰 <strong>Ahorro de ${getSavingsAmount(campaign.planRecommended)}</strong> con el descuento actual</li>
            <li>🛡️ <strong>Garantía de satisfacción</strong> o te devolvemos tu dinero</li>
          </ul>
        `,
        cta: {
          text: 'Recuperar Mi Descuento',
          url: `https://puntolegal.online/agendamiento?plan=${getPlanUrl(campaign.planRecommended)}&utm_source=email&utm_medium=recovery&utm_campaign=lead_recovery`
        }
      })
    },
    nurturing: {
      subject: `${campaign.name}, 3 señales de que necesitas un abogado YA ⚖️`,
      getContent: () => ({
        preheader: 'Descubre si tu caso requiere atención legal urgente',
        headline: `${campaign.name}, ¿sabías que el 73% de las personas esperan demasiado?`,
        body: `
          <p>En Derecho de Familia, el tiempo es crucial. Aquí están las señales de alerta:</p>
          
          <h3>🚨 Señal #1: Los problemas no se resuelven solos</h3>
          <p>Si han pasado más de 30 días sin una solución clara, es momento de actuar profesionalmente.</p>
          
          <h3>⚠️ Señal #2: La otra parte tiene abogado</h3>
          <p>No te quedes en desventaja. Iguala las condiciones con asesoría experta.</p>
          
          <h3>❗ Señal #3: Afecta tu bienestar emocional</h3>
          <p>Tu paz mental vale más que cualquier ahorro. Resuelve y sigue adelante.</p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">💡 Caso Real:</h4>
            <p style="font-style: italic;">"Esperé 6 meses pensando que se resolvería solo. Al final, me costó el doble. Ojalá hubiera actuado antes."</p>
            <p style="text-align: right; font-weight: bold;">- Carolina M., Providencia</p>
          </div>
        `,
        cta: {
          text: 'Quiero Una Evaluación Gratis',
          url: `https://puntolegal.online/servicio-familia?utm_source=email&utm_medium=nurturing&utm_campaign=education#quiz`
        }
      })
    },
    urgency: {
      subject: `⚡ ${campaign.name}, última oportunidad (24 horas) 🔥`,
      getContent: () => ({
        preheader: '50% OFF termina mañana - No hay extensiones',
        headline: `${campaign.name}, esto es importante:`,
        body: `
          <div style="background-color: #FEF3C7; border: 2px dashed #F59E0B; padding: 20px; margin: 20px 0; text-align: center;">
            <h2 style="color: #D97706; margin: 0;">⏳ QUEDAN 24 HORAS</h2>
            <p style="font-size: 18px; margin: 10px 0;">Tu descuento del 50% expira mañana a las 23:59</p>
          </div>
          
          <p>Sé que tomar decisiones legales no es fácil, pero considera esto:</p>
          
          <table style="width: 100%; margin: 20px 0;">
            <tr>
              <td style="padding: 15px; background-color: #FEE2E2; border-radius: 8px; width: 48%;">
                <strong>❌ Si esperas:</strong><br>
                • Pagarás el doble<br>
                • Tu problema puede agravarse<br>
                • Perderás tiempo valioso
              </td>
              <td style="width: 4%;"></td>
              <td style="padding: 15px; background-color: #D1FAE5; border-radius: 8px; width: 48%;">
                <strong>✅ Si actúas hoy:</strong><br>
                • Ahorras miles de pesos<br>
                • Inicias tu solución mañana<br>
                • Duermes tranquilo/a
              </td>
            </tr>
          </table>
          
          <h3>🎁 Bonus especial (solo hoy):</h3>
          <p>Si contratas en las próximas 24 horas, incluimos GRATIS:</p>
          <ul>
            <li>📞 Llamada de emergencia 24/7 por 3 meses</li>
            <li>📄 Revisión de documentos adicionales sin costo</li>
            <li>💬 WhatsApp prioritario con respuesta en 2 horas</li>
          </ul>
        `,
        cta: {
          text: '🔥 Asegurar Mi Descuento Ahora',
          url: `https://puntolegal.online/agendamiento?plan=${getPlanUrl(campaign.planRecommended)}&utm_source=email&utm_medium=urgency&utm_campaign=last_chance`
        }
      })
    },
    testimonial: {
      subject: `${campaign.name}, mira lo que logramos para María 💪`,
      getContent: () => ({
        preheader: 'Historia real de éxito en tu mismo caso',
        headline: `${campaign.name}, esta historia podría ser la tuya:`,
        body: `
          <div style="background-color: #F9FAFB; padding: 25px; border-radius: 12px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📖 El Caso de María González</h3>
            <p><strong>Situación:</strong> Divorcio complicado con hijos y propiedades</p>
            <p><strong>Preocupación:</strong> "No sabía si valía la pena contratar un abogado..."</p>
            <p><strong>Resultado:</strong> Acuerdo favorable en 3 meses, custodia compartida</p>
            
            <blockquote style="border-left: 4px solid #10B981; padding-left: 20px; margin: 20px 0; font-style: italic;">
              "Lo mejor que pude hacer fue tomar acción rápido. El equipo de Punto Legal no solo resolvió mi caso, 
              sino que me ahorraron meses de angustia. Ojalá lo hubiera hecho antes."
            </blockquote>
            <p style="text-align: right;"><strong>- María G., Las Condes</strong></p>
          </div>
          
          <h3>Los números hablan por sí solos:</h3>
          <div style="text-align: center; margin: 20px 0;">
            <div style="display: inline-block; margin: 0 20px;">
              <p style="font-size: 36px; font-weight: bold; color: #10B981; margin: 0;">92%</p>
              <p style="margin: 0;">Casos exitosos</p>
            </div>
            <div style="display: inline-block; margin: 0 20px;">
              <p style="font-size: 36px; font-weight: bold; color: #3B82F6; margin: 0;">15 días</p>
              <p style="margin: 0;">Tiempo promedio</p>
            </div>
            <div style="display: inline-block; margin: 0 20px;">
              <p style="font-size: 36px; font-weight: bold; color: #F59E0B; margin: 0;">2,400+</p>
              <p style="margin: 0;">Clientes felices</p>
            </div>
          </div>
          
          <p><strong>¿La diferencia?</strong> María actuó rápido y aprovechó la oferta especial, 
          igual que puedes hacerlo tú ahora.</p>
        `,
        cta: {
          text: 'Quiero Mi Historia de Éxito',
          url: `https://puntolegal.online/agendamiento?plan=${getPlanUrl(campaign.planRecommended)}&utm_source=email&utm_medium=testimonial&utm_campaign=success_story`
        }
      })
    }
  };

  const template = templates[campaign.campaignType];
  const content = template.getContent();

  return {
    to: campaign.email,
    subject: template.subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #E11D48; margin: 0;">Punto Legal</h1>
            <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">Tu tranquilidad legal</p>
          </div>
          
          <!-- Preheader -->
          <p style="color: #6B7280; font-size: 14px; margin-bottom: 20px;">${content.preheader}</p>
          
          <!-- Headline -->
          <h2 style="color: #111827; margin-bottom: 20px;">${content.headline}</h2>
          
          <!-- Body -->
          ${content.body}
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${content.cta.url}" style="display: inline-block; background: linear-gradient(to right, #EC4899, #F43F5E); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              ${content.cta.text}
            </a>
          </div>
          
          <!-- PS -->
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            P.D. Si tienes alguna duda, responde este email y te ayudaremos personalmente.
          </p>
          
          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 12px; color: #6B7280;">
            <p>Punto Legal Online | Las Condes, Santiago</p>
            <p>
              <a href="https://puntolegal.online/unsubscribe?email=${campaign.email}" style="color: #6B7280; text-decoration: underline;">Desuscribirse</a> | 
              <a href="https://puntolegal.online/privacidad" style="color: #6B7280; text-decoration: underline;">Política de Privacidad</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

// Helper functions
function getServiceName(servicio: string): string {
  const services: Record<string, string> = {
    'divorcio-acuerdo': 'Divorcio de Común Acuerdo',
    'divorcio-contencioso': 'Divorcio Contencioso',
    'pension': 'Pensión de Alimentos',
    'custodia': 'Custodia y Régimen de Visitas',
    'vif': 'Violencia Intrafamiliar',
    'otro': 'temas de Derecho de Familia'
  };
  return services[servicio] || 'asesoría legal';
}

function getPlanUrl(plan: string): string {
  const plans: Record<string, string> = {
    'integral': 'familia-integral',
    'premium': 'familia-premium',
    'elite': 'familia-elite'
  };
  return plans[plan] || 'consulta-estrategica-familia';
}

function getSavingsAmount(plan: string): string {
  const savings: Record<string, string> = {
    'integral': '$550.000',
    'premium': '$1.100.000',
    'elite': '$1.700.000'
  };
  return savings[plan] || '$300.000';
}















