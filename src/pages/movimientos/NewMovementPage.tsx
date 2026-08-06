import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { TipoSegmentedControl } from "@/components/movimientos/TipoSegmentedControl";
import { CategoriaPicker } from "@/components/movimientos/CategoriaPicker";
import { MetodoPagoSelect } from "@/components/movimientos/MetodoPagoSelect";
import { PhotoUploadField } from "@/components/movimientos/PhotoUploadField";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { useCategorias, useMetodosPago } from "@/hooks/useCatalogos";
import {
  movimientoSchema,
  type MovimientoFormValues,
} from "@/utils/validation/movimientoSchema";
import { crearMovimiento, subirAdjunto } from "@/services/movimientos.service";
import { toISODate } from "@/utils/date";
import type { TipoMovimiento } from "@/types/database.types";

export function NewMovementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MovimientoFormValues>({
    resolver: zodResolver(movimientoSchema),
    defaultValues: {
      tipo: "gasto",
      fecha: toISODate(new Date()),
      categoria_id: null,
      metodo_pago_id: null,
    },
  });

  const tipo = watch("tipo");
  const categoriaId = watch("categoria_id");
  const metodoPagoId = watch("metodo_pago_id");

  const categorias = useCategorias(tipo === "transferencia" ? undefined : tipo);
  const metodosPago = useMetodosPago();

  function handleTipoChange(nuevoTipo: TipoMovimiento) {
    setValue("tipo", nuevoTipo);
    setValue("categoria_id", null); // la categoría depende del tipo, se limpia al cambiar
  }

  async function onSubmit(values: MovimientoFormValues) {
    setErrorGeneral(null);
    try {
      const { id } = await crearMovimiento({
        tipo: values.tipo,
        monto: values.monto,
        categoria_id: values.tipo === "transferencia" ? null : (values.categoria_id ?? null),
        metodo_pago_id: values.metodo_pago_id ?? null,
        descripcion: values.descripcion?.trim() || null,
        fecha: values.fecha,
        notas: values.notas?.trim() || null,
      });

      if (archivo) {
        await subirAdjunto(id, archivo);
      }

      await queryClient.invalidateQueries({ queryKey: ["saldo-actual"] });
      await queryClient.invalidateQueries({ queryKey: ["resumen-periodo"] });
      await queryClient.invalidateQueries({ queryKey: ["gastos-por-categoria"] });
      await queryClient.invalidateQueries({ queryKey: ["resumen-mensual"] });
      await queryClient.invalidateQueries({ queryKey: ["ultimos-movimientos"] });

      navigate("/", { replace: true });
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo guardar el movimiento.",
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
        <h1 className="text-[15px] font-semibold">Nuevo movimiento</h1>
        <div className="w-8" /> {/* balancea el botón izquierdo para centrar el título */}
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-5 p-4 pb-10" noValidate>
        <TipoSegmentedControl value={tipo} onChange={handleTipoChange} />

        <div className="text-center">
          <label className="mb-1 block text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/60">
            Monto
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="1"
            placeholder="0"
            className="w-full bg-transparent text-center text-4xl font-bold outline-none placeholder:text-black/20 dark:placeholder:text-white/20"
            {...register("monto")}
          />
          {errors.monto && (
            <p className="mt-1 text-xs text-ios-red">{errors.monto.message}</p>
          )}
        </div>

        {tipo !== "transferencia" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/70">
              Categoría
            </label>
            <CategoriaPicker
              categorias={categorias.data}
              isLoading={categorias.isLoading}
              value={categoriaId}
              onChange={(id) => setValue("categoria_id", id, { shouldValidate: true })}
              error={errors.categoria_id?.message}
            />
          </div>
        )}

        <TextField
          label="Descripción"
          placeholder="Ej: Almuerzo, Arriendo, Uber..."
          error={errors.descripcion?.message}
          {...register("descripcion")}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Fecha"
            type="date"
            error={errors.fecha?.message}
            {...register("fecha")}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/70">
              Método de pago
            </label>
            <MetodoPagoSelect
              metodos={metodosPago.data}
              isLoading={metodosPago.isLoading}
              value={metodoPagoId}
              onChange={(id) => setValue("metodo_pago_id", id)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/70">
            Notas
          </label>
          <textarea
            rows={3}
            placeholder="Notas adicionales (opcional)"
            className="w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-[15px]
              outline-none transition-colors placeholder:text-[#3C3C43]/40 focus:border-ios-blue
              focus:ring-2 focus:ring-ios-blue/30 dark:border-white/10 dark:bg-white/[0.06]
              dark:placeholder:text-[#EBEBF5]/30"
            {...register("notas")}
          />
          {errors.notas && <p className="mt-1.5 text-xs text-ios-red">{errors.notas.message}</p>}
        </div>

        <PhotoUploadField archivo={archivo} onChange={setArchivo} />

        {errorGeneral && (
          <p className="rounded-xl bg-ios-red/10 px-3 py-2 text-sm text-ios-red">
            {errorGeneral}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Guardar movimiento
        </Button>
      </form>
    </div>
  );
}
