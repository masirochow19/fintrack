import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  obtenerGastosPorCategoria,
  obtenerResumenAnual,
  obtenerResumenMensual,
  obtenerResumenPeriodo,
} from "@/services/dashboard.service";
import { obtenerGastoExtremo } from "@/services/movimientos.service";
import { mesAnterior, rangoDelMes } from "@/utils/date";

function useHabilitado(): boolean {
  const { session } = useAuth();
  return Boolean(session);
}

export function useResumenMesSeleccionado(anio: number, mes: number) {
  const habilitado = useHabilitado();
  return useQuery({
    queryKey: ["resumen-periodo", anio, mes],
    queryFn: () => {
      const { desde, hasta } = rangoDelMes(anio, mes);
      return obtenerResumenPeriodo(desde, hasta);
    },
    enabled: habilitado,
  });
}

export function useComparacionMesSeleccionado(anio: number, mes: number) {
  const anterior = mesAnterior(anio, mes);
  const actual = useResumenMesSeleccionado(anio, mes);
  const previo = useResumenMesSeleccionado(anterior.anio, anterior.mes);
  return { actual, previo };
}

export function useGastosPorCategoriaSeleccionado(anio: number, mes: number) {
  const habilitado = useHabilitado();
  return useQuery({
    queryKey: ["gastos-por-categoria", anio, mes],
    queryFn: () => {
      const { desde, hasta } = rangoDelMes(anio, mes);
      return obtenerGastosPorCategoria(desde, hasta);
    },
    enabled: habilitado,
  });
}

export function useGastoExtremo(anio: number, mes: number, orden: "mayor" | "menor") {
  const habilitado = useHabilitado();
  return useQuery({
    queryKey: ["gasto-extremo", anio, mes, orden],
    queryFn: () => {
      const { desde, hasta } = rangoDelMes(anio, mes);
      return obtenerGastoExtremo(desde, hasta, orden);
    },
    enabled: habilitado,
  });
}

export function useResumenUltimosMeses(meses = 12) {
  const habilitado = useHabilitado();
  return useQuery({
    queryKey: ["resumen-mensual", meses],
    queryFn: () => obtenerResumenMensual(meses),
    enabled: habilitado,
  });
}

export function useComparacionAnual(anio: number) {
  const habilitado = useHabilitado();

  const actual = useQuery({
    queryKey: ["resumen-anual", anio],
    queryFn: () => obtenerResumenAnual(anio),
    enabled: habilitado,
  });

  const previo = useQuery({
    queryKey: ["resumen-anual", anio - 1],
    queryFn: () => obtenerResumenAnual(anio - 1),
    enabled: habilitado,
  });

  return { actual, previo };
}
