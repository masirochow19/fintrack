import { ArrowDown, ArrowUp } from "lucide-react";
import type { MovimientoConRelaciones } from "@/types/finance";
import { formatCurrency } from "@/utils/format";
import { formatFechaCorta } from "@/utils/date";
import { Skeleton } from "@/components/ui/Skeleton";
import { obtenerIcono } from "@/utils/icons";

interface ExtremeMovementCardProps {
  titulo: string;
  movimiento: MovimientoConRelaciones | null | undefined;
  isLoading: boolean;
  tipo: "mayor" | "menor";
}

export function ExtremeMovementCard({
  titulo,
  movimiento,
  isLoading,
  tipo,
}: ExtremeMovementCardProps) {
  const Flecha = tipo === "mayor" ? ArrowUp : ArrowDown;
  const Icono = movimiento?.categoria ? obtenerIcono(movimiento.categoria.icono) : null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-1.5 text-xs font-medium text-[#3C3C43] dark:text-[#EBEBF5]/60">
        <Flecha size={12} className={tipo === "mayor" ? "text-ios-red" : "text-ios-green"} />
        {titulo}
      </div>

      {isLoading ? (
        <Skeleton className="mt-2 h-6 w-24" />
      ) : !movimiento ? (
        <p className="mt-1.5 text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">Sin datos</p>
      ) : (
        <>
          <p className="mt-0.5 text-lg font-semibold">{formatCurrency(movimiento.monto)}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">
            {Icono && (
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: movimiento.categoria?.color }}
              >
                <Icono size={10} />
              </span>
            )}
            <span className="truncate">
              {movimiento.categoria?.nombre ?? movimiento.descripcion ?? "—"}
            </span>
            <span>· {formatFechaCorta(movimiento.fecha)}</span>
          </div>
        </>
      )}
    </div>
  );
}
