import { supabase } from "@/services/supabase";
import type { GastoPorCategoria, ResumenMensual, ResumenPeriodo } from "@/types/finance";

export async function obtenerSaldoActual(): Promise<number> {
  const { data, error } = await supabase.rpc("obtener_saldo_actual");
  if (error) throw error;
  return data ?? 0;
}

export async function obtenerResumenPeriodo(
  desde: string,
  hasta: string,
): Promise<ResumenPeriodo> {
  const { data, error } = await supabase.rpc("obtener_resumen_periodo", {
    p_desde: desde,
    p_hasta: hasta,
  });
  if (error) throw error;
  return data?.[0] ?? { ingresos: 0, gastos: 0 };
}

export async function obtenerGastosPorCategoria(
  desde: string,
  hasta: string,
): Promise<GastoPorCategoria[]> {
  const { data, error } = await supabase.rpc("obtener_gastos_por_categoria", {
    p_desde: desde,
    p_hasta: hasta,
  });
  if (error) throw error;
  return data ?? [];
}

export async function obtenerResumenMensual(meses = 6): Promise<ResumenMensual[]> {
  const { data, error } = await supabase.rpc("obtener_resumen_mensual", {
    p_meses: meses,
  });
  if (error) throw error;
  return data ?? [];
}

export async function obtenerResumenAnual(anio: number): Promise<ResumenPeriodo> {
  const { data, error } = await supabase.rpc("obtener_resumen_anual", {
    p_anio: anio,
  });
  if (error) throw error;
  return data?.[0] ?? { ingresos: 0, gastos: 0 };
}
