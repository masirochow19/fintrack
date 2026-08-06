import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Wallet } from "lucide-react";
import { MonthSelector } from "@/components/estadisticas/MonthSelector";
import { BudgetProgressCard } from "@/components/presupuesto/BudgetProgressCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { usePresupuestosConGasto } from "@/hooks/usePresupuestos";
import { mesYAnioActual } from "@/utils/date";

export function PresupuestoPage() {
  const hoy = mesYAnioActual();
  const [anio, setAnio] = useState(hoy.anio);
  const [mes, setMes] = useState(hoy.mes);

  const presupuestos = usePresupuestosConGasto(mes, anio);

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Presupuesto</h1>
          <p className="text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
            Controla tus límites de gasto
          </p>
        </div>
        <Link
          to="/presupuesto/nuevo"
          state={{ mes, anio }}
          aria-label="Nuevo presupuesto"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ios-blue text-white"
        >
          <Plus size={18} />
        </Link>
      </div>

      <div className="glass-card p-4">
        <MonthSelector anio={anio} mes={mes} onChange={(a, m) => { setAnio(a); setMes(m); }} />
      </div>

      {presupuestos.isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : presupuestos.data && presupuestos.data.length > 0 ? (
        <div className="space-y-3">
          {presupuestos.data.map((p) => (
            <BudgetProgressCard key={p.id} presupuesto={p} />
          ))}
        </div>
      ) : (
        <div className="glass-card flex flex-col items-center justify-center gap-2 p-10 text-center">
          <Wallet size={28} className="opacity-40" />
          <p className="text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
            No tienes presupuestos para este mes.
          </p>
          <Link
            to="/presupuesto/nuevo"
            state={{ mes, anio }}
            className="mt-1 text-sm font-medium text-ios-blue"
          >
            Crear presupuesto
          </Link>
        </div>
      )}
    </div>
  );
}
