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
  event_time?: number;
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
    const accessToken = Deno.env.get('META_CONVERSIONS_API_TOKEN');
    if (!accessToken) {
      throw new Error('META_CONVERSIONS_API_TOKEN not configured');
    }

    const body: EventData = await req.json();
    const { event_name, user_data, custom_data, event_source_url } = body;

    if (!event_name) {
      return new Response(JSON.stringify({ error: 'event_name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Hash PII fields (emails, phones, names must be hashed)
    const hashedUserData: Record<string, string | string[]> = {};
    if (user_data?.em) {
      hashedUserData.em = [await hashSHA256(user_data.em)];
    }
    if (user_data?.ph) {
      // Phone can be null if not provided
      hashedUserData.ph = user_data.ph ? [await hashSHA256(user_data.ph)] : [null as any];
    }
    if (user_data?.fn) {
      hashedUserData.fn = [await hashSHA256(user_data.fn)];
    }
    if (user_data?.ct) {
      hashedUserData.ct = [await hashSHA256(user_data.ct)];
    }
    if (user_data?.ge) {
      hashedUserData.ge = [await hashSHA256(user_data.ge.toLowerCase())];
    }
    if (user_data?.client_ip_address) hashedUserData.client_ip_address = user_data.client_ip_address;
    if (user_data?.client_user_agent) hashedUserData.client_user_agent = user_data.client_user_agent;
    if (user_data?.fbc) hashedUserData.fbc = user_data.fbc;
    if (user_data?.fbp) hashedUserData.fbp = user_data.fbp;

    const eventPayload = {
      data: [
        {
          event_name,
          event_time: body.event_time || Math.floor(Date.now() / 1000),
          action_source: body.action_source || 'website',
          event_source_url: event_source_url || 'https://puntolegal.cl',
          user_data: hashedUserData,
          ...(custom_data ? { custom_data } : {}),
        },
      ],
    };

    console.log(`[Meta CAPI] Sending ${event_name} event`);

    const response = await fetch(`${META_API_URL}?access_token=${accessToken}`, {
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
