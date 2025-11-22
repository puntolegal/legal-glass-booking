import { supabase } from '@/integrations/supabase/client';

interface LeadQuizData {
  id: string;
  name: string;
  email: string;
  quiz_answers: {
    servicio: string;
    empresa: string;
    internacional: string;
  };
  plan_recommended: string;
  status: string;
  created_at: string;
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

// Plantillas de email según el tipo de campaña
const emailTemplates = {
  recovery: {
    subject: (name: string) => `${name}, tu plan legal te está esperando 🎯`,
    getContent: (data: EmailCampaign) => ({
      preheader: 'Recupera tu 50% de descuento antes de que expire',
      headline: `Hola ${data.name}, notamos que no completaste tu reserva`,
      body: `
        <p>Hace unos días nos visitaste buscando ayuda con <strong>${getServiceName(data.servicioInteresado)}</strong>.</p>
        
        <p>Entendemos que tomar decisiones legales requiere tiempo, pero no queremos que pierdas esta oportunidad:</p>
        
        <div style="background-color: #FEF2F2; border-left: 4px solid #F87171; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #991B1B;">⏰ Tu descuento del 50% expira en 48 horas</p>
          <p style="margin: 10px 0 0 0; color: #7F1D1D;">Después de este plazo, el precio volverá a su valor normal.</p>
        </div>
        
        <h3>¿Por qué actuar ahora?</h3>
        <ul>
          <li>📊 <strong>92% de casos exitosos</strong> en ${getServiceCategory(data.servicioInteresado)}</li>
          <li>⚡ <strong>Respuesta en menos de 24 horas</strong> para casos urgentes</li>
          <li>💰 <strong>Ahorro de ${getSavingsAmount(data.planRecommended)}</strong> con el descuento actual</li>
          <li>🛡️ <strong>Garantía de satisfacción</strong> o te devolvemos tu dinero</li>
        </ul>
      `,
      cta: {
        text: 'Recuperar Mi Descuento',
        url: `https://puntolegal.online/agendamiento?plan=${getPlanUrl(data.planRecommended)}&utm_source=email&utm_medium=recovery&utm_campaign=lead_recovery`
      },
      ps: 'P.D. Si tienes alguna duda, responde este email y te ayudaremos personalmente.'
    })
  },
  
  nurturing: {
    subject: (name: string) => `${name}, 3 señales de que necesitas un abogado YA ⚖️`,
    getContent: (data: EmailCampaign) => ({
      preheader: 'Descubre si tu caso requiere atención legal urgente',
      headline: `${data.name}, ¿sabías que el 73% de las personas esperan demasiado?`,
      body: `
        <p>En ${getServiceCategory(data.servicioInteresado)}, el tiempo es crucial. Aquí están las señales de alerta:</p>
        
        <h3>🚨 Señal #1: ${getWarningSign1(data.servicioInteresado)}</h3>
        <p>${getWarningDescription1(data.servicioInteresado)}</p>
        
        <h3>⚠️ Señal #2: ${getWarningSign2(data.servicioInteresado)}</h3>
        <p>${getWarningDescription2(data.servicioInteresado)}</p>
        
        <h3>❗ Señal #3: ${getWarningSign3(data.servicioInteresado)}</h3>
        <p>${getWarningDescription3(data.servicioInteresado)}</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0;">💡 Caso Real:</h4>
          <p style="font-style: italic;">"${getTestimonial(data.servicioInteresado)}"</p>
          <p style="text-align: right; font-weight: bold;">- ${getTestimonialAuthor(data.servicioInteresado)}</p>
        </div>
      `,
      cta: {
        text: 'Quiero Una Evaluación Gratis',
        url: `https://puntolegal.online/servicio-familia?utm_source=email&utm_medium=nurturing&utm_campaign=education#quiz`
      },
      ps: 'P.D. Respondiendo 3 preguntas rápidas, sabrás exactamente qué plan necesitas.'
    })
  },
  
  urgency: {
    subject: (name: string) => `⚡ ${name}, última oportunidad (24 horas) 🔥`,
    getContent: (data: EmailCampaign) => ({
      preheader: '50% OFF termina mañana - No hay extensiones',
      headline: `${data.name}, esto es importante:`,
      body: `
        <div style="background-color: #FEF3C7; border: 2px dashed #F59E0B; padding: 20px; margin: 20px 0; text-align: center;">
          <h2 style="color: #D97706; margin: 0;">⏳ QUEDAN 24 HORAS</h2>
          <p style="font-size: 18px; margin: 10px 0;">Tu descuento del 50% expira mañana a las 23:59</p>
        </div>
        
        <p>Sé que tomar decisiones legales no es fácil, pero considera esto:</p>
        
        <table style="width: 100%; margin: 20px 0;">
          <tr>
            <td style="padding: 15px; background-color: #FEE2E2; border-radius: 8px;">
              <strong>❌ Si esperas:</strong><br>
              • Pagarás el doble (${getNormalPrice(data.planRecommended)})<br>
              • Tu problema puede agravarse<br>
              • Perderás tiempo valioso
            </td>
            <td style="width: 20px;"></td>
            <td style="padding: 15px; background-color: #D1FAE5; border-radius: 8px;">
              <strong>✅ Si actúas hoy:</strong><br>
              • Ahorras ${getSavingsAmount(data.planRecommended)}<br>
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
        url: `https://puntolegal.online/agendamiento?plan=${getPlanUrl(data.planRecommended)}&utm_source=email&utm_medium=urgency&utm_campaign=last_chance`
      },
      ps: 'P.D. No habrá extensiones. El precio vuelve a ${getNormalPrice(data.planRecommended)} mañana.'
    })
  },
  
