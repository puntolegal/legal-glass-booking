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
  custom_data?: Record<string, unknown>;
  event_source_url?: string;
}

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

/**
 * Send a server-side event to Meta Conversions API via edge function.
 * Also fires the browser-side fbq pixel event for deduplication.
 */
export async function trackMetaEvent(options: MetaEventOptions): Promise<void> {
  const { event_name, user_data, custom_data, event_source_url } = options;

  // Browser-side pixel (client)
  try {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', event_name, custom_data || {});
    }
  } catch (e) {
    console.warn('[Meta Pixel] Client-side error:', e);
  }

  // Server-side CAPI
  try {
    const enrichedUserData: MetaEventUserData = {
      ...user_data,
      client_user_agent: navigator.userAgent,
      fbc: getCookie('_fbc'),
      fbp: getCookie('_fbp'),
    };

    const { error } = await supabase.functions.invoke('meta-conversions', {
      body: {
        event_name,
        user_data: enrichedUserData,
        custom_data,
        event_source_url: event_source_url || window.location.href,
      },
    });

    if (error) {
      console.warn('[Meta CAPI] Error:', error);
    }
  } catch (e) {
    console.warn('[Meta CAPI] Error:', e);
  }
}
