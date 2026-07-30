import { serviceCatalog } from '@/constants/services';
import { trackMetaEvent } from '@/services/metaConversionsService';

/** Extrae slug de plan desde rutas tipo `/agendamiento?plan=tutela-laboral`. */
export function parsePlanSlugFromAgendamientoPath(path: string): string | null {
  const match = path.match(/[?&]plan=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function planValueClp(planSlug: string): number {
  const raw = serviceCatalog[planSlug]?.price;
  if (!raw) return 0;
  const digits = raw.replace(/\D/g, '');
  if (!digits.length) return 0;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/** InitiateCheckout al hacer clic en CTA de agendamiento desde /servicios/laboral. */
export function trackLaboralInitiateCheckout(planSlug: string): void {
  const catalog = serviceCatalog[planSlug];
  void trackMetaEvent({
    event_name: 'InitiateCheckout',
    custom_data: {
      content_type: 'service_plan',
      content_ids: [planSlug],
      content_name: catalog?.name ?? planSlug,
      content_category: 'Derecho Laboral',
      value: planValueClp(planSlug),
      currency: 'CLP',
      source: 'servicios_laboral',
    },
  });
}
