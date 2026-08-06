import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getMovimientosDelMes } from "@/services/movimientos.service";

export function useMovimientosDelMes(anio: number, mes: number) {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["movimientos-mes", anio, mes],
    queryFn: () => getMovimientosDelMes(anio, mes),
    enabled: Boolean(session),
  });
}
