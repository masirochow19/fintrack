import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getPresupuesto, getPresupuestosConGasto } from "@/services/presupuestos.service";

export function usePresupuestosConGasto(mes: number, anio: number) {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["presupuestos", anio, mes],
    queryFn: () => getPresupuestosConGasto(mes, anio),
    enabled: Boolean(session),
  });
}

export function usePresupuesto(id: string | undefined) {
  return useQuery({
    queryKey: ["presupuesto", id],
    queryFn: () => getPresupuesto(id as string),
    enabled: Boolean(id),
  });
}
