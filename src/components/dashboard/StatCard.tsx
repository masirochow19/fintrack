import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency, formatPorcentaje } from "@/utils/format";
import { Skeleton } from "@/components/ui/Skeleton";

interface StatCardProps {
  label: string;
  valor: number | undefined;
  isLoading: boolean;
  icon: LucideIcon;
  iconClassName?: string;
  /** % de variación vs el período anterior. undefined = no mostrar. */
  variacion?: number;
  /** Si true, un aumento se pinta en rojo en vez de verde (para "gastos"). */
  aumentoEsNegativo?: boolean;
}

export function StatCard({
  label,
  valor,
  isLoading,
  icon: Icon,
  iconClassName = "bg-ios-blue/10 text-ios-blue",
  variacion,
  aumentoEsNegativo = false,
}: StatCardProps) {
  const esAumento = (variacion ?? 0) >= 0;
  const colorVariacion = esAumento
    ? aumentoEsNegativo
      ? "text-ios-red"
      : "text-ios-green"
    : aumentoEsNegativo
      ? "text-ios-green"
      : "text-ios-red";

  return (
    <div className="glass-card p-4">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${iconClassName}`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-xs font-medium text-[#3C3C43] dark:text-[#EBEBF5]/60">
        {label}
      </p>
      {isLoading ? (
        <Skeleton className="mt-1 h-6 w-24" />
      ) : (
        <p className="mt-0.5 text-lg font-semibold">{formatCurrency(valor ?? 0)}</p>
      )}
      {variacion !== undefined && !isLoading && (
        <div className={`mt-1 flex items-center gap-0.5 text-xs font-medium ${colorVariacion}`}>
          {esAumento ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {formatPorcentaje(variacion)} vs mes anterior
        </div>
      )}
    </div>
  );
}
