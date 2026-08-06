-- ============================================================================
-- FinTrack — Funciones de resumen para el Dashboard
-- Todas usan `security invoker` (respetan RLS) y filtran explícitamente por
-- auth.uid() como refuerzo adicional.
-- ============================================================================

-- Saldo acumulado histórico: ingresos - gastos (las transferencias no afectan
-- el saldo total, ya que se asume que ocurren entre cuentas propias).
create or replace function public.obtener_saldo_actual()
returns numeric
language sql
stable
security invoker
as $$
  select coalesce(
    sum(case when tipo = 'ingreso' then monto else -monto end),
    0
  )
  from public.movimientos
  where usuario_id = auth.uid()
    and tipo in ('ingreso', 'gasto');
$$;

grant execute on function public.obtener_saldo_actual() to authenticated;

-- Ingresos y gastos totales entre dos fechas (usado para "este mes" y
-- "mes anterior").
create or replace function public.obtener_resumen_periodo(p_desde date, p_hasta date)
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
    and fecha between p_desde and p_hasta;
$$;

grant execute on function public.obtener_resumen_periodo(date, date) to authenticated;

-- Gastos agrupados por categoría entre dos fechas (para el gráfico circular).
create or replace function public.obtener_gastos_por_categoria(p_desde date, p_hasta date)
returns table (
  categoria_id uuid,
  categoria_nombre text,
  color text,
  icono text,
  total numeric
)
language sql
stable
security invoker
as $$
  select c.id, c.nombre, c.color, c.icono, sum(m.monto) as total
  from public.movimientos m
  join public.categorias c on c.id = m.categoria_id
  where m.usuario_id = auth.uid()
    and m.tipo = 'gasto'
    and m.fecha between p_desde and p_hasta
  group by c.id, c.nombre, c.color, c.icono
  order by total desc;
$$;

grant execute on function public.obtener_gastos_por_categoria(date, date) to authenticated;

-- Ingresos y gastos mes a mes de los últimos N meses (para el gráfico de
-- barras), incluyendo meses sin movimientos (quedan en 0).
create or replace function public.obtener_resumen_mensual(p_meses int default 6)
returns table (anio int, mes int, ingresos numeric, gastos numeric)
language sql
stable
security invoker
as $$
  select
    extract(year from d)::int as anio,
    extract(month from d)::int as mes,
    coalesce(sum(m.monto) filter (
      where m.tipo = 'ingreso' and date_trunc('month', m.fecha) = d
    ), 0) as ingresos,
    coalesce(sum(m.monto) filter (
      where m.tipo = 'gasto' and date_trunc('month', m.fecha) = d
    ), 0) as gastos
  from generate_series(
    date_trunc('month', current_date) - ((greatest(p_meses, 1) - 1) || ' months')::interval,
    date_trunc('month', current_date),
    '1 month'::interval
  ) as d
  left join public.movimientos m
    on m.usuario_id = auth.uid()
    and date_trunc('month', m.fecha) = d
  group by d
  order by d;
$$;

grant execute on function public.obtener_resumen_mensual(int) to authenticated;
