import { supabase } from '@/integrations/supabase/client';
import type { FormData } from '@/types/agendamiento';

export interface SaveAgendamientoIntakeParams {
  form: FormData;
  planSlug: string;
  serviceName: string;
  category: string;
  precioIndicativo: string;
}

/**
 * Persiste los datos del paso 1 del agendamiento en Supabase.
 * Falla en silencio respecto al flujo UX: el usuario sigue aunque falle el guardado.
 */
function newIntakeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function saveAgendamientoIntake(
  params: SaveAgendamientoIntakeParams,
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { form, planSlug, serviceName, category, precioIndicativo } = params;
    const id = newIntakeId();

    const row = {
      id,
      nombre: form.nombre.trim(),
      email: form.email.trim().toLowerCase(),
      telefono: form.telefono.trim(),
      rut: form.rut?.trim() || null,
      empresa: form.empresa?.trim() || null,
      codigo_convenio: form.codigoConvenio?.trim() || null,
      descripcion: form.descripcion?.trim() || null,
      servicio_slug: planSlug || null,
      servicio_nombre: serviceName,
      categoria: category || null,
      precio_indicativo: precioIndicativo || null,
      source_url:
        typeof window !== 'undefined' ? window.location.href.slice(0, 2048) : null,
      user_agent:
        typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 512) : null,
    };

    // Sin .select(): la política RLS no permite leer filas a usuarios anónimos.
    const { error } = await supabase.from('agendamiento_intakes').insert(row);

    if (error) {
      console.warn('[agendamientoIntake] Error al guardar:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error desconocido';
    console.warn('[agendamientoIntake] Excepción:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Persiste fecha, hora y modalidad en el lead tras el paso 2 (antes de pago / reserva).
 * RPC SECURITY DEFINER en Supabase (save_intake_schedule).
 */
export async function saveIntakeSchedule(params: {
  intakeId: string;
  fecha: string;
  hora: string;
  tipoReunion: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc('save_intake_schedule', {
      p_intake_id: params.intakeId,
      p_fecha: params.fecha.trim(),
      p_hora: params.hora.trim(),
      p_tipo_reunion: params.tipoReunion.trim(),
    });
    if (error) {
      console.warn('[saveIntakeSchedule]', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error desconocido';
    console.warn('[saveIntakeSchedule] excepción:', msg);
    return { success: false, error: msg };
  }
}