  testimonial: {
    subject: (name: string) => `${name}, mira lo que logramos para María 💪`,
    getContent: (data: EmailCampaign) => ({
      preheader: 'Historia real de éxito en tu mismo caso',
      headline: `${data.name}, esta historia podría ser la tuya:`,
      body: `
        <div style="background-color: #F9FAFB; padding: 25px; border-radius: 12px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📖 El Caso de María González</h3>
          <p><strong>Situación:</strong> ${getSimilarSituation(data.servicioInteresado)}</p>
          <p><strong>Preocupación:</strong> "No sabía si valía la pena contratar un abogado..."</p>
          <p><strong>Resultado:</strong> ${getSuccessResult(data.servicioInteresado)}</p>
          
          <blockquote style="border-left: 4px solid #10B981; padding-left: 20px; margin: 20px 0; font-style: italic;">
            "Lo mejor que pude hacer fue tomar acción rápido. El equipo de Punto Legal no solo resolvió mi caso, 
            sino que me ahorraron meses de angustia. Ojalá lo hubiera hecho antes."
          </blockquote>
          <p style="text-align: right;"><strong>- María G., Las Condes</strong></p>
        </div>
        
        <h3>Los números hablan por sí solos:</h3>
        <div style="display: flex; justify-content: space-around; text-align: center; margin: 20px 0;">
          <div>
            <p style="font-size: 36px; font-weight: bold; color: #10B981; margin: 0;">92%</p>
            <p style="margin: 0;">Casos exitosos</p>
          </div>
          <div>
            <p style="font-size: 36px; font-weight: bold; color: #3B82F6; margin: 0;">15 días</p>
            <p style="margin: 0;">Tiempo promedio</p>
          </div>
          <div>
            <p style="font-size: 36px; font-weight: bold; color: #F59E0B; margin: 0;">2,400+</p>
            <p style="margin: 0;">Clientes felices</p>
          </div>
        </div>
        
        <p><strong>¿La diferencia?</strong> María actuó rápido y aprovechó la oferta especial, 
        igual que puedes hacerlo tú ahora.</p>
      `,
      cta: {
        text: 'Quiero Mi Historia de Éxito',
        url: `https://puntolegal.online/agendamiento?plan=${getPlanUrl(data.planRecommended)}&utm_source=email&utm_medium=testimonial&utm_campaign=success_story`
      },
      ps: 'P.D. María ahorró ${getSavingsAmount(data.planRecommended)} con el descuento. Tú también puedes.'
    })
  }
};

