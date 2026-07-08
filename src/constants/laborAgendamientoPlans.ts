/** Planes de agendamiento del cluster trabajadores / derecho del trabajo. */
export const LABOR_AGENDAMIENTO_PLAN_SLUGS = [
  'tutela-laboral',
  'laboral',
  'defensa-karin-trabajador',
  'comparendo-rm',
] as const

export type LaborAgendamientoPlanSlug = (typeof LABOR_AGENDAMIENTO_PLAN_SLUGS)[number]

export function isLaborAgendamientoPlan(plan: string | null | undefined): boolean {
  if (!plan) return false
  return (LABOR_AGENDAMIENTO_PLAN_SLUGS as readonly string[]).includes(plan)
}

/** Valor CLP aproximado para InitiateCheckout en pills del cluster laboral. */
export function laborClusterMetaValueClp(plan: string): number {
  if (plan === 'tutela-laboral' || plan === 'laboral') return 0
  if (plan === 'defensa-karin-trabajador') return 79000
  if (plan === 'comparendo-rm') return 35000
  return 0
}
