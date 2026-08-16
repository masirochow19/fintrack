import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, CalendarCheck, Download, LogOut, Tag, User } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { ThemeSelector } from "@/components/perfil/ThemeSelector";
import { useAuth } from "@/contexts/AuthContext";
import { usePerfil } from "@/hooks/usePerfil";
import { actualizarNombre } from "@/services/usuarios.service";
import { exportarMovimientosCSV } from "@/services/exportacion.service";
import { signOut } from "@/services/auth.service";

interface FormValues {
  nombre: string;
}

export function ProfilePage() {
  const { user } = useAuth();
  const perfil = usePerfil();
  const queryClient = useQueryClient();

  const [guardado, setGuardado] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [exportando, setExportando] = useState(false);
  const [errorExportar, setErrorExportar] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    values: perfil.data ? { nombre: perfil.data.nombre ?? "" } : undefined,
    defaultValues: { nombre: "" },
  });

  async function onSubmit(values: FormValues) {
    setErrorGeneral(null);
    setGuardado(false);
    try {
      await actualizarNombre(values.nombre.trim());
      await queryClient.invalidateQueries({ queryKey: ["perfil"] });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo guardar el nombre.",
      );
    }
  }

  async function handleExportar() {
    setErrorExportar(null);
    setExportando(true);
    try {
      await exportarMovimientosCSV();
    } catch (error) {
      setErrorExportar(
        error instanceof Error ? error.message : "No se pudo exportar tus datos.",
      );
    } finally {
      setExportando(false);
    }
  }

  const inicial = (perfil.data?.nombre ?? user?.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p className="text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
          Tu cuenta y preferencias
        </p>
      </div>

      <div className="glass-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ios-blue text-lg font-semibold text-white">
            {inicial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{perfil.data?.nombre || "Sin nombre"}</p>
            <p className="truncate text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">
              {user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <TextField
            label="Nombre"
            error={errors.nombre?.message}
            {...register("nombre", { required: "Ingresa tu nombre." })}
          />
          {errorGeneral && (
            <p className="rounded-xl bg-ios-red/10 px-3 py-2 text-sm text-ios-red">
              {errorGeneral}
            </p>
          )}
          <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
            {guardado ? "¡Guardado!" : "Guardar cambios"}
          </Button>
        </form>
      </div>

      <div className="glass-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Tema</h2>
        <ThemeSelector />
      </div>

      <div className="glass-card divide-y divide-black/5 p-1 dark:divide-white/10">
        <Link
          to="/categorias"
          className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium"
        >
          <Tag size={18} className="text-ios-blue" />
          Gestionar categorías
        </Link>
        <Link
          to="/dias-pagados"
          className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium"
        >
          <CalendarCheck size={18} className="text-ios-blue" />
          Días pagados
        </Link>
        <Link
          to="/calendario"
          className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium"
        >
          <Calendar size={18} className="text-ios-blue" />
          Ver calendario
        </Link>
        <button
          type="button"
          onClick={() => void handleExportar()}
          disabled={exportando}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium disabled:opacity-50"
        >
          <Download size={18} className="text-ios-blue" />
          {exportando ? "Exportando..." : "Exportar movimientos (CSV)"}
        </button>
      </div>
      {errorExportar && (
        <p className="rounded-xl bg-ios-red/10 px-3 py-2 text-sm text-ios-red">
          {errorExportar}
        </p>
      )}

      <Button variant="ghost" onClick={() => void signOut()}>
        <LogOut size={16} />
        Cerrar sesión
      </Button>

      <p className="flex items-center justify-center gap-1.5 pt-2 text-xs text-[#8E8E93]">
        <User size={12} /> FinTrack
      </p>
    </div>
  );
}
