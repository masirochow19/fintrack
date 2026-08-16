-- ============================================================================
-- FinTrack — Registro diario de pago (días pagados / no pagados)
-- Pensado para trabajo independiente (ej. reparto), donde cada día puede o
-- no traer un pago. Al marcar un día como pagado se pide el monto y se crea
-- un movimiento de ingreso vinculado; al marcar "no pagado" solo queda el
-- registro, sin movimiento asociado.
-- ============================================================================

create table public.registro_pago_diario (
  id            uuid primary key default gen_random_uuid(),
  usuario_id    uuid not null references public.usuarios (id) on delete cascade,
  fecha         date not null,
  pagado        boolean not null,
  movimiento_id uuid references public.movimientos (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  unique (usuario_id, fecha)
);

create index idx_registro_pago_diario_usuario_fecha
  on public.registro_pago_diario (usuario_id, fecha);

create trigger trg_registro_pago_diario_updated_at
  before update on public.registro_pago_diario
  for each row execute function public.set_updated_at();

alter table public.registro_pago_diario enable row level security;

create policy "registro_pago_diario_select_propio"
  on public.registro_pago_diario for select
  using (auth.uid() = usuario_id);

create policy "registro_pago_diario_insert_propio"
  on public.registro_pago_diario for insert
  with check (auth.uid() = usuario_id);

create policy "registro_pago_diario_update_propio"
  on public.registro_pago_diario for update
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "registro_pago_diario_delete_propio"
  on public.registro_pago_diario for delete
  using (auth.uid() = usuario_id);
