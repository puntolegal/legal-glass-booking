/**
 * serviceThemes.ts
 * Fuente de verdad de paletas cromáticas para el flujo agendamiento + pago.
 *
 * SINCRONIZADO con `internalServices` en `ServicesSection.tsx`:
 * el accent de cada plan en la tarjeta del landing es exactamente
 * el mismo color que aparece en el header del agendamiento, en los
 * pills "Plan PDF", en el badge de descuento y en el ConversionSidebar.
 *
 * Paleta sobria y masculina — sin tonos fluorescentes (rosados,
 * naranjas saturados o rojos brillantes) que rompían la consistencia
 * con la estética dark-navy + glassmorphism iOS del landing.
 */

import {
  Award,
  Banknote,
  BarChart3,
  Briefcase,
  Building2,
  Calculator,
  FileSignature,
  Gavel,
  Globe,
  Heart,
  Home as HomeIcon,
  Landmark,
  Plane,
  Receipt,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Stamp,
} from 'lucide-react';
import { ServiceTheme } from '../components/HeaderService';

/**
 * Builder utilitario — genera un theme consistente a partir de un
 * solo color base (HEX). Garantiza glow y gradient coherentes.
 */
const makeTheme = (
  primary: string,
  secondary: string,
  accent: string,
  icon: ServiceTheme['icon'],
  serviceName: string,
  serviceSlug: string,
): ServiceTheme => ({
  primary,
  secondary,
  accent,
  glow: `${primary}40`, // 25% alpha
  gradient: `linear-gradient(135deg, ${primary}, ${accent})`,
  icon,
  serviceName,
  serviceSlug,
});

