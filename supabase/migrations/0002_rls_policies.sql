-- ============================================================================
-- FinTrack — Row Level Security
-- Regla general: cada usuario solo puede ver y modificar sus propios datos.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- usuarios
-- ----------------------------------------------------------------------------
alter table public.usuarios enable row level security;

create policy "usuarios_select_propio"
  on public.usuarios for select
  using (auth.uid() = id);

create policy "usuarios_update_propio"
  on public.usuarios for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No hay policy de insert/delete: la fila se crea vía trigger (security definer)
-- y se elimina en cascada cuando se borra el usuario de auth.users.

-- ----------------------------------------------------------------------------
-- configuracion_usuario
-- ----------------------------------------------------------------------------
alter table public.configuracion_usuario enable row level security;

create policy "configuracion_select_propia"
  on public.configuracion_usuario for select
  using (auth.uid() = usuario_id);

create policy "configuracion_update_propia"
  on public.configuracion_usuario for update
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

-- ----------------------------------------------------------------------------
-- metodos_pago
-- ----------------------------------------------------------------------------
alter table public.metodos_pago enable row level security;

create policy "metodos_pago_select_propio"
  on public.metodos_pago for select
  using (auth.uid() = usuario_id);

create policy "metodos_pago_insert_propio"
  on public.metodos_pago for insert
  with check (auth.uid() = usuario_id);

create policy "metodos_pago_update_propio"
  on public.metodos_pago for update
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "metodos_pago_delete_propio"
  on public.metodos_pago for delete
  using (auth.uid() = usuario_id);

-- ----------------------------------------------------------------------------
-- categorias
-- ----------------------------------------------------------------------------
alter table public.categorias enable row level security;

create policy "categorias_select_propia"
  on public.categorias for select
  using (auth.uid() = usuario_id);

create policy "categorias_insert_propia"
  on public.categorias for insert
  with check (auth.uid() = usuario_id);

create policy "categorias_update_propia"
  on public.categorias for update
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "categorias_delete_propia"
  on public.categorias for delete
  using (auth.uid() = usuario_id);

-- ----------------------------------------------------------------------------
-- movimientos
-- ----------------------------------------------------------------------------
alter table public.movimientos enable row level security;

create policy "movimientos_select_propio"
  on public.movimientos for select
  using (auth.uid() = usuario_id);

create policy "movimientos_insert_propio"
  on public.movimientos for insert
  with check (auth.uid() = usuario_id);

create policy "movimientos_update_propio"
  on public.movimientos for update
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "movimientos_delete_propio"
  on public.movimientos for delete
  using (auth.uid() = usuario_id);

-- ----------------------------------------------------------------------------
-- adjuntos
-- ----------------------------------------------------------------------------
alter table public.adjuntos enable row level security;

create policy "adjuntos_select_propio"
  on public.adjuntos for select
  using (auth.uid() = usuario_id);

create policy "adjuntos_insert_propio"
  on public.adjuntos for insert
  with check (auth.uid() = usuario_id);

create policy "adjuntos_delete_propio"
  on public.adjuntos for delete
  using (auth.uid() = usuario_id);

-- ----------------------------------------------------------------------------
-- presupuestos
-- ----------------------------------------------------------------------------
alter table public.presupuestos enable row level security;

create policy "presupuestos_select_propio"
  on public.presupuestos for select
  using (auth.uid() = usuario_id);

create policy "presupuestos_insert_propio"
  on public.presupuestos for insert
  with check (auth.uid() = usuario_id);

create policy "presupuestos_update_propio"
  on public.presupuestos for update
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "presupuestos_delete_propio"
  on public.presupuestos for delete
  using (auth.uid() = usuario_id);

-- ----------------------------------------------------------------------------
-- metas
-- ----------------------------------------------------------------------------
alter table public.metas enable row level security;

create policy "metas_select_propia"
  on public.metas for select
  using (auth.uid() = usuario_id);

create policy "metas_insert_propia"
  on public.metas for insert
  with check (auth.uid() = usuario_id);

create policy "metas_update_propia"
  on public.metas for update
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "metas_delete_propia"
  on public.metas for delete
  using (auth.uid() = usuario_id);

-- ============================================================================
-- Storage: bucket privado para las fotos de boletas
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('adjuntos', 'adjuntos', false)
on conflict (id) do nothing;

-- Cada usuario solo accede a los archivos dentro de su propia carpeta:
-- adjuntos/<usuario_id>/<archivo>
create policy "adjuntos_storage_select_propio"
  on storage.objects for select
  using (
    bucket_id = 'adjuntos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "adjuntos_storage_insert_propio"
  on storage.objects for insert
  with check (
    bucket_id = 'adjuntos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "adjuntos_storage_delete_propio"
  on storage.objects for delete
  using (
    bucket_id = 'adjuntos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
