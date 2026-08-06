import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ResumenPeriodo } from "@/types/finance";
import { formatCurrency, formatPorcentaje, calcularVariacion } from "@/utils/format";
import { Skeleton } from "@/components/ui/Skeleton";

interface YearComparisonCardProps {
  anio: number;
  actual: ResumenPeriodo | undefined;
  previo: ResumenPeriodo | undefined;
  isLoading: boolean;
}

function Fila({
  label,
  actual,
  previo,
  aumentoEsNegativo,
}: {
  label: string;
  actual: number;
  previo: number;
  aumentoEsNegativo: boolean;
}) {
  const variacion = calcularVariacion(actual, previo);
  const esAumento = variacion >= 0;
  const color = esAumento
    ? aumentoEsNegativo
      ? "text-ios-red"
      : "text-ios-green"
    : aumentoEsNegativo
      ? "text-ios-green"
      : "text-ios-red";

  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-[#3C3C43] dark:text-[#EBEBF5]/70">{label}</span>
      <div className="text-right">
        <p className="text-sm font-semibold">{formatCurrency(actual)}</p>
        <p className={`flex items-center justify-end gap-0.5 text-xs font-medium ${color}`}>
          {esAumento ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {formatPorcentaje(variacion)}
        </p>
      </div>
    </div>
  );
}

export function YearComparisonCard({
  anio,
  actual,
  previo,
  isLoading,
}: YearComparisonCardProps) {
  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-semibold">Comparación anual</h2>
      <p className="text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">
        {anio} vs. {anio - 1}
      </p>

      {isLoading ? (
        <div className="mt-3 space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="mt-1 divide-y divide-black/5 dark:divide-white/10">
          <Fila
            label="Ingresos"
            actual={actual?.ingresos ?? 0}
            previo={previo?.ingresos ?? 0}
            aumentoEsNegativo={false}
          />
          <Fila
            label="Gastos"
            actual={actual?.gastos ?? 0}
            previo={previo?.gastos ?? 0}
            aumentoEsNegativo
          />
        </div>
      )}
    </div>
  );
}
