import { Link } from "react-router-dom";
import { AlertTriangle, Wallet } from "lucide-react";
import type { PresupuestoConGasto } from "@/types/finance";
import { formatCurrency } from "@/utils/format";
import { obtenerIcono } from "@/utils/icons";

export function BudgetProgressCard({ presupuesto }: { presupuesto: PresupuestoConGasto }) {
  const porcentaje = presupuesto.monto_limite > 0
    ? Math.min((presupuesto.gastado / presupuesto.monto_limite) * 100, 999)
    : 0;
  const superado = presupuesto.gastado > presupuesto.monto_limite;
  const restante = presupuesto.monto_limite - presupuesto.gastado;

  const Icono = presupuesto.categoria_icono ? obtenerIcono(presupuesto.categoria_icono) : Wallet;
  const color = presupuesto.categoria_color ?? "#0A84FF";

  const colorBarra = superado ? "#FF453A" : porcentaje > 80 ? "#FF9F0A" : color;

  return (
    <Link to={`/presupuesto/${presupuesto.id}/editar`} className="glass-card block p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          <Icono size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {presupuesto.categoria_nombre ?? "General"}
          </p>
          <p className="text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">
            {formatCurrency(presupuesto.gastado)} de {formatCurrency(presupuesto.monto_limite)}
          </p>
        </div>
        {superado && <AlertTriangle size={16} className="shrink-0 text-ios-red" />}
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(porcentaje, 100)}%`, backgroundColor: colorBarra }}
        />
      </div>

      <p
        className={`mt-1.5 text-xs font-medium ${
          superado ? "text-ios-red" : "text-[#3C3C43] dark:text-[#EBEBF5]/60"
        }`}
      >
        {superado
          ? `Superado por ${formatCurrency(Math.abs(restante))}`
          : `${formatCurrency(restante)} restantes · ${porcentaje.toFixed(0)}% usado`}
      </p>
    </Link>
  );
}
