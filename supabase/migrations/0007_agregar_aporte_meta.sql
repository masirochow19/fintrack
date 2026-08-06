-- ============================================================================
-- FinTrack — Aportes a metas de ahorro
-- ============================================================================

create or replace function public.agregar_aporte_meta(p_meta_id uuid, p_monto numeric)
returns public.metas
language plpgsql
security invoker
as $$
declare
  v_meta public.metas;
begin
  if p_monto <= 0 then
    raise exception 'El aporte debe ser mayor a 0';
  end if;

  update public.metas
  set monto_actual = monto_actual + p_monto,
      completada = (monto_actual + p_monto) >= monto_objetivo
  where id = p_meta_id
    and usuario_id = auth.uid()
  returning * into v_meta;

  if v_meta.id is null then
    raise exception 'Meta no encontrada';
  end if;

  return v_meta;
end;
$$;

grant execute on function public.agregar_aporte_meta(uuid, numeric) to authenticated;
