import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { crearMeta } from "@/services/metas.service";
import { metaSchema, type MetaFormValues } from "@/utils/validation/metaSchema";

export function NewGoalPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MetaFormValues>({
    resolver: zodResolver(metaSchema),
    defaultValues: { nombre: "", monto_objetivo: "", fecha_limite: "" },
  });

  async function onSubmit(values: MetaFormValues) {
    setErrorGeneral(null);
    try {
      await crearMeta({
        nombre: values.nombre.trim(),
        monto_objetivo: Number(values.monto_objetivo),
        fecha_limite: values.fecha_limite || null,
      });
      await queryClient.invalidateQueries({ queryKey: ["metas"] });
      navigate(-1);
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo crear la meta.",
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
        <h1 className="text-[15px] font-semibold">Nueva meta</h1>
        <div className="w-8" />
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-5 p-4 pb-10" noValidate>
        <TextField
          label="Nombre"
          placeholder="Ej: Vacaciones, Notebook nuevo..."
          error={errors.nombre?.message}
          {...register("nombre")}
        />

        <TextField
          label="Monto objetivo"
          type="number"
          inputMode="decimal"
          placeholder="Ej: 500000"
          error={errors.monto_objetivo?.message}
          {...register("monto_objetivo")}
        />

        <TextField
          label="Fecha límite (opcional)"
          type="date"
          error={errors.fecha_limite?.message}
          {...register("fecha_limite")}
        />

        {errorGeneral && (
          <p className="rounded-xl bg-ios-red/10 px-3 py-2 text-sm text-ios-red">
            {errorGeneral}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Crear meta
        </Button>
      </form>
    </div>
  );
}
