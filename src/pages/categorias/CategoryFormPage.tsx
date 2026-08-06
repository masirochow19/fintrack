import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, X } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/categorias/ColorPicker";
import { IconPicker } from "@/components/categorias/IconPicker";
import { useCategoria } from "@/hooks/useCatalogos";
import {
  categoriaSchema,
  type CategoriaFormValues,
} from "@/utils/validation/categoriaSchema";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
} from "@/services/categorias.service";
import { PALETA_COLORES } from "@/utils/colors";
import { ICONOS_CATEGORIA_DISPONIBLES } from "@/utils/icons";
import type { TipoCategoria } from "@/types/database.types";

export function CategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const esEdicion = Boolean(id);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const tipoInicial = (location.state as { tipo?: TipoCategoria } | null)?.tipo ?? "gasto";
  const categoriaExistente = useCategoria(id);

  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaFormValues>({
    resolver: zodResolver(categoriaSchema),
    values: categoriaExistente.data
      ? {
          nombre: categoriaExistente.data.nombre,
          tipo: categoriaExistente.data.tipo,
          color: categoriaExistente.data.color,
          icono: categoriaExistente.data.icono,
          limite_mensual: categoriaExistente.data.limite_mensual
            ? String(categoriaExistente.data.limite_mensual)
            : "",
        }
      : undefined,
    defaultValues: {
      nombre: "",
      tipo: tipoInicial,
      color: PALETA_COLORES[0],
      icono: ICONOS_CATEGORIA_DISPONIBLES[0],
      limite_mensual: "",
    },
  });

  const tipo = watch("tipo");
  const color = watch("color");
  const icono = watch("icono");

  async function invalidarCategorias() {
    await queryClient.invalidateQueries({ queryKey: ["categorias"] });
  }

  async function onSubmit(values: CategoriaFormValues) {
    setErrorGeneral(null);
    const input = {
      nombre: values.nombre.trim(),
      tipo: values.tipo,
      color: values.color,
      icono: values.icono,
      limite_mensual: values.limite_mensual ? Number(values.limite_mensual) : null,
    };

    try {
      if (esEdicion && id) {
        await actualizarCategoria(id, input);
      } else {
        await crearCategoria(input);
      }
      await invalidarCategorias();
      navigate(-1);
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo guardar la categoría.",
      );
    }
  }

  async function handleEliminar() {
    if (!id) return;
    setErrorGeneral(null);
    try {
      await eliminarCategoria(id);
      await invalidarCategorias();
      navigate(-1);
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo eliminar la categoría.",
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
        <h1 className="text-[15px] font-semibold">
          {esEdicion ? "Editar categoría" : "Nueva categoría"}
        </h1>
        <div className="w-8" />
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-5 p-4 pb-10" noValidate>
        <TipoSegmentedControlCategoria
          value={tipo}
          onChange={(nuevoTipo) => setValue("tipo", nuevoTipo)}
        />

        <TextField
          label="Nombre"
          placeholder="Ej: Mascotas"
          error={errors.nombre?.message}
          {...register("nombre")}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/70">
            Color
          </label>
          <ColorPicker value={color} onChange={(c) => setValue("color", c)} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/70">
            Ícono
          </label>
          <IconPicker
            value={icono}
            color={color}
            onChange={(i) => setValue("icono", i)}
          />
        </div>

        <TextField
          label="Límite mensual (opcional)"
          type="number"
          inputMode="decimal"
          placeholder="Ej: 150000"
          error={errors.limite_mensual?.message}
          {...register("limite_mensual")}
        />

        {errorGeneral && (
          <p className="rounded-xl bg-ios-red/10 px-3 py-2 text-sm text-ios-red">
            {errorGeneral}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          {esEdicion ? "Guardar cambios" : "Crear categoría"}
        </Button>

        {esEdicion && (
          <>
            {confirmandoBorrado ? (
              <div className="rounded-2xl border border-ios-red/30 bg-ios-red/5 p-4 text-center">
                <p className="text-sm">
                  ¿Eliminar esta categoría? Los movimientos ya registrados no se
                  borrarán, pero quedarán sin categoría.
                </p>
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
                Eliminar categoría
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
}

/** Segmented control acotado a ingreso/gasto (las categorías no aplican a transferencias). */
function TipoSegmentedControlCategoria({
  value,
  onChange,
}: {
  value: TipoCategoria;
  onChange: (tipo: TipoCategoria) => void;
}) {
  return (
    <div className="flex rounded-2xl bg-black/5 p-1 dark:bg-white/10">
      {(["gasto", "ingreso"] as const).map((opcion) => (
        <button
          key={opcion}
          type="button"
          onClick={() => onChange(opcion)}
          className={`flex-1 rounded-xl py-2 text-sm font-medium capitalize transition-all ${
            value === opcion
              ? "bg-white text-[#1C1C1E] shadow-sm dark:bg-[#3A3A3C] dark:text-white"
              : "text-[#3C3C43] dark:text-[#EBEBF5]/60"
          }`}
        >
          {opcion === "gasto" ? "Gasto" : "Ingreso"}
        </button>
      ))}
    </div>
  );
}
