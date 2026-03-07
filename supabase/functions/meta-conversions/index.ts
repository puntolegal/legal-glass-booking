import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const META_PIXEL_ID = '1101807351995991';
const META_API_VERSION = 'v21.0';
const META_API_URL = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`;

interface EventData {
  event_name: string;
  event_id?: string;  // Event ID for deduplication between Pixel and CAPI
  event_time?: number;
  test_event_code?: string;  // Test event code for Meta testing
  user_data?: {
    em?: string;        // email (will be hashed)
    ph?: string;        // phone (will be hashed)
    fn?: string;        // first name (will be hashed)
    ct?: string;        // city
    ge?: string;        // gender (m/f)
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
  };
  custom_data?: Record<string, unknown>;
  event_source_url?: string;
  action_source?: string;
}

async function hashSHA256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extraer IP y User Agent de los headers automáticamente
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || null;
    const userAgent = req.headers.get('user-agent') || null;

    const accessToken = Deno.env.get('META_CONVERSIONS_API_TOKEN');
    if (!accessToken) {
      throw new Error('META_CONVERSIONS_API_TOKEN not configured');
    }

    const body: EventData = await req.json();
    const { event_name, event_id, user_data, custom_data, event_source_url, test_event_code } = body;

    if (!event_name) {
      return new Response(JSON.stringify({ error: 'event_name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Hash PII fields (emails, phones, names must be hashed)
    // IMPORTANT: Only include non-null, non-empty values to avoid 422 errors
    const hashedUserData: Record<string, string | string[]> = {};
    
    // Email: hash and include only if present
    if (user_data?.em && user_data.em.trim()) {
      hashedUserData.em = [await hashSHA256(user_data.em)];
    }
    
    // Phone: hash only if present and not empty
    if (user_data?.ph && user_data.ph.trim()) {
      hashedUserData.ph = [await hashSHA256(user_data.ph)];
    }
    // Don't include ph if it's null or empty (Meta rejects null arrays)
    
    // First name: hash only if present
    if (user_data?.fn && user_data.fn.trim()) {
      hashedUserData.fn = [await hashSHA256(user_data.fn)];
    }
    
    // City: hash only if present
    if (user_data?.ct && user_data.ct.trim()) {
      hashedUserData.ct = [await hashSHA256(user_data.ct)];
    }
    
    // Gender: hash only if present
    if (user_data?.ge && user_data.ge.trim()) {
      hashedUserData.ge = [await hashSHA256(user_data.ge.toLowerCase())];
    }
    
    // Siempre incluir IP y User Agent (extraídos automáticamente de headers)
    // Esto corrige el error 400 subcode 2804050 de Meta
    // IMPORTANT: These are required fields, so we use fallback values if missing
    hashedUserData.client_ip_address = clientIp || user_data?.client_ip_address || '0.0.0.0';
    hashedUserData.client_user_agent = userAgent || user_data?.client_user_agent || 'Unknown';
    
    // Incluir cookies de Facebook si vienen en el body para mejorar el match
    if (user_data?.fbc && user_data.fbc.trim()) {
      hashedUserData.fbc = user_data.fbc;
    }
    if (user_data?.fbp && user_data.fbp.trim()) {
      hashedUserData.fbp = user_data.fbp;
    }

    // Build event payload following Meta's exact schema
    const eventPayload: {
      data: Array<{
        event_name: string;
        event_id?: string;
        event_time: number;
        action_source: string;
        event_source_url: string;
        user_data: Record<string, string | string[]>;
        custom_data?: Record<string, unknown>;
      }>;
    } = {
      data: [
        {
          event_name,
          ...(event_id ? { event_id } : {}), // Include event_id for deduplication
          event_time: body.event_time || Math.floor(Date.now() / 1000),
          action_source: body.action_source || 'website',
          event_source_url: event_source_url || 'https://puntolegal.cl',
          user_data: hashedUserData,
          // Only include custom_data if it exists and has values
          ...(custom_data && Object.keys(custom_data).length > 0 ? { custom_data } : {}),
        },
      ],
    };

    // Add test_event_code to URL if provided
    const urlParams = new URLSearchParams({ access_token: accessToken });
    if (test_event_code) {
      urlParams.append('test_event_code', test_event_code);
      console.log(`[Meta CAPI] Sending ${event_name} event with test_event_code: ${test_event_code}`);
    } else {
      console.log(`[Meta CAPI] Sending ${event_name} event`);
    }

    const response = await fetch(`${META_API_URL}?${urlParams.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`[Meta CAPI] Error [${response.status}]:`, JSON.stringify(result));
      return new Response(JSON.stringify({ success: false, error: result }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[Meta CAPI] ${event_name} sent successfully:`, JSON.stringify(result));

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Meta CAPI] Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
