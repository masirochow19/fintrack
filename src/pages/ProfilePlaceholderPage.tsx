import { Calendar, LogOut, Tag, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { signOut } from "@/services/auth.service";

/**
 * Placeholder temporal de Perfil. La pantalla completa (editar datos, tema,
 * exportar datos) llega en su propio paso — por ahora permite ver la cuenta
 * activa, gestionar categorías, ver el calendario y cerrar sesión.
 */
export function ProfilePlaceholderPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5 text-[#3C3C43] dark:bg-white/10 dark:text-[#EBEBF5]/70">
        <User size={26} />
      </div>
      <h1 className="text-lg font-semibold">Perfil</h1>
      <p className="mt-1 text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">{user?.email}</p>
      <p className="mt-1 max-w-xs text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
        Editar datos, tema y exportar información llegan en un próximo paso.
      </p>

      <Link to="/calendario" className="mt-6 w-full max-w-[220px]">
        <Button variant="ghost" type="button">
          <Calendar size={16} />
          Ver calendario
        </Button>
      </Link>

      <Link to="/categorias" className="mt-3 w-full max-w-[220px]">
        <Button variant="ghost" type="button">
          <Tag size={16} />
          Gestionar categorías
        </Button>
      </Link>

      <Button
        variant="ghost"
        className="mt-3 max-w-[220px]"
        onClick={() => void signOut()}
      >
        <LogOut size={16} />
        Cerrar sesión
      </Button>
    </div>
  );
}
