import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight, Receipt } from "lucide-react";
import type { MovimientoConRelaciones } from "@/types/finance";
import { formatCurrency } from "@/utils/format";
import { formatFechaCorta } from "@/utils/date";
import { Skeleton } from "@/components/ui/Skeleton";

interface RecentMovementsProps {
  movimientos: MovimientoConRelaciones[] | undefined;
  isLoading: boolean;
}

const ICONO_POR_TIPO = {
  ingreso: ArrowDownLeft,
  gasto: ArrowUpRight,
  transferencia: ArrowRightLeft,
} as const;

const ESTILO_POR_TIPO = {
  ingreso: "bg-ios-green/10 text-ios-green",
  gasto: "bg-ios-red/10 text-ios-red",
  transferencia: "bg-ios-blue/10 text-ios-blue",
} as const;

function signoMonto(tipo: MovimientoConRelaciones["tipo"]): string {
  if (tipo === "ingreso") return "+";
  if (tipo === "gasto") return "-";
  return "";
}

export function RecentMovements({ movimientos, isLoading }: RecentMovementsProps) {
  const hayDatos = (movimientos?.length ?? 0) > 0;

  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-semibold">Últimos movimientos</h2>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !hayDatos ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-[#3C3C43] dark:text-[#EBEBF5]/60">
          <Receipt size={28} className="mb-2 opacity-40" />
          <p className="text-sm">Todavía no registras movimientos.</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-black/5 dark:divide-white/10">
          {movimientos!.map((mov) => {
            const Icono = ICONO_POR_TIPO[mov.tipo];
            return (
              <li key={mov.id} className="flex items-center gap-3 py-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${ESTILO_POR_TIPO[mov.tipo]}`}
                >
                  <Icono size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {mov.descripcion || mov.categoria?.nombre || "Movimiento"}
                  </p>
                  <p className="text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">
                    {mov.categoria?.nombre ?? "Sin categoría"} ·{" "}
                    {formatFechaCorta(mov.fecha)}
                  </p>
                </div>
                <p
                  className={`shrink-0 text-sm font-semibold ${
                    mov.tipo === "ingreso"
                      ? "text-ios-green"
                      : mov.tipo === "gasto"
                        ? "text-ios-red"
                        : ""
                  }`}
                >
                  {signoMonto(mov.tipo)}
                  {formatCurrency(mov.monto)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
