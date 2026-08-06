-- ============================================================================
-- FinTrack — Resumen anual (para la comparación año actual vs año anterior
-- en la pantalla de Estadísticas)
-- ============================================================================

create or replace function public.obtener_resumen_anual(p_anio int)
returns table (ingresos numeric, gastos numeric)
language sql
stable
security invoker
as $$
  select
    coalesce(sum(monto) filter (where tipo = 'ingreso'), 0) as ingresos,
    coalesce(sum(monto) filter (where tipo = 'gasto'), 0) as gastos
  from public.movimientos
  where usuario_id = auth.uid()
    and extract(year from fecha) = p_anio;
$$;

grant execute on function public.obtener_resumen_anual(int) to authenticated;
