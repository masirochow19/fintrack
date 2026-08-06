import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { CategoriaOpcion } from "@/services/categorias.service";
import { obtenerIcono } from "@/utils/icons";
import { formatCurrency } from "@/utils/format";

export function CategoriaListItem({ categoria }: { categoria: CategoriaOpcion }) {
  const Icono = obtenerIcono(categoria.icono);

  return (
    <Link
      to={`/categorias/${categoria.id}/editar`}
      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: categoria.color }}
      >
        <Icono size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{categoria.nombre}</p>
        {categoria.limite_mensual && (
          <p className="text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">
            Límite: {formatCurrency(categoria.limite_mensual)}/mes
          </p>
        )}
      </div>
      <ChevronRight size={16} className="shrink-0 text-[#C7C7CC]" />
    </Link>
  );
}
