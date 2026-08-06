import { useQuery } from "@tanstack/react-query";
import { getCategoria, getCategorias } from "@/services/categorias.service";
import { getMetodosPago } from "@/services/metodosPago.service";
import type { TipoCategoria } from "@/types/database.types";

export function useCategorias(tipo?: TipoCategoria) {
  return useQuery({
    queryKey: ["categorias", tipo ?? "todas"],
    queryFn: () => getCategorias(tipo),
  });
}

export function useCategoria(id: string | undefined) {
  return useQuery({
    queryKey: ["categoria", id],
    queryFn: () => getCategoria(id as string),
    enabled: Boolean(id),
  });
}

export function useMetodosPago() {
  return useQuery({
    queryKey: ["metodos-pago"],
    queryFn: getMetodosPago,
  });
}
