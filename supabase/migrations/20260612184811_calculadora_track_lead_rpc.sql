-- RPC para el tracking del embudo de la calculadora de pensión de alimentos.
--
-- Contexto: el 2026-05-10 se eliminaron las políticas UPDATE/SELECT de anon en
-- leads_quiz por seguridad, lo que rompió las transiciones de estado del embudo
-- (calculo_completado, checkout_iniciado, en_pago, pago_completado) que la
-- calculadora hacía con UPDATE directo desde el frontend.
--
-- Esta función SECURITY DEFINER permite SOLO esas transiciones, acotadas a
-- leads de la calculadora (quiz_answers->>'source' = 'calculadora_pension')
-- creados en los últimos 30 días, sin reabrir UPDATE general para anon.

create or replace function public.calculadora_track_lead(
  p_email text,
  p_status text,
  p_name text default null,
  p_quiz_answers jsonb default null,
  p_income_value integer default null,
  p_children_count integer default null,
  p_calculated_min text default null,
  p_calculated_max text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated integer;
begin
  if p_status not in (
    'calculadora_iniciada',
    'calculo_completado',
    'checkout_iniciado',
    'en_pago',
    'pago_completado'
  ) then
    raise exception 'Estado % no permitido en calculadora_track_lead', p_status;
  end if;

  if p_email is null or btrim(p_email) = '' then
    raise exception 'Email requerido';
  end if;

  update public.leads_quiz
     set status         = p_status,
         name           = coalesce(p_name, name),
         quiz_answers   = coalesce(p_quiz_answers, quiz_answers),
         income_value   = coalesce(p_income_value, income_value),
         children_count = coalesce(p_children_count, children_count),
         calculated_min = coalesce(p_calculated_min, calculated_min),
         calculated_max = coalesce(p_calculated_max, calculated_max),
         updated_at     = now()
   where email = p_email
     and quiz_answers->>'source' = 'calculadora_pension'
     and created_at > now() - interval '30 days'
     -- No degradar un lead que ya pagó
     and (status is distinct from 'pago_completado' or p_status = 'pago_completado');

  get diagnostics v_updated = row_count;

  -- Si el lead aún no existe (p. ej. el insert inicial falló), lo creamos
  if v_updated = 0 then
    insert into public.leads_quiz (
      email, name, quiz_answers, status,
      income_value, children_count, calculated_min, calculated_max
    )
    values (
      p_email,
      coalesce(p_name, 'Cliente'),
      coalesce(p_quiz_answers, jsonb_build_object('source', 'calculadora_pension')),
      p_status,
      p_income_value,
      p_children_count,
      p_calculated_min,
      p_calculated_max
    );
  end if;
end;
$$;

revoke all on function public.calculadora_track_lead(text, text, text, jsonb, integer, integer, text, text) from public;
grant execute on function public.calculadora_track_lead(text, text, text, jsonb, integer, integer, text, text) to anon, authenticated, service_role;
