import { supabase } from "@/services/supabase";

export interface MetaAhorro {
  id: string;
  nombre: string;
  monto_objetivo: number;
  monto_actual: number;
  fecha_limite: string | null;
  completada: boolean;
}

export async function getMetas(): Promise<MetaAhorro[]> {
  const { data, error } = await supabase
    .from("metas")
    .select("id, nombre, monto_objetivo, monto_actual, fecha_limite, completada")
    .order("completada", { ascending: true })
    .order("fecha_limite", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMeta(id: string): Promise<MetaAhorro | null> {
  const { data, error } = await supabase
    .from("metas")
    .select("id, nombre, monto_objetivo, monto_actual, fecha_limite, completada")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export interface GuardarMetaInput {
  nombre: string;
  monto_objetivo: number;
  fecha_limite: string | null;
}

export async function crearMeta(input: GuardarMetaInput): Promise<{ id: string }> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const usuarioId = userData.user?.id;
  if (!usuarioId) throw new Error("No hay una sesión activa.");

  const { data, error } = await supabase
    .from("metas")
    .insert({ ...input, usuario_id: usuarioId })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarMeta(id: string, input: GuardarMetaInput): Promise<void> {
  const { error } = await supabase.from("metas").update(input).eq("id", id);
  if (error) throw error;
}

export async function eliminarMeta(id: string): Promise<void> {
  const { error } = await supabase.from("metas").delete().eq("id", id);
  if (error) throw error;
}

/** Agrega un aporte a la meta de forma atómica (vía función SQL) y devuelve
 * la meta actualizada, incluyendo si quedó `completada`. */
export async function agregarAporte(metaId: string, monto: number): Promise<MetaAhorro> {
  const { data, error } = await supabase.rpc("agregar_aporte_meta", {
    p_meta_id: metaId,
    p_monto: monto,
  });
  if (error) throw error;
  return data;
}
