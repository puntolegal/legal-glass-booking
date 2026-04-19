// RUTA: src/lib/whatsapp.ts
// Helpers para CTAs de WhatsApp con mensajes pre-escritos
// optimizados para máxima conversión y fidelidad de marca.

/**
 * Número de WhatsApp del estudio (formato internacional sin "+").
 * Si cambia, basta con actualizarlo aquí y todos los CTAs lo recogen.
 */
export const WHATSAPP_NUMBER = "56962321883";

/**
 * Plantillas de mensaje pre-escrito por contexto.
 * Cada mensaje sigue la misma estructura de alta conversión:
 *   1. Saludo cálido + identificación de marca → genera contexto
 *   2. Mención del canal de origen → reduce fricción ("vi su sitio")
 *   3. Pain-point específico → demuestra intención real
 *   4. CTA hacia el siguiente paso → orienta la conversación
 *   5. Cierre cordial + emoji → humaniza
 *
 * Emojis usados con criterio: 👋 (saludo), ⚖️ (área legal), 🙏 (gratitud).
 * Sin overuse — el tono debe ser profesional, no informal.
 */
export const WHATSAPP_MESSAGES = {
  /** CTA principal del Hero — orientado al despido (alta intención). */
  despido:
    "Hola Punto Legal 👋, vi su sitio y necesito ayuda con un despido injustificado ⚖️. Me gustaría acceder al diagnóstico gratuito de Tutela Laboral. ¡Gracias! 🙏",

  /** CTA general — para usuarios que no tienen un caso específico aún. */
  general:
    "Hola Punto Legal 👋, vi su sitio y necesito orientación legal. ¿Pueden ayudarme a entender qué consulta me conviene agendar? ¡Gracias! 🙏",

  /** CTA del agendamiento — usuario ya está en el flujo, sólo tiene dudas. */
  agendando:
    "Hola Punto Legal 👋, estoy agendando una consulta y tengo una duda antes de avanzar. ¿Pueden ayudarme? 🙏",

  /** CTA específico para casos de familia — pension, divorcio, cuidado personal. */
  familia:
    "Hola Punto Legal 👋, necesito orientación urgente con un tema de familia (pensión / divorcio / cuidado personal) ⚖️. ¿Pueden ayudarme? 🙏",

  /** CTA específico para empresas. */
  empresa:
    "Hola Punto Legal 👋, soy de una empresa y necesito asesoría legal para temas societarios o laborales. ¿Pueden orientarme? 🙏",
} as const;

export type WhatsAppContext = keyof typeof WHATSAPP_MESSAGES;

/**
 * Construye el href de WhatsApp con el mensaje pre-escrito codificado.
 *
 * @param context — clave del mensaje (default: "despido", el de mayor conversión)
 * @returns URL completa lista para `<a href={...}>`.
 */
export function buildWhatsAppUrl(context: WhatsAppContext = "despido"): string {
  const text = encodeURIComponent(WHATSAPP_MESSAGES[context]);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
