/**
 * Meta Pixel (browser) — ID compartido con CAPI en supabase/functions/meta-conversions.
 * Override opcional: VITE_META_PIXEL_ID en .env.local
 */
export const META_PIXEL_ID =
  (typeof import.meta.env.VITE_META_PIXEL_ID === 'string' &&
    import.meta.env.VITE_META_PIXEL_ID.trim()) ||
  '1101807351995991';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/** PageView vía Pixel (navegación SPA). El primer load lo dispara index.html. */
export function trackMetaPageView(): void {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  } catch (e) {
    console.warn('[Meta Pixel] PageView error:', e);
  }
}
