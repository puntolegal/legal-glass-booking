import { supabase } from '@/integrations/supabase/client';

interface MetaEventUserData {
  em?: string;  // email
  ph?: string;  // phone
  fn?: string;  // first name
  ct?: string;  // city
  ge?: string;  // gender (m/f)
  client_user_agent?: string;
  fbc?: string;
  fbp?: string;
}

interface MetaEventOptions {
  event_name: string;
  user_data?: MetaEventUserData;
  custom_data?: Record<string, unknown>;  // IMPORTANT: Never include PII here (emails, phones)
  event_source_url?: string;
  test_event_code?: string;  // Test event code for Meta testing
  event_id?: string;  // Optional event ID for deduplication (auto-generated if not provided)
}

/**
 * Divisa por defecto de toda la operación (Chile).
 * Cualquier evento puede sobrescribirla pasando `custom_data.currency`.
 */
const DEFAULT_CURRENCY = 'CLP';

/**
 * Lista de eventos estándar de Meta que requieren `value` + `currency` para
 * no ser rechazados en "Calidad del evento" del Administrador de eventos.
 *
 * Meta acepta value=0 en eventos no-transaccionales (ViewContent, Lead, etc.),
 * pero SIEMPRE requiere currency cuando existe value. Por eso siempre
 * enviamos los dos juntos.
 */
const EVENTS_REQUIRING_VALUE = new Set([
  'ViewContent',
  'Search',
  'AddToCart',
  'AddToWishlist',
  'InitiateCheckout',
  'AddPaymentInfo',
  'Purchase',
  'Lead',
  'CompleteRegistration',
  'Schedule',
  'StartTrial',
  'Subscribe',
  'SubmitApplication',
  'Contact',
]);

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

/**
 * Código de prueba de Meta (Events Manager → Probar eventos).
 * Configura `VITE_META_TEST_EVENT_CODE` en `.env.local` (ej. TEST53498) para que
 * todos los `trackMetaEvent` envíen CAPI al flujo de prueba sin repetir el código.
 * En producción déjalo vacío.
 */
function getDefaultTestEventCode(): string | undefined {
  const raw = import.meta.env.VITE_META_TEST_EVENT_CODE;
  if (typeof raw !== 'string') return undefined;
  const t = raw.trim();
  return t.length > 0 ? t : undefined;
}

/**
 * Generate a unique event ID for deduplication between Pixel and CAPI
 */
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Sanitize custom_data to remove any PII before sending to browser Pixel
 */
function sanitizeCustomDataForBrowser(custom_data?: Record<string, unknown>): Record<string, unknown> {
  if (!custom_data) return {};

  // Create a copy and remove any PII fields
  const sanitized = { ...custom_data };

  // Remove any fields that might contain PII
  delete sanitized.email;
  delete sanitized.em;
  delete sanitized.phone;
  delete sanitized.ph;
  delete sanitized.name;
  delete sanitized.fn;
  delete sanitized.user_email;
  delete sanitized.user_phone;

  return sanitized;
}

/**
 * Coerce `value` a número válido para Meta:
 *   - acepta number → lo retorna tal cual si es finito y >= 0
 *   - acepta string "$89.000" o "89.000" o "89000" → extrae dígitos → 89000
 *   - "Gratis", undefined, null o NaN → 0
 *
 * Nota: Meta EXIGE que value sea numérico (no string con letras, comas,
 * símbolos de divisa, etc.). Aceptar 0 es válido para eventos no-transaccionales.
 */
function coerceValue(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) {
    return raw;
  }
  if (typeof raw === 'string') {
    // Extrae sólo dígitos (descarta "$", ".", "CLP", espacios, etc.)
    const digits = raw.replace(/[^0-9]/g, '');
    if (digits.length === 0) return 0;
    const n = parseInt(digits, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }
  return 0;
}

