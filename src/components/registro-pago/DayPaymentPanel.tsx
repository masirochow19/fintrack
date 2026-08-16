import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { RegistroPagoDia } from "@/services/registroPago.service";
import { formatCurrency } from "@/utils/format";
import { formatFechaCorta } from "@/utils/date";
import { Button } from "@/components/ui/Button";

interface DayPaymentPanelProps {
  fecha: string;
  registro: RegistroPagoDia | undefined;
  montoActual: number | null;
  onGuardarPagado: (monto: number) => Promise<void>;
  onGuardarNoPagado: () => Promise<void>;
  onQuitarMarca: () => Promise<void>;
}

export function DayPaymentPanel({
  fecha,
  registro,
  montoActual,
  onGuardarPagado,
  onGuardarNoPagado,
  onQuitarMarca,
}: DayPaymentPanelProps) {
  const [ingresandoMonto, setIngresandoMonto] = useState(false);
  const [monto, setMonto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  // al cambiar de día, cierra el input de monto que hubiera quedado abierto
  useEffect(() => {
    setIngresandoMonto(false);
    setMonto(montoActual ? String(montoActual) : "");
    setError(null);
  }, [fecha, montoActual]);

  async function confirmarPagado() {
    setError(null);
    const valor = Number(monto);
    if (Number.isNaN(valor) || valor <= 0) {
      setError("Ingresa un monto válido.");
      return;
    }
    setCargando(true);
    try {
      await onGuardarPagado(valor);
      setIngresandoMonto(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      setCargando(false);
    }
  }

  async function confirmarNoPagado() {
    setCargando(true);
    setError(null);
    try {
      await onGuardarNoPagado();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      setCargando(false);
    }
  }

  async function confirmarQuitarMarca() {
    setCargando(true);
    setError(null);
    try {
      await onQuitarMarca();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo quitar la marca.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="glass-card p-4">
      <p className="mb-3 text-sm font-semibold">{formatFechaCorta(fecha)}</p>

      {ingresandoMonto ? (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/70">
            Monto recibido
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              autoFocus
              placeholder="Ej: 25000"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="flex-1 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-[15px]
                outline-none transition-colors focus:border-ios-blue focus:ring-2 focus:ring-ios-blue/30
                dark:border-white/10 dark:bg-white/[0.06]"
            />
            <button
              type="button"
              onClick={() => void confirmarPagado()}
              disabled={cargando}
              className="rounded-2xl bg-ios-blue px-5 text-sm font-semibold text-white disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIngresandoMonto(false)}
            className="mt-2 text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/60"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <>
          {registro?.pagado && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-ios-green/10 px-3 py-2 text-sm font-medium text-ios-green">
              <CheckCircle2 size={16} />
              Pagado {montoActual ? `· ${formatCurrency(montoActual)}` : ""}
            </div>
          )}
          {registro && !registro.pagado && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-ios-red/10 px-3 py-2 text-sm font-medium text-ios-red">
              <XCircle size={16} />
              No pagado
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1">
              <Button type="button" onClick={() => setIngresandoMonto(true)} disabled={cargando}>
                {registro?.pagado ? "Cambiar monto" : "Marcar pagado"}
              </Button>
            </div>
            <div className="flex-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => void confirmarNoPagado()}
                disabled={cargando}
              >
                Marcar no pagado
              </Button>
            </div>
          </div>

          {registro && (
            <button
              type="button"
              onClick={() => void confirmarQuitarMarca()}
              disabled={cargando}
              className="mt-2 w-full text-center text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/60"
            >
              Quitar marca de este día
            </button>
          )}
        </>
      )}

      {error && <p className="mt-2 text-xs text-ios-red">{error}</p>}
    </div>
  );
}