export const serviceThemes: Record<string, ServiceTheme> = {
  // ===== Personas =====
  'tutela-laboral': makeTheme(
    '#10B981', // emerald-500 — éxito + recuperación
    '#34D399', // emerald-400
    '#059669', // emerald-600
    Scale,
    'Tutela Laboral',
    'tutela-laboral',
  ),
  laboral: makeTheme(
    '#10B981',
    '#34D399',
    '#059669',
    Briefcase,
    'Derecho Laboral',
    'laboral',
  ),
  familia: makeTheme(
    '#818CF8', // indigo-400 — confianza, sin rosado
    '#A5B4FC', // indigo-300
    '#6366F1', // indigo-500
    Heart,
    'Derecho de Familia',
    'familia',
  ),
  'consulta-estrategica-familia': makeTheme(
    '#818CF8',
    '#A5B4FC',
    '#6366F1',
    Heart,
    'Consulta Estratégica Familia',
    'consulta-estrategica-familia',
  ),
  sucesorio: makeTheme(
    '#64748B', // slate-500 — sobriedad institucional
    '#94A3B8', // slate-400
    '#475569', // slate-600
    Stamp,
    'Derecho Sucesorio',
    'sucesorio',
  ),
  migratorio: makeTheme(
    '#06B6D4', // cyan-500
    '#22D3EE', // cyan-400
    '#0891B2', // cyan-600
    Plane,
    'Derecho Migratorio',
    'migratorio',
  ),
  penal: makeTheme(
    '#BE123C', // rose-700 — gravedad judicial (sin rojo neón)
    '#E11D48', // rose-600
    '#9F1239', // rose-800
    Gavel,
    'Derecho Penal',
    'penal',
  ),
  'penal-economico': makeTheme(
    '#BE123C',
    '#E11D48',
    '#9F1239',
    Gavel,
    'Derecho Penal Económico',
    'penal-economico',
  ),

  // ===== Empresas =====
  empresarial: makeTheme(
    '#8B5CF6', // violet-500 — autoridad
    '#A78BFA', // violet-400
    '#7C3AED', // violet-600
    Building2,
    'Derecho Empresarial',
    'empresarial',
  ),
  corporativo: makeTheme(
    '#8B5CF6',
    '#A78BFA',
    '#7C3AED',
    Building2,
    'Derecho Corporativo',
    'corporativo',
  ),
  tributario: makeTheme(
    '#0891B2', // cyan-700 — precisión técnica
    '#06B6D4', // cyan-500
    '#0E7490', // cyan-800
    Calculator,
    'Derecho Tributario',
    'tributario',
  ),
  contratos: makeTheme(
    '#3B82F6', // blue-500 — claridad contractual
    '#60A5FA', // blue-400
    '#2563EB', // blue-600
    FileSignature,
    'Contratos',
    'contratos',
  ),
  comparendos: makeTheme(
    '#A855F7', // purple-500
    '#C084FC', // purple-400
    '#9333EA', // purple-600
    Gavel,
    'Comparendos DT',
    'comparendos',
  ),
  'fiscalizaciones-dt': makeTheme(
    '#7C3AED', // violet-600 (en vez de pink que era fluor)
    '#8B5CF6', // violet-500
    '#6D28D9', // violet-700
    ShieldAlert,
    'Fiscalizaciones DT',
    'fiscalizaciones-dt',
  ),
  'defensa-laboral-empresarial': makeTheme(
    '#4338CA', // indigo-700 — sobriedad corporativa
    '#6366F1', // indigo-500
    '#3730A3', // indigo-800
    Briefcase,
    'Defensa Laboral Empresarial',
    'defensa-laboral-empresarial',
  ),
  'ley-karin': makeTheme(
    '#7C3AED', // violet-600
    '#8B5CF6', // violet-500
    '#6D28D9', // violet-700
    ShieldCheck,
    'Ley Karin',
    'ley-karin',
  ),
  cumplimiento: makeTheme(
    '#9333EA', // purple-600
    '#A855F7', // purple-500
    '#7E22CE', // purple-700
    ShieldCheck,
    'Cumplimiento',
    'cumplimiento',
  ),
  compliance: makeTheme(
    '#9333EA',
    '#A855F7',
    '#7E22CE',
    ShieldCheck,
    'Cumplimiento',
    'compliance',
  ),
  marcas: makeTheme(
    '#0EA5E9', // sky-500 (en vez de pink fluor)
    '#38BDF8', // sky-400
    '#0284C7', // sky-600
    Award,
    'Marcas — INAPI',
    'marcas',
  ),
  'propiedad-intelectual': makeTheme(
    '#0EA5E9',
    '#38BDF8',
    '#0284C7',
    Award,
    'Propiedad Intelectual',
    'propiedad-intelectual',
  ),

  // ===== Patrimonio =====
  inmobiliario: makeTheme(
    '#14B8A6', // teal-500 — patrimonio estable
    '#2DD4BF', // teal-400
    '#0D9488', // teal-600
    Landmark,
    'Derecho Inmobiliario',
    'inmobiliario',
  ),
  cobranza: makeTheme(
    '#22C55E', // green-500
    '#4ADE80', // green-400
    '#16A34A', // green-600
    Banknote,
    'Cobranza',
    'cobranza',
  ),
  'cae-tesoreria': makeTheme(
    '#DC2626', // red-600 — urgencia (más oscuro que red-500, menos fluor)
    '#EF4444', // red-500
    '#B91C1C', // red-700
    Receipt,
    'Defensa CAE — TGR',
    'cae-tesoreria',
  ),

  // ===== Otros / legacy =====
  civil: makeTheme(
    '#0EA5E9', // sky-500
    '#38BDF8', // sky-400
    '#0284C7', // sky-600
    Scale,
    'Derecho Civil',
    'civil',
  ),
  'administracion-publica': makeTheme(
    '#0EA5E9',
    '#38BDF8',
    '#0284C7',
    HomeIcon,
    'Derecho Administrativo',
    'administracion-publica',
  ),
  consumidor: makeTheme(
    '#3B82F6',
    '#60A5FA',
    '#2563EB',
    Globe,
    'Derecho del Consumidor',
    'consumidor',
  ),
  digital: makeTheme(
    '#8B5CF6',
    '#A78BFA',
    '#7C3AED',
    Globe,
    'Derecho Digital',
    'digital',
  ),

  // ===== General / Marca =====
  general: makeTheme(
    '#22D3EE', // cyan-400 — color de marca Punto Legal (sin orange)
    '#67E8F9', // cyan-300
    '#0891B2', // cyan-600
    BarChart3,
    'Punto Legal',
    'general',
  ),
};

/**
 * Lookup robusto de tema. Acepta tanto el slug del plan
 * (ideal: "cae-tesoreria", "ley-karin") como un fallback por categoría
 * (legacy: "Familia", "Laboral Empresarial"). Garantiza siempre un theme.
 *
 * Esta es la API recomendada — los componentes nuevos deberían usarla
 * en lugar del lookup directo `serviceThemes[key]`.
 */
export const getServiceTheme = (
  plan?: string | null,
  fallbackCategory?: string | null,
): ServiceTheme => {
  if (plan) {
    const direct = serviceThemes[plan];
    if (direct) return direct;
  }
  if (fallbackCategory) {
    const slugified = fallbackCategory.toLowerCase().replace(/\s+/g, '-');
    const byCategory = serviceThemes[slugified];
    if (byCategory) return byCategory;
  }
  return serviceThemes.general;
};
