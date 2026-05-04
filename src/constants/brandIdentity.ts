/**
 * Identidad pública — misma redacción en FAQ, JSON-LD (AEO) y bloque sr-only del landing.
 * Tono: institucional, acceso a justicia (sin prometer resultados ni nombre personal en UI).
 */

/** Autoría para meta `author`, Open Graph y documentación (marca, no persona). */
export const PUNTO_LEGAL_PUBLIC_AUTHOR = "Punto Legal Chile";

/**
 * @deprecated Usar `PUNTO_LEGAL_PUBLIC_AUTHOR`. Se mantiene el export para imports legados.
 */
export const PUNTO_LEGAL_FOUNDER_NAME = PUNTO_LEGAL_PUBLIC_AUTHOR;

/** Declaración de propósito — SEO, FAQ, JSON-LD (sin fundador nombrado). */
export const PUNTO_LEGAL_INSTITUTIONAL_PURPOSE =
  "Punto Legal es un estudio jurídico chileno en línea con el propósito de acercar la defensa y la orientación jurídica profesional a quienes aún no acceden a ellas con la rapidez y claridad que merecen.";

/**
 * @deprecated Usar `PUNTO_LEGAL_INSTITUTIONAL_PURPOSE`.
 */
export const PUNTO_LEGAL_FOUNDER_STATEMENT = PUNTO_LEGAL_INSTITUTIONAL_PURPOSE;

/** Domicilio comercial (SEO, correos, términos) — consultas 100% online. */
export const PUNTO_LEGAL_DOMICILIO_LINE =
  "Domicilio comercial en barrio El Golf, comuna de Las Condes, Santiago, Chile. Las consultas se realizan de forma 100% online por Google Meet; no hay atención con cita en recepción.";

/** Coordenadas aprox. barrio El Golf, Las Condes (mapa/ICBM, no calle exacta). */
export const PUNTO_LEGAL_ICBM = "-33.4150, -70.6050" as const;
