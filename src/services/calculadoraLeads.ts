import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export type CalculadoraLeadStatus =
  | 'calculadora_iniciada'
  | 'calculo_completado'
  | 'checkout_iniciado'
  | 'en_pago'
  | 'pago_completado';

/**
 * Registra una transición de estado del embudo de la calculadora de pensión.
 *
 * Usa la RPC `calculadora_track_lead` (SECURITY DEFINER) porque anon no tiene
 * política UPDATE sobre leads_quiz; la función hace upsert acotado a leads con
 * source 'calculadora_pension'.
 */
export async function trackCalculadoraLead(params: {
  email: string;
  status: CalculadoraLeadStatus;
  name?: string;
  quizAnswers?: Record<string, unknown>;
  incomeValue?: number | null;
  childrenCount?: number | null;
  calculatedMin?: string | null;
  calculatedMax?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc('calculadora_track_lead', {
      p_email: params.email,
      p_status: params.status,
      p_name: params.name ?? null,
      p_quiz_answers: (params.quizAnswers ?? null) as Json,
      p_income_value: params.incomeValue ?? null,
      p_children_count: params.childrenCount ?? null,
      p_calculated_min: params.calculatedMin ?? null,
      p_calculated_max: params.calculatedMax ?? null,
    });

    if (error) {
      console.warn('⚠️ calculadora_track_lead:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('⚠️ calculadora_track_lead excepción:', message);
    return { success: false, error: message };
  }
}
