import { Link } from "react-router-dom";
import { CheckCircle2, Target } from "lucide-react";
import type { MetaAhorro } from "@/services/metas.service";
import { formatCurrency } from "@/utils/format";
import { diasRestantes } from "@/utils/date";

function textoFecha(meta: MetaAhorro): string | null {
  if (!meta.fecha_limite) return null;
  const dias = diasRestantes(meta.fecha_limite);
  if (meta.completada) return null;
  if (dias < 0) return "Fecha vencida";
  if (dias === 0) return "Vence hoy";
  return `Vence en ${dias} días`;
}

export function GoalProgressCard({ meta }: { meta: MetaAhorro }) {
  const porcentaje = meta.monto_objetivo > 0
    ? Math.min((meta.monto_actual / meta.monto_objetivo) * 100, 100)
    : 0;
  const textoVencimiento = textoFecha(meta);

  return (
    <Link to={`/metas/${meta.id}`} className="glass-card block p-4">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
            meta.completada ? "bg-ios-green" : "bg-ios-indigo"
          }`}
        >
          {meta.completada ? <CheckCircle2 size={17} /> : <Target size={16} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{meta.nombre}</p>
          <p className="text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">
            {formatCurrency(meta.monto_actual)} de {formatCurrency(meta.monto_objetivo)}
          </p>
        </div>
        {meta.completada && (
          <span className="shrink-0 rounded-full bg-ios-green/10 px-2 py-1 text-[11px] font-semibold text-ios-green">
            Completada
          </span>
        )}
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${
            meta.completada ? "bg-ios-green" : "bg-ios-indigo"
          }`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      <p className="mt-1.5 text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">
        {porcentaje.toFixed(0)}% · {textoVencimiento ?? "Sin fecha límite"}
      </p>
    </Link>
  );
}
