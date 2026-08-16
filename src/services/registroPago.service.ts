import { supabase } from "@/services/supabase";
import { rangoDelMes } from "@/utils/date";

export interface RegistroPagoDia {
  id: string;
  fecha: string;
  pagado: boolean;
  movimiento_id: string | null;
  monto: number | null;
}

export async function getRegistrosDelMes(
  anio: number,
  mes: number,
): Promise<RegistroPagoDia[]> {
  const { desde, hasta } = rangoDelMes(anio, mes);
  const { data, error } = await supabase
    .from("registro_pago_diario")
    .select("id, fecha, pagado, movimiento_id, movimientos(monto)")
    .gte("fecha", desde)
    .lte("fecha", hasta);

  if (error) throw error;

  return ((data ?? []) as unknown as {
    id: string;
    fecha: string;
    pagado: boolean;
    movimiento_id: string | null;
    movimientos: { monto: number } | null;
  }[]).map((fila) => ({
    id: fila.id,
    fecha: fila.fecha,
    pagado: fila.pagado,
    movimiento_id: fila.movimiento_id,
    monto: fila.movimientos?.monto ?? null,
  }));
}

async function obtenerUsuarioId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const usuarioId = data.user?.id;
  if (!usuarioId) throw new Error("No hay una sesión activa.");
  return usuarioId;
}

async function obtenerRegistroExistente(
  usuarioId: string,
  fecha: string,
): Promise<{ id: string; movimiento_id: string | null } | null> {
  const { data, error } = await supabase
    .from("registro_pago_diario")
    .select("id, movimiento_id")
    .eq("usuario_id", usuarioId)
    .eq("fecha", fecha)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Si el registro de ese día ya tenía un movimiento de ingreso vinculado
 * (de una marca anterior), lo elimina para no dejar ingresos duplicados. */
async function limpiarMovimientoAnterior(movimientoId: string | null) {
  if (!movimientoId) return;
  const { error } = await supabase.from("movimientos").delete().eq("id", movimientoId);
  if (error) throw error;
}

/** Busca la categoría de ingreso "Sueldo" del usuario para asociarla por
 * defecto al ingreso del día pagado (si no existe, queda sin categoría). */
async function buscarCategoriaSueldo(usuarioId: string): Promise<string | null> {
  const { data } = await supabase
    .from("categorias")
    .select("id")
    .eq("usuario_id", usuarioId)
    .eq("tipo", "ingreso")
    .eq("nombre", "Sueldo")
    .maybeSingle();
  return data?.id ?? null;
}

/** Marca un día como pagado: crea (o reemplaza) el movimiento de ingreso por
 * el monto indicado y deja el registro del día vinculado a ese movimiento. */
export async function marcarDiaPagado(fecha: string, monto: number): Promise<void> {
  const usuarioId = await obtenerUsuarioId();
  const existente = await obtenerRegistroExistente(usuarioId, fecha);
  await limpiarMovimientoAnterior(existente?.movimiento_id ?? null);

  const categoriaId = await buscarCategoriaSueldo(usuarioId);

  const { data: movimiento, error: errorMovimiento } = await supabase
    .from("movimientos")
    .insert({
      usuario_id: usuarioId,
      tipo: "ingreso",
      monto,
      categoria_id: categoriaId,
      descripcion: "Día pagado",
      fecha,
    })
    .select("id")
    .single();
  if (errorMovimiento) throw errorMovimiento;

  const { error: errorRegistro } = await supabase.from("registro_pago_diario").upsert(
    {
      usuario_id: usuarioId,
      fecha,
      pagado: true,
      movimiento_id: movimiento.id,
    },
    { onConflict: "usuario_id,fecha" },
  );
  if (errorRegistro) throw errorRegistro;
}

/** Marca un día como no pagado: si tenía un ingreso vinculado de una marca
 * anterior, lo elimina (ya no corresponde), y deja el registro sin monto. */
export async function marcarDiaNoPagado(fecha: string): Promise<void> {
  const usuarioId = await obtenerUsuarioId();
  const existente = await obtenerRegistroExistente(usuarioId, fecha);
  await limpiarMovimientoAnterior(existente?.movimiento_id ?? null);

  const { error } = await supabase.from("registro_pago_diario").upsert(
    { usuario_id: usuarioId, fecha, pagado: false, movimiento_id: null },
    { onConflict: "usuario_id,fecha" },
  );
  if (error) throw error;
}

/** Quita la marca del día por completo (y su ingreso vinculado, si tenía). */
export async function quitarMarcaDelDia(fecha: string): Promise<void> {
  const usuarioId = await obtenerUsuarioId();
  const existente = await obtenerRegistroExistente(usuarioId, fecha);
  if (!existente) return;

  await limpiarMovimientoAnterior(existente.movimiento_id);

  const { error } = await supabase
    .from("registro_pago_diario")
    .delete()
    .eq("id", existente.id);
  if (error) throw error;
}
