import { supabase } from "@/services/supabase";
import type { PresupuestoConGasto } from "@/types/finance";

export async function getPresupuestosConGasto(
  mes: number,
  anio: number,
): Promise<PresupuestoConGasto[]> {
  const { data, error } = await supabase.rpc("obtener_presupuestos_con_gasto", {
    p_mes: mes,
    p_anio: anio,
  });
  if (error) throw error;
  return data ?? [];
}

export interface PresupuestoDetalle {
  id: string;
  categoria_id: string | null;
  categoria_nombre: string | null;
  monto_limite: number;
  mes: number;
  anio: number;
}

export async function getPresupuesto(id: string): Promise<PresupuestoDetalle | null> {
  const { data, error } = await supabase
    .from("presupuestos")
    .select("id, categoria_id, monto_limite, mes, anio, categorias(nombre)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const fila = data as unknown as {
    id: string;
    categoria_id: string | null;
    monto_limite: number;
    mes: number;
    anio: number;
    categorias: { nombre: string } | null;
  };

  return {
    id: fila.id,
    categoria_id: fila.categoria_id,
    categoria_nombre: fila.categorias?.nombre ?? null,
    monto_limite: fila.monto_limite,
    mes: fila.mes,
    anio: fila.anio,
  };
}

export interface CrearPresupuestoInput {
  categoria_id: string | null;
  monto_limite: number;
  mes: number;
  anio: number;
}

export async function crearPresupuesto(input: CrearPresupuestoInput): Promise<{ id: string }> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const usuarioId = userData.user?.id;
  if (!usuarioId) throw new Error("No hay una sesión activa.");

  const { data, error } = await supabase
    .from("presupuestos")
    .insert({ ...input, usuario_id: usuarioId })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Ya existe un presupuesto para esa categoría este mes.");
    }
    throw error;
  }
  return data;
}

export async function actualizarMontoPresupuesto(
  id: string,
  montoLimite: number,
): Promise<void> {
  const { error } = await supabase
    .from("presupuestos")
    .update({ monto_limite: montoLimite })
    .eq("id", id);
  if (error) throw error;
}

export async function eliminarPresupuesto(id: string): Promise<void> {
  const { error } = await supabase.from("presupuestos").delete().eq("id", id);
  if (error) throw error;
}
