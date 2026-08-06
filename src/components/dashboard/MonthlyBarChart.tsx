import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { ResumenMensual } from "@/types/finance";
import { formatCurrency } from "@/utils/format";
import { nombreMesCorto } from "@/utils/date";
import { Skeleton } from "@/components/ui/Skeleton";

interface MonthlyBarChartProps {
  datos: ResumenMensual[] | undefined;
  isLoading: boolean;
}

export function MonthlyBarChart({ datos, isLoading }: MonthlyBarChartProps) {
  const datosGrafico = (datos ?? []).map((d) => ({
    mesLabel: nombreMesCorto(d.mes),
    ingresos: d.ingresos,
    gastos: d.gastos,
  }));

  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-semibold">Ingresos vs. gastos</h2>
      <p className="text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">Últimos meses</p>

      {isLoading ? (
        <Skeleton className="mt-4 h-52 w-full" />
      ) : (
        <div className="mt-2 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosGrafico} barGap={4}>
              <CartesianGrid vertical={false} stroke="rgba(60,60,67,0.1)" />
              <XAxis
                dataKey="mesLabel"
                axisLine={false}
                tickLine={false}
                fontSize={12}
                stroke="currentColor"
                opacity={0.5}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                }}
              />
              <Bar dataKey="ingresos" fill="#30D158" radius={[6, 6, 0, 0]} maxBarSize={14} />
              <Bar dataKey="gastos" fill="#FF453A" radius={[6, 6, 0, 0]} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ios-green" /> Ingresos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ios-red" /> Gastos
        </span>
      </div>
    </div>
  );
}
