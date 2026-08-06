import { useState } from "react";
import { Calendar, CalendarDays, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { MonthSelector } from "@/components/estadisticas/MonthSelector";
import { ExtremeMovementCard } from "@/components/estadisticas/ExtremeMovementCard";
import { YearComparisonCard } from "@/components/estadisticas/YearComparisonCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { MonthlyBarChart } from "@/components/dashboard/MonthlyBarChart";
import {
  useComparacionAnual,
  useComparacionMesSeleccionado,
  useGastoExtremo,
  useGastosPorCategoriaSeleccionado,
  useResumenUltimosMeses,
} from "@/hooks/useEstadisticas";
import { calcularVariacion, formatCurrency } from "@/utils/format";
import { diasTranscurridosEnMes, mesYAnioActual } from "@/utils/date";

export function EstadisticasPage() {
  const hoy = mesYAnioActual();
  const [anio, setAnio] = useState(hoy.anio);
  const [mes, setMes] = useState(hoy.mes);

  const { actual, previo } = useComparacionMesSeleccionado(anio, mes);
  const gastosPorCategoria = useGastosPorCategoriaSeleccionado(anio, mes);
  const mayorGasto = useGastoExtremo(anio, mes, "mayor");
  const menorGasto = useGastoExtremo(anio, mes, "menor");
  const resumenUltimosMeses = useResumenUltimosMeses(12);
  const comparacionAnual = useComparacionAnual(hoy.anio);

  const dias = diasTranscurridosEnMes(anio, mes);
  const gastosMes = actual.data?.gastos ?? 0;
  const promedioDiario = dias > 0 ? gastosMes / dias : 0;
  const promedioSemanal = promedioDiario * 7;

  const variacionIngresos =
    actual.data && previo.data
      ? calcularVariacion(actual.data.ingresos, previo.data.ingresos)
      : undefined;
  const variacionGastos =
    actual.data && previo.data
      ? calcularVariacion(actual.data.gastos, previo.data.gastos)
      : undefined;

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold">Estadísticas</h1>
        <p className="text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
          Analiza tus ingresos y gastos en detalle
        </p>
      </div>

      <div className="glass-card p-4">
        <MonthSelector anio={anio} mes={mes} onChange={(a, m) => { setAnio(a); setMes(m); }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Ingresos"
          valor={actual.data?.ingresos}
          isLoading={actual.isLoading}
          icon={TrendingUp}
          iconClassName="bg-ios-green/10 text-ios-green"
          variacion={variacionIngresos}
        />
        <StatCard
          label="Gastos"
          valor={actual.data?.gastos}
          isLoading={actual.isLoading}
          icon={TrendingDown}
          iconClassName="bg-ios-red/10 text-ios-red"
          variacion={variacionGastos}
          aumentoEsNegativo
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Promedio diario"
          valor={promedioDiario}
          isLoading={actual.isLoading}
          icon={CalendarDays}
          iconClassName="bg-ios-indigo/10 text-ios-indigo"
        />
        <StatCard
          label="Promedio semanal"
          valor={promedioSemanal}
          isLoading={actual.isLoading}
          icon={Calendar}
          iconClassName="bg-ios-purple/10 text-ios-purple"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ExtremeMovementCard
          titulo="Mayor gasto"
          movimiento={mayorGasto.data}
          isLoading={mayorGasto.isLoading}
          tipo="mayor"
        />
        <ExtremeMovementCard
          titulo="Menor gasto"
          movimiento={menorGasto.data}
          isLoading={menorGasto.isLoading}
          tipo="menor"
        />
      </div>

      <CategoryPieChart datos={gastosPorCategoria.data} isLoading={gastosPorCategoria.isLoading} />

      <MonthlyBarChart datos={resumenUltimosMeses.data} isLoading={resumenUltimosMeses.isLoading} />

      <YearComparisonCard
        anio={hoy.anio}
        actual={comparacionAnual.actual.data}
        previo={comparacionAnual.previo.data}
        isLoading={comparacionAnual.actual.isLoading || comparacionAnual.previo.isLoading}
      />

      <div className="glass-card flex items-center gap-3 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ios-indigo/10 text-ios-indigo">
          <PiggyBank size={18} />
        </div>
        <p className="text-sm text-[#3C3C43] dark:text-[#EBEBF5]/70">
          Este mes has ahorrado{" "}
          <span className="font-semibold text-[#1C1C1E] dark:text-white">
            {formatCurrency((actual.data?.ingresos ?? 0) - (actual.data?.gastos ?? 0))}
          </span>
          .
        </p>
      </div>
    </div>
  );
}
