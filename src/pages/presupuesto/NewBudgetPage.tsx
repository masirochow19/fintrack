import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { useCategorias } from "@/hooks/useCatalogos";
import { usePresupuestosConGasto } from "@/hooks/usePresupuestos";
import { crearPresupuesto } from "@/services/presupuestos.service";
import {
  CATEGORIA_GENERAL,
  presupuestoSchema,
  type PresupuestoFormValues,
} from "@/utils/validation/presupuestoSchema";
import { mesYAnioActual, nombreMes } from "@/utils/date";

export function NewBudgetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const { mes, anio } = (location.state as { mes?: number; anio?: number } | null) ?? {};
  const periodo = { mes: mes ?? mesYAnioActual().mes, anio: anio ?? mesYAnioActual().anio };

  const categoriasGasto = useCategorias("gasto");
  const presupuestosDelMes = usePresupuestosConGasto(periodo.mes, periodo.anio);

  const categoriasYaPresupuestadas = new Set(
    (presupuestosDelMes.data ?? []).map((p) => p.categoria_id).filter(Boolean),
  );
  const yaExisteGeneral = (presupuestosDelMes.data ?? []).some((p) => p.categoria_id === null);

  const categoriasDisponibles = useMemo(
    () => (categoriasGasto.data ?? []).filter((c) => !categoriasYaPresupuestadas.has(c.id)),
    [categoriasGasto.data, categoriasYaPresupuestadas],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PresupuestoFormValues>({
    resolver: zodResolver(presupuestoSchema),
    defaultValues: { categoria_id: "", monto_limite: "" },
  });

  async function onSubmit(values: PresupuestoFormValues) {
    setErrorGeneral(null);
    try {
      await crearPresupuesto({
        categoria_id: values.categoria_id === CATEGORIA_GENERAL ? null : values.categoria_id,
        monto_limite: Number(values.monto_limite),
        mes: periodo.mes,
        anio: periodo.anio,
      });
      await queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
      navigate(-1);
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo crear el presupuesto.",
      );
    }
  }

  const sinOpciones = categoriasDisponibles.length === 0 && yaExisteGeneral;

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
        <h1 className="text-[15px] font-semibold">Nuevo presupuesto</h1>
        <div className="w-8" />
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-5 p-4 pb-10" noValidate>
        <p className="text-center text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
          Para {nombreMes(periodo.mes)} {periodo.anio}
        </p>

        {sinOpciones ? (
          <p className="rounded-xl bg-black/5 px-3 py-3 text-center text-sm text-[#3C3C43] dark:bg-white/10 dark:text-[#EBEBF5]/70">
            Ya tienes un presupuesto para cada categoría de gasto (y el general)
            este mes.
          </p>
        ) : (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/70">
                Categoría
              </label>
              <select
                {...register("categoria_id")}
                className="w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-[15px]
                  outline-none transition-colors focus:border-ios-blue focus:ring-2 focus:ring-ios-blue/30
                  dark:border-white/10 dark:bg-white/[0.06]"
              >
                <option value="">Selecciona una categoría</option>
                {!yaExisteGeneral && (
                  <option value={CATEGORIA_GENERAL}>General (todos los gastos)</option>
                )}
                {categoriasDisponibles.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errors.categoria_id && (
                <p className="mt-1.5 text-xs text-ios-red">{errors.categoria_id.message}</p>
              )}
            </div>

            <TextField
              label="Monto límite"
              type="number"
              inputMode="decimal"
              placeholder="Ej: 200000"
              error={errors.monto_limite?.message}
              {...register("monto_limite")}
            />

            {errorGeneral && (
              <p className="rounded-xl bg-ios-red/10 px-3 py-2 text-sm text-ios-red">
                {errorGeneral}
              </p>
            )}

            <Button type="submit" isLoading={isSubmitting}>
              Crear presupuesto
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