/**
 * Normaliza custom_data garantizando que los eventos de Meta siempre
 * lleven `value` numérico y `currency` (códigos ISO 4217 de 3 letras).
 *
 * Esto previene las advertencias "Falta completar el campo Valor/Divisa"
 * del Administrador de eventos de Meta cuando los call sites omiten estos
 * campos accidentalmente.
 */
function ensureValueAndCurrency(
  eventName: string,
  custom_data?: Record<string, unknown>,
): Record<string, unknown> {
  const data = { ...(custom_data ?? {}) };

  // Sólo agregamos value/currency en los eventos estándar que Meta los pide.
  // Eventos custom arbitrarios se dejan intactos.
  if (!EVENTS_REQUIRING_VALUE.has(eventName)) return data;

  // Normaliza value — acepta number o string con formato chileno ("$89.000")
  data.value = coerceValue(data.value);

  // Normaliza currency — 3 letras uppercase. Default CLP.
  const rawCurrency = typeof data.currency === 'string' ? data.currency : '';
  const trimmed = rawCurrency.trim().toUpperCase();
  data.currency = /^[A-Z]{3}$/.test(trimmed) ? trimmed : DEFAULT_CURRENCY;

  return data;
}

/**
 * Send a server-side event to Meta Conversions API via edge function.
 * Also fires the browser-side fbq pixel event for deduplication.
 * 
 * IMPORTANT: PII (emails, phones) are NEVER sent to browser Pixel.
 * They only go through server-side CAPI where they are properly hashed.
 */
export async function trackMetaEvent(options: MetaEventOptions): Promise<void> {
  const { event_name, user_data, custom_data, event_source_url, test_event_code } = options;
  const resolvedTestCode = test_event_code ?? getDefaultTestEventCode();

  // Garantiza value + currency en eventos estándar (CLP por defecto).
  // Esto es lo que resuelve la advertencia "Falta completar el campo
  // Valor / Divisa" en el Administrador de eventos de Meta.
  const normalizedCustomData = ensureValueAndCurrency(event_name, custom_data);

  // Generate event_id for deduplication
  const event_id = generateEventId();

  // Browser-side pixel (client) - ONLY non-PII data
  try {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      // Sanitize custom_data to remove any PII before sending to browser
      const sanitizedCustomData = sanitizeCustomDataForBrowser(normalizedCustomData);

      // Add event_id for deduplication
      const browserPayload = {
        ...sanitizedCustomData,
        eventID: event_id, // Meta uses eventID for deduplication
      };

      (window as any).fbq('track', event_name, browserPayload);
    }
  } catch (e) {
    console.warn('[Meta Pixel] Client-side error:', e);
  }

  // Server-side CAPI - PII is sent here and will be hashed by the Edge Function
  try {
    // Capturar cookies de Facebook automáticamente para mejorar el match
    const fbcCookie = getCookie('_fbc');
    const fbpCookie = getCookie('_fbp');

    const enrichedUserData: MetaEventUserData = {
      ...user_data,
      // Siempre incluir User Agent del navegador
      client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      // Incluir cookies de Facebook si están disponibles (mejora el match de usuarios)
      ...(fbcCookie ? { fbc: fbcCookie } : {}),
      ...(fbpCookie ? { fbp: fbpCookie } : {}),
    };

    // Sanitize custom_data for server (remove any PII that shouldn't be in custom_data)
    const serverCustomData = sanitizeCustomDataForBrowser(normalizedCustomData);

    const { error } = await supabase.functions.invoke('meta-conversions', {
      body: {
        event_name,
        event_id, // Include event_id for deduplication
        user_data: enrichedUserData,
        custom_data: serverCustomData, // Use sanitized version (value + currency garantizados)
        event_source_url: event_source_url || (typeof window !== 'undefined' ? window.location.href : 'https://puntolegal.online'),
        ...(resolvedTestCode ? { test_event_code: resolvedTestCode } : {}),
      },
    });

    if (error) {
      console.warn('[Meta CAPI] Error:', error);
    }
  } catch (e) {
    console.warn('[Meta CAPI] Error:', e);
  }
}
