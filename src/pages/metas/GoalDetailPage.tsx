import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { PiggyBank, Trash2, X } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { CelebrationOverlay } from "@/components/metas/CelebrationOverlay";
import { useMeta } from "@/hooks/useMetas";
import {
  actualizarMeta,
  agregarAporte,
  eliminarMeta,
} from "@/services/metas.service";
import { metaSchema, type MetaFormValues } from "@/utils/validation/metaSchema";
import { formatCurrency } from "@/utils/format";
import { diasRestantes } from "@/utils/date";

export function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const meta = useMeta(id);

  const [montoAporte, setMontoAporte] = useState("");
  const [aportando, setAportando] = useState(false);
  const [errorAporte, setErrorAporte] = useState<string | null>(null);
  const [celebrando, setCelebrando] = useState(false);

  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MetaFormValues>({
    resolver: zodResolver(metaSchema),
    values: meta.data
      ? {
          nombre: meta.data.nombre,
          monto_objetivo: String(meta.data.monto_objetivo),
          fecha_limite: meta.data.fecha_limite ?? "",
        }
      : undefined,
  });

  async function invalidar() {
    await queryClient.invalidateQueries({ queryKey: ["metas"] });
    await queryClient.invalidateQueries({ queryKey: ["meta", id] });
  }

  async function handleAgregarAporte() {
    if (!id) return;
    setErrorAporte(null);
    const monto = Number(montoAporte);
    if (Number.isNaN(monto) || monto <= 0) {
      setErrorAporte("Ingresa un monto válido.");
      return;
    }
    setAportando(true);
    try {
      const actualizada = await agregarAporte(id, monto);
      await invalidar();
      setMontoAporte("");
      if (actualizada.completada) {
        setCelebrando(true);
        setTimeout(() => setCelebrando(false), 2200);
      }
    } catch (error) {
      setErrorAporte(
        error instanceof Error ? error.message : "No se pudo agregar el aporte.",
      );
    } finally {
      setAportando(false);
    }
  }

  async function onSubmitEdicion(values: MetaFormValues) {
    if (!id) return;
    setErrorGeneral(null);
    try {
      await actualizarMeta(id, {
        nombre: values.nombre.trim(),
        monto_objetivo: Number(values.monto_objetivo),
        fecha_limite: values.fecha_limite || null,
      });
      await invalidar();
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo actualizar la meta.",
      );
    }
  }

  async function handleEliminar() {
    if (!id) return;
    try {
      await eliminarMeta(id);
      await invalidar();
      navigate(-1);
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo eliminar la meta.",
      );
    }
  }

  const porcentaje = meta.data && meta.data.monto_objetivo > 0
    ? Math.min((meta.data.monto_actual / meta.data.monto_objetivo) * 100, 100)
    : 0;
  const dias = meta.data?.fecha_limite ? diasRestantes(meta.data.fecha_limite) : null;

  return (
    <div className="min-h-dvh safe-top safe-bottom">
      <CelebrationOverlay visible={celebrando} nombreMeta={meta.data?.nombre ?? ""} />

      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-surface-light/80 px-4 py-3 backdrop-blur-glass dark:border-white/10 dark:bg-surface-dark/80">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#3C3C43] dark:bg-white/10 dark:text-[#EBEBF5]/70"
        >
          <X size={16} />
        </button>
        <h1 className="text-[15px] font-semibold">Detalle de meta</h1>
        <div className="w-8" />
      </header>

      <div className="mx-auto max-w-lg space-y-5 p-4 pb-10">
        {meta.data && (
          <>
            <div className="glass-card p-6 text-center">
              <div
                className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-white ${
                  meta.data.completada ? "bg-ios-green" : "bg-ios-indigo"
                }`}
              >
                <PiggyBank size={26} />
              </div>
              <h2 className="text-lg font-semibold">{meta.data.nombre}</h2>
              <p className="mt-1 text-2xl font-bold">
                {formatCurrency(meta.data.monto_actual)}
                <span className="text-base font-medium text-[#3C3C43] dark:text-[#EBEBF5]/60">
                  {" "}
                  / {formatCurrency(meta.data.monto_objetivo)}
                </span>
              </p>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className={`h-full rounded-full transition-all ${
                    meta.data.completada ? "bg-ios-green" : "bg-ios-indigo"
                  }`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-[#3C3C43] dark:text-[#EBEBF5]/60">
                {porcentaje.toFixed(0)}% completado
                {meta.data.fecha_limite && !meta.data.completada && (
                  <>
                    {" "}
                    ·{" "}
                    {dias !== null && dias >= 0 ? `Vence en ${dias} días` : "Fecha vencida"}
                  </>
                )}
              </p>
            </div>

            {!meta.data.completada && (
              <div className="glass-card p-4">
                <label className="mb-1.5 block text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/70">
                  Agregar aporte
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="Monto"
                    value={montoAporte}
                    onChange={(e) => setMontoAporte(e.target.value)}
                    className="flex-1 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-[15px]
                      outline-none transition-colors focus:border-ios-blue focus:ring-2 focus:ring-ios-blue/30
                      dark:border-white/10 dark:bg-white/[0.06]"
                  />
                  <button
                    type="button"
                    onClick={() => void handleAgregarAporte()}
                    disabled={aportando}
                    className="rounded-2xl bg-ios-blue px-5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Agregar
                  </button>
                </div>
                {errorAporte && <p className="mt-1.5 text-xs text-ios-red">{errorAporte}</p>}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmitEdicion)} className="space-y-4" noValidate>
              <p className="text-sm font-semibold">Editar meta</p>

              <TextField
                label="Nombre"
                error={errors.nombre?.message}
                {...register("nombre")}
              />
              <TextField
                label="Monto objetivo"
                type="number"
                inputMode="decimal"
                error={errors.monto_objetivo?.message}
                {...register("monto_objetivo")}
              />
              <TextField
                label="Fecha límite"
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
                Guardar cambios
              </Button>
            </form>

            {confirmandoBorrado ? (
              <div className="rounded-2xl border border-ios-red/30 bg-ios-red/5 p-4 text-center">
                <p className="text-sm">¿Eliminar esta meta de ahorro?</p>
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
                Eliminar meta
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