// Funciones auxiliares para personalización
function getServiceName(servicio: string): string {
  const services: { [key: string]: string } = {
    'divorcio-acuerdo': 'Divorcio de Común Acuerdo',
    'divorcio-contencioso': 'Divorcio Contencioso',
    'pension': 'Pensión de Alimentos',
    'custodia': 'Custodia y Régimen de Visitas',
    'vif': 'Violencia Intrafamiliar',
    'otro': 'temas de Derecho de Familia'
  };
  return services[servicio] || 'asesoría legal';
}

function getServiceCategory(servicio: string): string {
  return 'Derecho de Familia';
}

function getPlanUrl(plan: string): string {
  const plans: { [key: string]: string } = {
    'integral': 'familia-integral',
    'premium': 'familia-premium',
    'elite': 'familia-elite'
  };
  return plans[plan] || 'consulta-estrategica-familia';
}

function getSavingsAmount(plan: string): string {
  const savings: { [key: string]: string } = {
    'integral': '$550.000',
    'premium': '$1.100.000',
    'elite': '$1.700.000'
  };
  return savings[plan] || '$300.000';
}

function getNormalPrice(plan: string): string {
  const prices: { [key: string]: string } = {
    'integral': '$1.100.000',
    'premium': '$2.200.000',
    'elite': '$3.400.000'
  };
  return prices[plan] || '$600.000';
}

// Funciones para contenido específico según servicio
function getWarningSign1(servicio: string): string {
  const signs: { [key: string]: string } = {
    'divorcio-acuerdo': 'Tu pareja menciona "necesitamos hablar"',
    'divorcio-contencioso': 'Los conflictos escalan cada vez más',
    'pension': 'No recibes el apoyo económico acordado',
    'custodia': 'Dificultades para ver a tus hijos',
    'vif': 'Sientes miedo en tu propia casa'
  };
  return signs[servicio] || 'Sientes que la situación se sale de control';
}

function getWarningDescription1(servicio: string): string {
  const descriptions: { [key: string]: string } = {
    'divorcio-acuerdo': 'Es el momento ideal para proteger tus intereses antes de que sea tarde.',
    'divorcio-contencioso': 'Cada día que pasa, la situación se vuelve más compleja y costosa.',
    'pension': 'Tus hijos tienen derecho a recibir lo que les corresponde por ley.',
    'custodia': 'El tiempo perdido con tus hijos no se recupera. Actúa ahora.',
    'vif': 'Tu seguridad es lo primero. Podemos ayudarte HOY mismo.'
  };
  return descriptions[servicio] || 'No esperes a que sea demasiado tarde.';
}

function getWarningSign2(servicio: string): string {
  return 'Han pasado más de 30 días sin solución';
}

function getWarningDescription2(servicio: string): string {
  return 'El tiempo juega en contra. Mientras más esperas, más difícil es resolver favorablemente.';
}

function getWarningSign3(servicio: string): string {
  return 'No sabes por dónde empezar';
}

function getWarningDescription3(servicio: string): string {
  return 'Es normal sentirse abrumado. Por eso estamos aquí: para guiarte paso a paso.';
}

function getTestimonial(servicio: string): string {
  const testimonials: { [key: string]: string } = {
    'divorcio-acuerdo': 'En 3 meses logramos el divorcio sin peleas. Valió cada peso.',
    'divorcio-contencioso': 'Pensé que perdería todo. Punto Legal me ayudó a proteger mis derechos.',
    'pension': 'Recuperamos 18 meses de pensiones atrasadas. Increíble resultado.',
    'custodia': 'Ahora veo a mis hijos cada semana. No tengo palabras para agradecer.',
    'vif': 'Me salvaron la vida. Literalmente. Actué a tiempo gracias a ellos.'
  };
  return testimonials[servicio] || 'El mejor servicio legal que he recibido. 100% recomendado.';
}

