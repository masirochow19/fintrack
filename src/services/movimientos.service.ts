import { supabase } from "@/services/supabase";
import type { MovimientoConRelaciones } from "@/types/finance";
import type { TipoMovimiento } from "@/types/database.types";
import { rangoDelMes } from "@/utils/date";

interface MovimientoRawRow {
  id: string;
  tipo: MovimientoConRelaciones["tipo"];
  monto: number;
  descripcion: string | null;
  fecha: string;
  notas: string | null;
  categorias: { id: string; nombre: string; color: string; icono: string } | null;
  metodos_pago: { id: string; nombre: string } | null;
}

function mapearMovimiento(fila: MovimientoRawRow): MovimientoConRelaciones {
  return {
    id: fila.id,
    tipo: fila.tipo,
    monto: fila.monto,
    descripcion: fila.descripcion,
    fecha: fila.fecha,
    notas: fila.notas,
    categoria: fila.categorias,
    metodo_pago: fila.metodos_pago,
  };
}

export async function getMovimientosDelMes(
  anio: number,
  mes: number,
): Promise<MovimientoConRelaciones[]> {
  const { desde, hasta } = rangoDelMes(anio, mes);
  const { data, error } = await supabase
    .from("movimientos")
    .select(
      "id, tipo, monto, descripcion, fecha, notas, categorias(id, nombre, color, icono), metodos_pago(id, nombre)",
    )
    .gte("fecha", desde)
    .lte("fecha", hasta)
    .order("fecha", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as unknown as MovimientoRawRow[]).map(mapearMovimiento);
}

export async function getUltimosMovimientos(
  limite = 5,
): Promise<MovimientoConRelaciones[]> {
  const { data, error } = await supabase
    .from("movimientos")
    .select(
      "id, tipo, monto, descripcion, fecha, notas, categorias(id, nombre, color, icono), metodos_pago(id, nombre)",
    )
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limite);

  if (error) throw error;
  return ((data ?? []) as unknown as MovimientoRawRow[]).map(mapearMovimiento);
}

export interface CrearMovimientoInput {
  tipo: TipoMovimiento;
  monto: number;
  categoria_id: string | null;
  metodo_pago_id: string | null;
  descripcion: string | null;
  fecha: string;
  notas: string | null;
}

export async function crearMovimiento(input: CrearMovimientoInput): Promise<{ id: string }> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const usuarioId = userData.user?.id;
  if (!usuarioId) throw new Error("No hay una sesión activa.");

  const { data, error } = await supabase
    .from("movimientos")
    .insert({ ...input, usuario_id: usuarioId })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

/** Trae el gasto de mayor o menor monto dentro de un rango de fechas. */
export async function obtenerGastoExtremo(
  desde: string,
  hasta: string,
  orden: "mayor" | "menor",
): Promise<MovimientoConRelaciones | null> {
  const { data, error } = await supabase
    .from("movimientos")
    .select(
      "id, tipo, monto, descripcion, fecha, notas, categorias(id, nombre, color, icono), metodos_pago(id, nombre)",
    )
    .eq("tipo", "gasto")
    .gte("fecha", desde)
    .lte("fecha", hasta)
    .order("monto", { ascending: orden === "menor" })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? mapearMovimiento(data as unknown as MovimientoRawRow) : null;
}
export async function subirAdjunto(movimientoId: string, archivo: File): Promise<void> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const usuarioId = userData.user?.id;
  if (!usuarioId) throw new Error("No hay una sesión activa.");

  const extension = archivo.name.split(".").pop() ?? "jpg";
  const rutaStorage = `${usuarioId}/${movimientoId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("adjuntos")
    .upload(rutaStorage, archivo, { contentType: archivo.type });
  if (uploadError) throw uploadError;

  const { error: insertError } = await supabase.from("adjuntos").insert({
    movimiento_id: movimientoId,
    usuario_id: usuarioId,
    storage_path: rutaStorage,
    tipo_mime: archivo.type,
    tamanio_bytes: archivo.size,
  });
  if (insertError) throw insertError;
}
