import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getRegistrosDelMes } from "@/services/registroPago.service";

export function useRegistrosPagoDelMes(anio: number, mes: number) {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["registro-pago", anio, mes],
    queryFn: () => getRegistrosDelMes(anio, mes),
    enabled: Boolean(session),
  });
}
