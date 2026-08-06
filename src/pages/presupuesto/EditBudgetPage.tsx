import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, X } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { usePresupuesto } from "@/hooks/usePresupuestos";
import { actualizarMontoPresupuesto, eliminarPresupuesto } from "@/services/presupuestos.service";
import { nombreMes } from "@/utils/date";

interface FormValues {
  monto_limite: string;
}

export function EditBudgetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const presupuesto = usePresupuesto(id);

  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    values: presupuesto.data
      ? { monto_limite: String(presupuesto.data.monto_limite) }
      : undefined,
    defaultValues: { monto_limite: "" },
  });

  async function invalidar() {
    await queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
  }

  async function onSubmit(values: FormValues) {
    if (!id) return;
    setErrorGeneral(null);
    const monto = Number(values.monto_limite);
    if (Number.isNaN(monto) || monto <= 0) {
      setErrorGeneral("El monto debe ser mayor a 0.");
      return;
    }
    try {
      await actualizarMontoPresupuesto(id, monto);
      await invalidar();
      navigate(-1);
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo actualizar el presupuesto.",
      );
    }
  }

  async function handleEliminar() {
    if (!id) return;
    try {
      await eliminarPresupuesto(id);
      await invalidar();
      navigate(-1);
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo eliminar el presupuesto.",
      );
    }
  }

  return (
    <div className="min-h-dvh safe-top safe-bottom">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-surface-light/80 px-4 py-3 backdrop-blur-glass dark:border-white/10 dark:bg-surface-dark/80">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Cancelar"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#3C3C43] dark:bg-white/10 dark:text-[#EBEBF5]/70"
        >
          <X size={16} />
        </button>
        <h1 className="text-[15px] font-semibold">Editar presupuesto</h1>
        <div className="w-8" />
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-5 p-4 pb-10" noValidate>
        {presupuesto.data && (
          <p className="text-center text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
            {presupuesto.data.categoria_nombre ?? "General"} ·{" "}
            {nombreMes(presupuesto.data.mes)} {presupuesto.data.anio}
          </p>
        )}

        <TextField
          label="Monto límite"
          type="number"
          inputMode="decimal"
          error={errors.monto_limite?.message}
          {...register("monto_limite", { required: "Ingresa un monto." })}
        />

        {errorGeneral && (
          <p className="rounded-xl bg-ios-red/10 px-3 py-2 text-sm text-ios-red">
            {errorGeneral}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Guardar cambios
        </Button>

        {confirmandoBorrado ? (
          <div className="rounded-2xl border border-ios-red/30 bg-ios-red/5 p-4 text-center">
            <p className="text-sm">¿Eliminar este presupuesto?</p>
            <div className="mt-3 flex gap-2">
              <div className="flex-1">
                <Button variant="ghost" type="button" onClick={() => setConfirmandoBorrado(false)}>
                  Cancelar
                </Button>
              </div>
              <div className="flex-1">
                <Button type="button" variant="danger" onClick={handleEliminar}>
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmandoBorrado(true)}
            className="flex w-full items-center justify-center gap-1.5 py-2 text-sm font-medium text-ios-red"
          >
            <Trash2 size={15} />
            Eliminar presupuesto
          </button>
        )}
      </form>
    </div>
  );
}
