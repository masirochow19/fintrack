import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import type { GastoPorCategoria } from "@/types/finance";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/Skeleton";

interface CategoryPieChartProps {
  datos: GastoPorCategoria[] | undefined;
  isLoading: boolean;
}

export function CategoryPieChart({ datos, isLoading }: CategoryPieChartProps) {
  const hayDatos = (datos?.length ?? 0) > 0;

  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-semibold">Gastos por categoría</h2>
      <p className="text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">Este mes</p>

      {isLoading ? (
        <Skeleton className="mx-auto mt-4 h-44 w-44 rounded-full" />
      ) : !hayDatos ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-[#3C3C43] dark:text-[#EBEBF5]/60">
          <PieChartIcon size={28} className="mb-2 opacity-40" />
          <p className="text-sm">Aún no hay gastos categorizados este mes.</p>
        </div>
      ) : (
        <>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datos}
                  dataKey="total"
                  nameKey="categoria_nombre"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {datos!.map((entrada) => (
                    <Cell key={entrada.categoria_id} fill={entrada.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-2 space-y-2">
            {datos!.slice(0, 5).map((entrada) => (
              <li key={entrada.categoria_id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entrada.color }}
                  />
                  {entrada.categoria_nombre}
                </span>
                <span className="font-medium">{formatCurrency(entrada.total)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
