/**
 * Nombres cortos de servicios mostrados en web y móvil (landing).
 * Mantener alineado con `internalServices[].shortName` en
 * `src/components/ServicesSection.tsx` cuando cambie el catálogo.
 */
export const LANDING_SERVICE_SHORT_NAMES: readonly string[] = [
  "Defensa CAE",
  "Laboral",
  "Familia",
  "Sucesorio",
  "Migratorio",
  "Penal",
  "Delitos Económicos",
  "Empresarial",
  "Constitución Empresarial",
  "Reestructuración",
  "Holding Patrimonial",
  "Gestión Patrimonial",
  "Despido Empresas",
  "Tributario",
  "Contratos",
  "Comparendos DT",
  "Fiscalizaciones DT",
  "Defensa Empresarial",
  "Ley Karin",
  "Defensa Ley Karin (trabajador)",
  "Comparendo DT RM",
  "Cumplimiento",
  "Marcas",
  "Inmobiliario",
  "Cobranza",
];

export function landingServicesLineForWhatsApp(): string {
  return LANDING_SERVICE_SHORT_NAMES.join(", ");
}

/** Solo dígitos; Chile por defecto. */
export function normalizeWhatsappE164(raw: string | undefined | null): string {
  const d = String(raw ?? "").replace(/\D/g, "");
  return d.length > 0 ? d : "56962321883";
}

export function buildBookingWhatsAppPrefillMessage(p: {
  nombre: string;
  servicio: string;
  whenLine: string;
}): string {
  const areas = landingServicesLineForWhatsApp();
  return (
    `Hola Punto Legal, soy ${p.nombre}. Acabo de agendar mi consulta: ${p.servicio}. ` +
      `Vi en su web y app móvil todas sus áreas (Penal, Familia, Laboral, empresas y patrimonio), ` +
      `entre otras: ${areas}. ` +
      `Quedo confirmado/a para: ${p.whenLine}.`
  );
}

export function buildWaMeUrl(e164: string | undefined | null, message: string): string {
  const digits = normalizeWhatsappE164(e164);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
