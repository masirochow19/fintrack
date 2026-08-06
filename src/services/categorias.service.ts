import { supabase } from "@/services/supabase";
import type { TipoCategoria } from "@/types/database.types";

export interface CategoriaOpcion {
  id: string;
  nombre: string;
  tipo: TipoCategoria;
  color: string;
  icono: string;
  limite_mensual: number | null;
}

export async function getCategorias(tipo?: TipoCategoria): Promise<CategoriaOpcion[]> {
  let query = supabase
    .from("categorias")
    .select("id, nombre, tipo, color, icono, limite_mensual")
    .order("nombre", { ascending: true });

  if (tipo) {
    query = query.eq("tipo", tipo);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getCategoria(id: string): Promise<CategoriaOpcion | null> {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre, tipo, color, icono, limite_mensual")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export interface GuardarCategoriaInput {
  nombre: string;
  tipo: TipoCategoria;
  color: string;
  icono: string;
  limite_mensual: number | null;
}

export async function crearCategoria(input: GuardarCategoriaInput): Promise<{ id: string }> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const usuarioId = userData.user?.id;
  if (!usuarioId) throw new Error("No hay una sesión activa.");

  const { data, error } = await supabase
    .from("categorias")
    .insert({ ...input, usuario_id: usuarioId })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarCategoria(
  id: string,
  input: GuardarCategoriaInput,
): Promise<void> {
  const { error } = await supabase.from("categorias").update(input).eq("id", id);
  if (error) throw error;
}

export async function eliminarCategoria(id: string): Promise<void> {
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) throw error;
}
