/**
 * Origen canónico del sitio (apex, sin www).
 * Search Console, sitemap, canonical y back_urls (Mercado Pago) deben alinearse
 * a este host; el hosting debe redirigir 301 de www a apex (o a la inversa si cambian).
 */
export const SITE_ORIGIN = "https://puntolegal.online" as const;

/** Imagen por defecto para Open Graph (misma que en index.html, URL absoluta). */
export const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/2Y5znkCNlYgyX8T3XvhTJiBGlIc2/social-images/social-1759093546885-assets_task_01jzcqyy9mehesneaxw4046ffn_1751700881_img_0.webp" as const;

export function siteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_ORIGIN;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${p}`;
}