function getTestimonialAuthor(servicio: string): string {
  const authors = ['Carolina M., Providencia', 'Roberto P., Las Condes', 'Patricia S., Vitacura', 'Andrés L., La Reina'];
  return authors[Math.floor(Math.random() * authors.length)];
}

function getSimilarSituation(servicio: string): string {
  const situations: { [key: string]: string } = {
    'divorcio-acuerdo': 'Matrimonio de 12 años, 2 hijos, propiedades en común',
    'divorcio-contencioso': 'Separación conflictiva, disputa por bienes y custodia',
    'pension': 'Padre que no pagaba pensión hace 6 meses',
    'custodia': 'Madre que impedía las visitas sin justificación',
    'vif': 'Situación de violencia psicológica y amenazas'
  };
  return situations[servicio] || 'Problema legal complejo sin solución aparente';
}

function getSuccessResult(servicio: string): string {
  const results: { [key: string]: string } = {
    'divorcio-acuerdo': 'Divorcio en 3 meses, acuerdo justo para ambas partes',
    'divorcio-contencioso': '65% de los bienes + custodia compartida',
    'pension': '$2.4M recuperados + pensión futura asegurada',
    'custodia': 'Régimen de visitas amplio + vacaciones compartidas',
    'vif': 'Medidas de protección + nuevo hogar seguro'
  };
  return results[servicio] || 'Resolución favorable en tiempo récord';
}

// Servicio principal de retargeting
export class EmailRetargetingService {
  // Obtener leads para campañas de retargeting
  static async getLeadsForCampaigns(): Promise<EmailCampaign[]> {
    try {
      // Obtener leads del quiz que no se han convertido
      const { data: quizLeads, error } = await supabase
        .from('leads_quiz')
        .select('*')
        .in('status', ['lead', 'contacted'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const campaigns: EmailCampaign[] = [];

      for (const lead of quizLeads || []) {
        const daysSinceCreated = Math.floor(
          (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        // Determinar tipo de campaña según días transcurridos
        let campaignType: EmailCampaign['campaignType'] = 'recovery';
        
        if (daysSinceCreated === 1) {
          campaignType = 'recovery';
        } else if (daysSinceCreated === 3) {
          campaignType = 'nurturing';
        } else if (daysSinceCreated === 6) {
          campaignType = 'urgency';
        } else if (daysSinceCreated === 10) {
          campaignType = 'testimonial';
        } else {
          continue; // Skip if not in campaign schedule
        }

        campaigns.push({
          leadId: lead.id,
          email: lead.email,
          name: lead.name,
          planRecommended: lead.plan_recommended,
          servicioInteresado: lead.quiz_answers.servicio,
          daysSinceCreated,
          campaignType
        });
      }

      return campaigns;
    } catch (error) {
      console.error('Error getting leads for campaigns:', error);
      return [];
    }
  }

  // Generar contenido de email personalizado
  static generateEmailContent(campaign: EmailCampaign) {
    const template = emailTemplates[campaign.campaignType];
    const subject = template.subject(campaign.name);
    const content = template.getContent(campaign);

    return {
      to: campaign.email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
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
              ${content.ps}
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
      `,
      leadId: campaign.leadId,
      campaignType: campaign.campaignType
    };
  }

  // Marcar lead como procesado
  static async markLeadAsProcessed(leadId: string, campaignType: string) {
    try {
      const { error } = await supabase
        .from('leads_quiz')
        .update({ 
          status: 'contacted',
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      console.log(`Lead ${leadId} marked as contacted for ${campaignType} campaign`);
    } catch (error) {
      console.error('Error marking lead as processed:', error);
    }
  }
}

// Exportar para uso en Edge Functions o scripts
export const runRetargetingCampaigns = async () => {
  const campaigns = await EmailRetargetingService.getLeadsForCampaigns();
  const emailsToSend = [];

  for (const campaign of campaigns) {
    const emailContent = EmailRetargetingService.generateEmailContent(campaign);
    emailsToSend.push(emailContent);
  }

  return emailsToSend;
};















