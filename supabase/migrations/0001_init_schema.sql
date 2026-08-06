-- ============================================================================
-- FinTrack — Migración inicial
-- Tablas: usuarios, metodos_pago, categorias, movimientos, adjuntos,
--         presupuestos, metas, configuracion_usuario
-- ============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Función auxiliar: mantiene updated_at al día en cualquier tabla que la use
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- usuarios — perfil de la app, 1:1 con auth.users
-- ============================================================================
create table public.usuarios (
  id          uuid primary key references auth.users (id) on delete cascade,
  nombre      text,
  email       text not null,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_usuarios_updated_at
  before update on public.usuarios
  for each row execute function public.set_updated_at();

-- ============================================================================
-- configuracion_usuario — preferencias de la app (tema, moneda, notificaciones)
-- ============================================================================
create table public.configuracion_usuario (
  usuario_id              uuid primary key references public.usuarios (id) on delete cascade,
  tema                    text not null default 'sistema'
                            check (tema in ('claro', 'oscuro', 'sistema')),
  moneda                  text not null default 'CLP',
  notificaciones_activas  boolean not null default true,
  recordatorios_activos   boolean not null default true,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create trigger trg_configuracion_usuario_updated_at
  before update on public.configuracion_usuario
  for each row execute function public.set_updated_at();

-- ============================================================================
-- metodos_pago — tarjetas, efectivo, cuentas, etc.
-- ============================================================================
create table public.metodos_pago (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references public.usuarios (id) on delete cascade,
  nombre      text not null,
  tipo        text not null default 'otro'
                check (tipo in ('efectivo', 'debito', 'credito', 'transferencia', 'otro')),
  icono       text,
  color       text,
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_metodos_pago_usuario on public.metodos_pago (usuario_id);

create trigger trg_metodos_pago_updated_at
  before update on public.metodos_pago
  for each row execute function public.set_updated_at();

-- ============================================================================
-- categorias — categorías personalizadas de ingreso/gasto
-- ============================================================================
create table public.categorias (
  id              uuid primary key default gen_random_uuid(),
  usuario_id      uuid not null references public.usuarios (id) on delete cascade,
  nombre          text not null,
  tipo            text not null check (tipo in ('ingreso', 'gasto')),
  color           text not null default '#0A84FF',
  icono           text not null default 'circle',
  limite_mensual  numeric(14, 2) check (limite_mensual is null or limite_mensual >= 0),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique (usuario_id, nombre, tipo)
);

create index idx_categorias_usuario on public.categorias (usuario_id);

create trigger trg_categorias_updated_at
  before update on public.categorias
  for each row execute function public.set_updated_at();

-- ============================================================================
-- movimientos — ingresos, gastos y transferencias
-- ============================================================================
create table public.movimientos (
  id              uuid primary key default gen_random_uuid(),
  usuario_id      uuid not null references public.usuarios (id) on delete cascade,
  tipo            text not null check (tipo in ('ingreso', 'gasto', 'transferencia')),
  monto           numeric(14, 2) not null check (monto > 0),
  categoria_id    uuid references public.categorias (id) on delete set null,
  metodo_pago_id  uuid references public.metodos_pago (id) on delete set null,
  descripcion     text,
  fecha           date not null default current_date,
  notas           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_movimientos_usuario on public.movimientos (usuario_id);
create index idx_movimientos_usuario_fecha on public.movimientos (usuario_id, fecha desc);
create index idx_movimientos_categoria on public.movimientos (categoria_id);
create index idx_movimientos_metodo_pago on public.movimientos (metodo_pago_id);

create trigger trg_movimientos_updated_at
  before update on public.movimientos
  for each row execute function public.set_updated_at();

-- ============================================================================
-- adjuntos — fotografías de boletas asociadas a un movimiento
-- (el archivo en sí vive en Supabase Storage; aquí solo la referencia)
-- ============================================================================
create table public.adjuntos (
  id              uuid primary key default gen_random_uuid(),
  movimiento_id   uuid not null references public.movimientos (id) on delete cascade,
  usuario_id      uuid not null references public.usuarios (id) on delete cascade,
  storage_path    text not null,
  tipo_mime       text,
  tamanio_bytes   bigint,
  created_at      timestamptz not null default now()
);

create index idx_adjuntos_movimiento on public.adjuntos (movimiento_id);
create index idx_adjuntos_usuario on public.adjuntos (usuario_id);

-- ============================================================================
-- presupuestos — límite mensual por categoría (o general si categoria_id es null)
-- ============================================================================
create table public.presupuestos (
  id              uuid primary key default gen_random_uuid(),
  usuario_id      uuid not null references public.usuarios (id) on delete cascade,
  categoria_id    uuid references public.categorias (id) on delete cascade,
  monto_limite    numeric(14, 2) not null check (monto_limite > 0),
  mes             smallint not null check (mes between 1 and 12),
  anio            smallint not null check (anio between 2000 and 2100),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique (usuario_id, categoria_id, mes, anio)
);

create index idx_presupuestos_usuario on public.presupuestos (usuario_id);
create index idx_presupuestos_periodo on public.presupuestos (usuario_id, anio, mes);

create trigger trg_presupuestos_updated_at
  before update on public.presupuestos
  for each row execute function public.set_updated_at();

-- ============================================================================
-- metas — metas de ahorro
-- ============================================================================
create table public.metas (
  id              uuid primary key default gen_random_uuid(),
  usuario_id      uuid not null references public.usuarios (id) on delete cascade,
  nombre          text not null,
  monto_objetivo  numeric(14, 2) not null check (monto_objetivo > 0),
  monto_actual    numeric(14, 2) not null default 0 check (monto_actual >= 0),
  fecha_limite    date,
  completada      boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_metas_usuario on public.metas (usuario_id);

create trigger trg_metas_updated_at
  before update on public.metas
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Trigger: al crear un usuario en auth.users, crear su fila en usuarios
-- y su configuracion_usuario por defecto automáticamente.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.usuarios (id, email, nombre)
  values (new.id, new.email, new.raw_user_meta_data ->> 'nombre');

  insert into public.configuracion_usuario (usuario_id)
  values (new.id);

  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
