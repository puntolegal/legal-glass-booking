// RUTA: src/lib/scroll.ts
//
// Helper de scroll resiliente para el landing.
//
// Resuelve dos problemas reales detectados en el landing:
//
// 1) IDs DUPLICADOS — Index.tsx renderiza {landingSections} dos veces
//    (container hidden lg:block + container lg:hidden). Ambas copias
//    contienen secciones con el mismo id (#servicios, #como-funciona, #faq).
//    document.getElementById() devuelve siempre la primera coincidencia,
//    que en móvil está oculta con display:none → scrollIntoView no produce
//    scroll visible. Solución: getBoundingClientRect retorna {0,0} para
//    elementos display:none, así que filtramos por dimensiones > 0.
//
// 2) scrollIntoView en iOS Safari — dentro de ancestros con transform,
//    overflow:hidden o framer-motion activo puede fallar. Además ignora
//    headers fijos. Solución: calculamos la posición absoluta con
//    getBoundingClientRect + window.pageYOffset y scrolleamos `window`
//    directamente, aplicando un HEADER_OFFSET para dar aire visual.
//
// 3) TIMING — secciones lazy o animándose por framer-motion pueden no
//    estar aún en su posición final. Solución: doble rAF + retry hasta
//    3 veces con delay progresivo.

/** Offset para respirar visualmente el target y compensar headers fijos. */
const HEADER_OFFSET = 72;

const escapeId = (id: string): string => {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(id);
  }
  return id.replace(/[^\w-]/g, "\\$&");
};

/** Encuentra el primer elemento visible (realmente renderizado) que matchee el id. */
function findVisibleById(id: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(`#${escapeId(id)}`),
  );
  if (candidates.length === 0) return null;
  const visible = candidates.find((el) => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  return visible ?? null;
}

/**
 * Hace scroll suave al primer elemento VISIBLE con el id dado.
 * Reintenta hasta 3 veces si aún no está montado.
 *
 * @returns true si logró ejecutar el scroll.
 */
export function scrollToVisibleAnchor(id: string, attempt = 0): boolean {
  if (typeof window === "undefined") return false;

  const target = findVisibleById(id);
  if (!target) {
    // Reintento progresivo — puede que la sección aún no esté en viewport
    // o framer-motion todavía esté animando su montaje.
    if (attempt < 3) {
      window.setTimeout(() => scrollToVisibleAnchor(id, attempt + 1), 120);
      return true;
    }
    return false;
  }

  const rect = target.getBoundingClientRect();
  const targetY = rect.top + window.pageYOffset - HEADER_OFFSET;

  // Doble rAF: primer frame alinea layout, segundo dispara el scroll ya
  // con dimensiones estables (crítico en iOS Safari con animaciones vivas).
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    });
  });
  return true;
}
