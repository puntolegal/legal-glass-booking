import { supabase } from '@/integrations/supabase/client';

const SESSION_STORAGE_KEY = 'urgencia_penal_session_id';

export function getUrgenciaPenalSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
}

export type UrgenciaPenalMergeRow = {
  email: string;
  nombre?: string | null;
  telefono?: string | null;
  rut_detenido?: string | null;
  situacion?: string | null;
  unidad_policial?: string | null;
  geoloc_status?: string | null;
  tiene_antecedentes?: boolean | null;
  gravedad_lesiones?: number | null;
  horas_detenido?: number | null;
  is_complejo?: boolean | null;
  precio_clp?: number | null;
  lead_score?: string | null;
  paso?: string | null;
  riesgo_porcentaje?: number | null;
  user_agent?: string | null;
  mercado_pago_iniciado?: boolean | null;
  extra?: Record<string, unknown> | null;
};

/**
 * Upsert en public.urgencias_penal por session_id (sessionStorage).
 * Requiere migración merge_urgencia_penal en Supabase.
 */
export async function mergeUrgenciaPenalRow(row: UrgenciaPenalMergeRow): Promise<{ error: string | null }> {
  const sessionId = getUrgenciaPenalSessionId();
  if (!sessionId) return { error: 'Sin session_id' };

  const payload: Record<string, unknown> = {
    email: row.email.trim(),
    nombre: row.nombre ?? null,
    telefono: row.telefono ?? null,
    rut_detenido: row.rut_detenido ?? null,
    situacion: row.situacion ?? null,
    unidad_policial: row.unidad_policial ?? null,
    geoloc_status: row.geoloc_status ?? null,
    tiene_antecedentes: row.tiene_antecedentes ?? null,
    gravedad_lesiones: row.gravedad_lesiones ?? null,
    horas_detenido: row.horas_detenido ?? null,
    is_complejo: row.is_complejo ?? null,
    precio_clp: row.precio_clp ?? null,
    lead_score: row.lead_score ?? null,
    paso: row.paso ?? 'cualificacion',
    riesgo_porcentaje: row.riesgo_porcentaje ?? null,
    user_agent: row.user_agent ?? null,
    mercado_pago_iniciado: row.mercado_pago_iniciado ?? false,
    extra: row.extra ?? {},
  };

  const { error } = await supabase.rpc('merge_urgencia_penal', {
    p_session_id: sessionId,
    p_row: payload,
  });

  if (error) {
    console.warn('merge_urgencia_penal:', error.message);
    return { error: error.message };
  }
  return { error: null };
}
