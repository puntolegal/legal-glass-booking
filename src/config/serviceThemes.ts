/**
 * serviceThemes.ts
 * Fuente de verdad de paletas cromáticas para el flujo agendamiento + pago.
 *
 * SINCRONIZADO con `internalServices[].accent` en `ServicesSection.tsx`
 * (RGB → degradados hex aquí): CAE wine, Laboral teal, Familia indigo,
 * pizarra slate, tinta blue-900 (ink), slate-700 (depth).
 *
 * `getServiceTheme(plan)` alimenta auroras en AgendamientoLayout, CTAs en
 * Step1, ConversionSidebar y `getServiceColors(..., plan)` para acentos UI.
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
  agendarPlanSlug?: string,
): ServiceTheme => ({
  primary,
  secondary,
  accent,
  glow: `${primary}40`, // 25% alpha
  gradient: `linear-gradient(135deg, ${primary}, ${accent})`,
  icon,
  serviceName,
  serviceSlug,
  ...(agendarPlanSlug !== undefined ? { agendarPlanSlug } : {}),
});

export const serviceThemes: Record<string, ServiceTheme> = {
  // ===== Personas (tarjetas landing — ver ACCENT_* en ServicesSection) =====
  'tutela-laboral': makeTheme(
    '#2dd4bf',
    '#14b8a6',
    '#0f766e',
    Scale,
    'Laboral — Diagnóstico gratis',
    'tutela-laboral',
  ),
  laboral: makeTheme(
    '#2dd4bf',
    '#14b8a6',
    '#0f766e',
    Briefcase,
    'Laboral — Consulta',
    'laboral',
    'tutela-laboral',
  ),
  familia: makeTheme(
    '#818cf8',
    '#a5b4fc',
    '#6366f1',
    Heart,
    'Derecho de Familia',
    'familia',
  ),
  'consulta-estrategica-familia': makeTheme(
    '#818cf8',
    '#a5b4fc',
    '#6366f1',
    Heart,
    'Consulta Estratégica Familia',
    'consulta-estrategica-familia',
  ),
  sucesorio: makeTheme(
    '#94a3b8',
    '#64748b',
    '#475569',
    Stamp,
    'Derecho Sucesorio',
    'sucesorio',
  ),
  /** Landing: misma tinta institucional (blue-900) que Empresarial / Contratos */
  migratorio: makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    Plane,
    'Derecho Migratorio',
    'migratorio',
  ),
  penal: makeTheme(
    '#be123c',
    '#e11d48',
    '#9f1239',
    Gavel,
    'Derecho Penal',
    'penal',
  ),
  'penal-economico': makeTheme(
    '#be123c',
    '#e11d48',
    '#9f1239',
    Gavel,
    'Derecho Penal Económico',
    'penal-economico',
  ),

  // ===== Empresas =====
  empresarial: makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    Building2,
    'Derecho Empresarial',
    'empresarial',
  ),
  corporativo: makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    Building2,
    'Derecho Corporativo',
    'corporativo',
  ),
  tributario: makeTheme(
    '#0891b2',
    '#06b6d4',
    '#0e7490',
    Calculator,
    'Derecho Tributario',
    'tributario',
  ),
  contratos: makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    FileSignature,
    'Contratos',
    'contratos',
  ),
  comparendos: makeTheme(
    '#94a3b8',
    '#64748b',
    '#475569',
    Gavel,
    'Comparendos DT',
    'comparendos',
  ),
  'fiscalizaciones-dt': makeTheme(
    '#94a3b8',
    '#64748b',
    '#475569',
    ShieldAlert,
    'Fiscalizaciones DT',
    'fiscalizaciones-dt',
  ),
  'defensa-laboral-empresarial': makeTheme(
    '#64748b',
    '#475569',
    '#334155',
    Briefcase,
    'Defensa Laboral Empresarial',
    'defensa-laboral-empresarial',
  ),
  'ley-karin': makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    ShieldCheck,
    'Ley Karin',
    'ley-karin',
  ),
  /** Misma familia cromática que la tarjeta Laboral del landing */
  'defensa-karin-trabajador': makeTheme(
    '#2dd4bf',
    '#14b8a6',
    '#0f766e',
    ShieldCheck,
    'Defensa Ley Karin (trabajador)',
    'defensa-karin-trabajador',
  ),
  'comparendo-rm': makeTheme(
    '#2dd4bf',
    '#14b8a6',
    '#0f766e',
    Gavel,
    'Comparendo DT RM',
    'comparendo-rm',
  ),
  cumplimiento: makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    ShieldCheck,
    'Cumplimiento',
    'cumplimiento',
  ),
  compliance: makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    ShieldCheck,
    'Cumplimiento',
    'compliance',
  ),
  marcas: makeTheme(
    '#94a3b8',
    '#64748b',
    '#475569',
    Award,
    'Marcas — INAPI',
    'marcas',
  ),
  'propiedad-intelectual': makeTheme(
    '#94a3b8',
    '#64748b',
    '#475569',
    Award,
    'Propiedad Intelectual',
    'propiedad-intelectual',
  ),

  // ===== Patrimonio =====
  /** Landing: ACCENT_SLATE — mismo tono que Sucesorio / Marcas */
  inmobiliario: makeTheme(
    '#94a3b8',
    '#64748b',
    '#475569',
    Landmark,
    'Derecho Inmobiliario',
    'inmobiliario',
  ),
  'inmobiliario-eval': makeTheme(
    '#34d399',
    '#10b981',
    '#047857',
    Landmark,
    'Evaluación inmobiliaria',
    'inmobiliario-eval',
  ),
  cobranza: makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    Banknote,
    'Cobranza',
    'cobranza',
  ),
  /** Landing: ACCENT_WINE rgb(127,29,29) — ancla red-900 */
  'cae-tesoreria': makeTheme(
    '#dc2626',
    '#b91c1c',
    '#7f1d1d',
    Receipt,
    'Defensa CAE — TGR',
    'cae-tesoreria',
  ),

  // ===== Empresariales de alto ticket =====
  'constitucion-empresarial': makeTheme(
    '#64748b',
    '#475569',
    '#334155',
    Building2,
    'Constitución Empresarial',
    'constitucion-empresarial',
  ),
  reestructuracion: makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    Landmark,
    'Reestructuración Societaria',
    'reestructuracion',
  ),
  'holding-patrimonial': makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    Landmark,
    'Holding Patrimonial',
    'holding-patrimonial',
  ),
  'gestion-patrimonial': makeTheme(
    '#64748b',
    '#475569',
    '#334155',
    Briefcase,
    'Gestión Patrimonial',
    'gestion-patrimonial',
  ),
  'despido-empresa': makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    Briefcase,
    'Despido Empresarial',
    'despido-empresa',
  ),

  // ===== Penal económico (Ley 21.595) =====
  'delitos-economicos': makeTheme(
    '#991b1b',
    '#b91c1c',
    '#7f1d1d',
    Briefcase,
    'Delitos Económicos',
    'delitos-economicos',
  ),

  // ===== Otros / legacy =====
  civil: makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    Scale,
    'Derecho Civil',
    'civil',
  ),
  'administracion-publica': makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    HomeIcon,
    'Derecho Administrativo',
    'administracion-publica',
  ),
  consumidor: makeTheme(
    '#3b82f6',
    '#2563eb',
    '#1e3a8a',
    Globe,
    'Derecho del Consumidor',
    'consumidor',
  ),
  digital: makeTheme(
    '#8b5cf6',
    '#a78bfa',
    '#7c3aed',
    Globe,
    'Derecho Digital',
    'digital',
  ),

  // ===== General / Marca =====
  /** Plan de prueba / lead */
  gratis: makeTheme(
    '#22d3ee',
    '#67e8f9',
    '#0891b2',
    BarChart3,
    'Consulta gratis (prueba)',
    'gratis',
  ),
  general: makeTheme(
    '#22d3ee',
    '#67e8f9',
    '#0891b2',
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
