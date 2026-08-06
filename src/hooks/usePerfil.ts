import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getPerfil } from "@/services/usuarios.service";

export function usePerfil() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["perfil"],
    queryFn: getPerfil,
    enabled: Boolean(session),
  });
}
