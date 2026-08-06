import type { CategoriaOpcion } from "@/services/categorias.service";
import { obtenerIcono } from "@/utils/icons";
import { Skeleton } from "@/components/ui/Skeleton";

interface CategoriaPickerProps {
  categorias: CategoriaOpcion[] | undefined;
  isLoading: boolean;
  value: string | null | undefined;
  onChange: (categoriaId: string) => void;
  error?: string;
}

export function CategoriaPicker({
  categorias,
  isLoading,
  value,
  onChange,
  error,
}: CategoriaPickerProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!categorias || categorias.length === 0) {
    return (
      <p className="rounded-xl bg-black/5 px-3 py-2 text-sm text-[#3C3C43] dark:bg-white/10 dark:text-[#EBEBF5]/60">
        No tienes categorías de este tipo todavía.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {categorias.map((categoria) => {
          const Icono = obtenerIcono(categoria.icono);
          const seleccionada = value === categoria.id;
          return (
            <button
              key={categoria.id}
              type="button"
              onClick={() => onChange(categoria.id)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border px-1.5 py-3 text-center transition-all ${
                seleccionada
                  ? "border-ios-blue bg-ios-blue/10"
                  : "border-white/60 bg-white/50 dark:border-white/10 dark:bg-white/[0.04]"
              }`}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: categoria.color }}
              >
                <Icono size={16} />
              </span>
              <span className="line-clamp-1 text-[11px] font-medium">
                {categoria.nombre}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-xs text-ios-red">{error}</p>}
    </div>
  );
}
