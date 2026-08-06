import { supabase } from "@/services/supabase";

export interface PerfilUsuario {
  id: string;
  nombre: string | null;
  email: string;
}

export async function getPerfil(): Promise<PerfilUsuario | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const usuarioId = userData.user?.id;
  if (!usuarioId) return null;

  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre, email")
    .eq("id", usuarioId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function actualizarNombre(nombre: string): Promise<void> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const usuarioId = userData.user?.id;
  if (!usuarioId) throw new Error("No hay una sesión activa.");

  const { error } = await supabase.from("usuarios").update({ nombre }).eq("id", usuarioId);
  if (error) throw error;
}
