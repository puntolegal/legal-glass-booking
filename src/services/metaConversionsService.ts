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

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
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
 * Send a server-side event to Meta Conversions API via edge function.
 * Also fires the browser-side fbq pixel event for deduplication.
 * 
 * IMPORTANT: PII (emails, phones) are NEVER sent to browser Pixel.
 * They only go through server-side CAPI where they are properly hashed.
 */
export async function trackMetaEvent(options: MetaEventOptions): Promise<void> {
  const { event_name, user_data, custom_data, event_source_url, test_event_code } = options;

  // Generate event_id for deduplication
  const event_id = generateEventId();

  // Browser-side pixel (client) - ONLY non-PII data
  try {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      // Sanitize custom_data to remove any PII before sending to browser
      const sanitizedCustomData = sanitizeCustomDataForBrowser(custom_data);
      
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
    const serverCustomData = sanitizeCustomDataForBrowser(custom_data);

    const { error } = await supabase.functions.invoke('meta-conversions', {
      body: {
        event_name,
        event_id, // Include event_id for deduplication
        user_data: enrichedUserData,
        custom_data: serverCustomData, // Use sanitized version
        event_source_url: event_source_url || (typeof window !== 'undefined' ? window.location.href : 'https://puntolegal.cl'),
        ...(test_event_code ? { test_event_code } : {}),
      },
    });

    if (error) {
      console.warn('[Meta CAPI] Error:', error);
    }
  } catch (e) {
    console.warn('[Meta CAPI] Error:', e);
  }
}
