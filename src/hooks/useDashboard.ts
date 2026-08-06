import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  obtenerGastosPorCategoria,
  obtenerResumenMensual,
  obtenerResumenPeriodo,
  obtenerSaldoActual,
} from "@/services/dashboard.service";
import { getUltimosMovimientos } from "@/services/movimientos.service";
import { mesAnterior, mesYAnioActual, rangoDelMes } from "@/utils/date";

/** Habilita las queries solo cuando hay una sesión activa (evita llamadas
 * de más mientras se resuelve el login o justo después de cerrar sesión). */
function useHabilitado(): boolean {
  const { session } = useAuth();
  return Boolean(session);
}

export function useSaldoActual() {
  const habilitado = useHabilitado();
  return useQuery({
    queryKey: ["saldo-actual"],
    queryFn: obtenerSaldoActual,
    enabled: habilitado,
  });
}

/** Resumen del mes actual y del mes anterior, para la comparación en el Dashboard. */
export function useComparacionMensual() {
  const habilitado = useHabilitado();
  const { anio, mes } = mesYAnioActual();
  const anterior = mesAnterior(anio, mes);

  const actual = useQuery({
    queryKey: ["resumen-periodo", anio, mes],
    queryFn: () => {
      const { desde, hasta } = rangoDelMes(anio, mes);
      return obtenerResumenPeriodo(desde, hasta);
    },
    enabled: habilitado,
  });

  const previo = useQuery({
    queryKey: ["resumen-periodo", anterior.anio, anterior.mes],
    queryFn: () => {
      const { desde, hasta } = rangoDelMes(anterior.anio, anterior.mes);
      return obtenerResumenPeriodo(desde, hasta);
    },
    enabled: habilitado,
  });

  return { actual, previo };
}

export function useGastosPorCategoriaMesActual() {
  const habilitado = useHabilitado();
  const { anio, mes } = mesYAnioActual();

  return useQuery({
    queryKey: ["gastos-por-categoria", anio, mes],
    queryFn: () => {
      const { desde, hasta } = rangoDelMes(anio, mes);
      return obtenerGastosPorCategoria(desde, hasta);
    },
    enabled: habilitado,
  });
}

export function useResumenMensual(meses = 6) {
  const habilitado = useHabilitado();
  return useQuery({
    queryKey: ["resumen-mensual", meses],
    queryFn: () => obtenerResumenMensual(meses),
    enabled: habilitado,
  });
}

export function useUltimosMovimientos(limite = 5) {
  const habilitado = useHabilitado();
  return useQuery({
    queryKey: ["ultimos-movimientos", limite],
    queryFn: () => getUltimosMovimientos(limite),
    enabled: habilitado,
  });
}
