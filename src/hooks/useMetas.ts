import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getMeta, getMetas } from "@/services/metas.service";

export function useMetas() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["metas"],
    queryFn: getMetas,
    enabled: Boolean(session),
  });
}

export function useMeta(id: string | undefined) {
  return useQuery({
    queryKey: ["meta", id],
    queryFn: () => getMeta(id as string),
    enabled: Boolean(id),
  });
}
