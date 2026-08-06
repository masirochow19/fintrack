import { supabase } from "@/services/supabase";
import type { TipoMetodoPago } from "@/types/database.types";

export interface MetodoPagoOpcion {
  id: string;
  nombre: string;
  tipo: TipoMetodoPago;
  icono: string | null;
  color: string | null;
}

export async function getMetodosPago(): Promise<MetodoPagoOpcion[]> {
  const { data, error } = await supabase
    .from("metodos_pago")
    .select("id, nombre, tipo, icono, color")
    .eq("activo", true)
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
