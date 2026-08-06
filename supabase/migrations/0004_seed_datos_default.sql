-- ============================================================================
-- FinTrack — Datos por defecto para nuevos usuarios
-- ============================================================================

-- metodos_pago no tenía una restricción única; la agregamos para poder usar
-- ON CONFLICT al sembrar los datos por defecto.
alter table public.metodos_pago
  add constraint metodos_pago_usuario_nombre_key unique (usuario_id, nombre);

create or replace function public.seed_datos_predeterminados(p_usuario_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.categorias (usuario_id, nombre, tipo, color, icono)
  values
    (p_usuario_id, 'Alimentación',      'gasto',    '#FF9F0A', 'utensils-crossed'),
    (p_usuario_id, 'Transporte',        'gasto',    '#0A84FF', 'car'),
    (p_usuario_id, 'Vivienda',          'gasto',    '#BF5AF2', 'home'),
    (p_usuario_id, 'Entretenimiento',   'gasto',    '#FF375F', 'film'),
    (p_usuario_id, 'Salud',             'gasto',    '#30D158', 'heart-pulse'),
    (p_usuario_id, 'Compras',           'gasto',    '#64D2FF', 'shopping-bag'),
    (p_usuario_id, 'Otros gastos',      'gasto',    '#8E8E93', 'more-horizontal'),
    (p_usuario_id, 'Sueldo',            'ingreso',  '#30D158', 'wallet'),
    (p_usuario_id, 'Otros ingresos',    'ingreso',  '#64D2FF', 'plus-circle')
  on conflict (usuario_id, nombre, tipo) do nothing;

  insert into public.metodos_pago (usuario_id, nombre, tipo, icono, color)
  values
    (p_usuario_id, 'Efectivo',         'efectivo', 'banknote',    '#30D158'),
    (p_usuario_id, 'Tarjeta débito',   'debito',   'credit-card', '#0A84FF')
  on conflict (usuario_id, nombre) do nothing;
end;
$$;

-- Se extiende el trigger de creación de usuario para que también siembre
-- las categorías y métodos de pago por defecto.
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

  perform public.seed_datos_predeterminados(new.id);

  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- Para tu cuenta de prueba ya existente (creada antes de esta migración),
-- el trigger no se disparó retroactivamente. Sémbrala manualmente corriendo
-- esto una vez en el SQL Editor, reemplazando el correo por el tuyo:
--
--   select public.seed_datos_predeterminados(id)
--   from auth.users
--   where email = 'tu-correo@ejemplo.com';
-- ----------------------------------------------------------------------------
