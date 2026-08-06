import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { MonthlyBarChart } from "@/components/dashboard/MonthlyBarChart";
import { RecentMovements } from "@/components/dashboard/RecentMovements";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import {
  useComparacionMensual,
  useGastosPorCategoriaMesActual,
  useResumenMensual,
  useSaldoActual,
  useUltimosMovimientos,
} from "@/hooks/useDashboard";
import { calcularVariacion } from "@/utils/format";
import { nombreMes, mesYAnioActual } from "@/utils/date";

export function DashboardPage() {
  const { mes } = mesYAnioActual();
  const saldo = useSaldoActual();
  const { actual, previo } = useComparacionMensual();
  const gastosPorCategoria = useGastosPorCategoriaMesActual();
  const resumenMensual = useResumenMensual(6);
  const ultimosMovimientos = useUltimosMovimientos(6);

  const ingresosMes = actual.data?.ingresos;
  const gastosMes = actual.data?.gastos;
  const ahorroMes = (ingresosMes ?? 0) - (gastosMes ?? 0);

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
        <p className="text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
          {nombreMes(mes)}
        </p>
        <h1 className="text-2xl font-bold">Resumen financiero</h1>
      </div>

      <BalanceCard saldo={saldo.data} isLoading={saldo.isLoading} />

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Ingresos del mes"
          valor={ingresosMes}
          isLoading={actual.isLoading}
          icon={TrendingUp}
          iconClassName="bg-ios-green/10 text-ios-green"
          variacion={variacionIngresos}
        />
        <StatCard
          label="Gastos del mes"
          valor={gastosMes}
          isLoading={actual.isLoading}
          icon={TrendingDown}
          iconClassName="bg-ios-red/10 text-ios-red"
          variacion={variacionGastos}
          aumentoEsNegativo
        />
      </div>

      <StatCard
        label="Ahorro del mes"
        valor={ahorroMes}
        isLoading={actual.isLoading}
        icon={PiggyBank}
        iconClassName="bg-ios-indigo/10 text-ios-indigo"
      />

      <CategoryPieChart datos={gastosPorCategoria.data} isLoading={gastosPorCategoria.isLoading} />

      <MonthlyBarChart datos={resumenMensual.data} isLoading={resumenMensual.isLoading} />

      <RecentMovements
        movimientos={ultimosMovimientos.data}
        isLoading={ultimosMovimientos.isLoading}
      />

      <FloatingActionButton />
    </div>
  );
}
