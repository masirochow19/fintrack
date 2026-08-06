-- ============================================================================
-- FinTrack — Presupuestos con gasto acumulado del mes
-- ============================================================================

create or replace function public.obtener_presupuestos_con_gasto(p_mes int, p_anio int)
returns table (
  id uuid,
  categoria_id uuid,
  categoria_nombre text,
  categoria_color text,
  categoria_icono text,
  monto_limite numeric,
  gastado numeric
)
language sql
stable
security invoker
as $$
  select
    p.id,
    p.categoria_id,
    c.nombre,
    c.color,
    c.icono,
    p.monto_limite,
    coalesce((
      select sum(m.monto)
      from public.movimientos m
      where m.usuario_id = auth.uid()
        and m.tipo = 'gasto'
        and extract(month from m.fecha) = p_mes
        and extract(year from m.fecha) = p_anio
        and (p.categoria_id is null or m.categoria_id = p.categoria_id)
    ), 0) as gastado
  from public.presupuestos p
  left join public.categorias c on c.id = p.categoria_id
  where p.usuario_id = auth.uid()
    and p.mes = p_mes
    and p.anio = p_anio
  order by c.nombre nulls first;
$$;

grant execute on function public.obtener_presupuestos_con_gasto(int, int) to authenticated;
