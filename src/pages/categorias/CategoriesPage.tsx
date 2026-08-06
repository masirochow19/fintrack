import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCategorias } from "@/hooks/useCatalogos";
import { CategoriaListItem } from "@/components/categorias/CategoriaListItem";
import { Skeleton } from "@/components/ui/Skeleton";
import type { TipoCategoria } from "@/types/database.types";

export function CategoriesPage() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState<TipoCategoria>("gasto");
  const categorias = useCategorias(tipo);

  return (
    <div className="min-h-dvh safe-top safe-bottom">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-surface-light/80 px-4 py-3 backdrop-blur-glass dark:border-white/10 dark:bg-surface-dark/80">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#3C3C43] dark:bg-white/10 dark:text-[#EBEBF5]/70"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-[15px] font-semibold">Categorías</h1>
        <Link
          to="/categorias/nueva"
          state={{ tipo }}
          aria-label="Nueva categoría"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-ios-blue text-white"
        >
          <Plus size={16} />
        </Link>
      </header>

      <div className="mx-auto max-w-lg p-4">
        <div className="flex rounded-2xl bg-black/5 p-1 dark:bg-white/10">
          {(["gasto", "ingreso"] as const).map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => setTipo(opcion)}
              className={`flex-1 rounded-xl py-2 text-sm font-medium capitalize transition-all ${
                tipo === opcion
                  ? "bg-white text-[#1C1C1E] shadow-sm dark:bg-[#3A3A3C] dark:text-white"
                  : "text-[#3C3C43] dark:text-[#EBEBF5]/60"
              }`}
            >
              {opcion === "gasto" ? "Gastos" : "Ingresos"}
            </button>
          ))}
        </div>

        <div className="glass-card mt-4 divide-y divide-black/5 px-4 dark:divide-white/10">
          {categorias.isLoading ? (
            <div className="space-y-3 py-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : categorias.data && categorias.data.length > 0 ? (
            categorias.data.map((categoria) => (
              <CategoriaListItem key={categoria.id} categoria={categoria} />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
              No tienes categorías de {tipo === "gasto" ? "gastos" : "ingresos"} todavía.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
