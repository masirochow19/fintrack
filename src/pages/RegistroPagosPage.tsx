import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarCheck, CalendarX } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { MonthSelector } from "@/components/estadisticas/MonthSelector";
import { PaymentCalendarGrid } from "@/components/registro-pago/PaymentCalendarGrid";
import { DayPaymentPanel } from "@/components/registro-pago/DayPaymentPanel";
import { useRegistrosPagoDelMes } from "@/hooks/useRegistroPago";
import {
  marcarDiaNoPagado,
  marcarDiaPagado,
  quitarMarcaDelDia,
  type RegistroPagoDia,
} from "@/services/registroPago.service";
import { mesYAnioActual, obtenerDiasCalendario, toISODate } from "@/utils/date";
import { formatCurrency } from "@/utils/format";

export function RegistroPagosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hoyInfo = mesYAnioActual();
  const hoyISO = toISODate(new Date());

  const [anio, setAnio] = useState(hoyInfo.anio);
  const [mes, setMes] = useState(hoyInfo.mes);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoyISO);

  const registros = useRegistrosPagoDelMes(anio, mes);
  const dias = useMemo(() => obtenerDiasCalendario(anio, mes), [anio, mes]);

  const registrosPorFecha = useMemo(() => {
    const mapa: Record<string, RegistroPagoDia> = {};
    for (const r of registros.data ?? []) mapa[r.fecha] = r;
    return mapa;
  }, [registros.data]);

  const diasPagados = (registros.data ?? []).filter((r) => r.pagado).length;
  const diasNoPagados = (registros.data ?? []).filter((r) => !r.pagado).length;
  const totalPagado = (registros.data ?? []).reduce((acc, r) => acc + (r.monto ?? 0), 0);

  function handleCambioMes(nuevoAnio: number, nuevoMes: number) {
    setAnio(nuevoAnio);
    setMes(nuevoMes);
    setFechaSeleccionada(toISODate(new Date(nuevoAnio, nuevoMes - 1, 1)));
  }

  async function invalidarTodo() {
    await queryClient.invalidateQueries({ queryKey: ["registro-pago"] });
    await queryClient.invalidateQueries({ queryKey: ["saldo-actual"] });
    await queryClient.invalidateQueries({ queryKey: ["resumen-periodo"] });
    await queryClient.invalidateQueries({ queryKey: ["resumen-mensual"] });
    await queryClient.invalidateQueries({ queryKey: ["ultimos-movimientos"] });
    await queryClient.invalidateQueries({ queryKey: ["movimientos-mes"] });
  }

  const registroSeleccionado = registrosPorFecha[fechaSeleccionada];

  return (
    <div className="min-h-dvh safe-top safe-bottom">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-surface-light/80 px-4 py-3 backdrop-blur-glass dark:border-white/10 dark:bg-surface-dark/80">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#3C3C43] dark:bg-white/10 dark:text-[#EBEBF5]/70"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-[15px] font-semibold">Días pagados</h1>
        <div className="w-8" />
      </header>

      <div className="mx-auto max-w-lg space-y-4 p-4 pb-6">
        <div className="glass-card p-4">
          <MonthSelector anio={anio} mes={mes} onChange={handleCambioMes} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3 text-center">
            <CalendarCheck size={16} className="mx-auto mb-1 text-ios-green" />
            <p className="text-lg font-bold">{diasPagados}</p>
            <p className="text-[11px] text-[#3C3C43] dark:text-[#EBEBF5]/60">Pagados</p>
          </div>
          <div className="glass-card p-3 text-center">
            <CalendarX size={16} className="mx-auto mb-1 text-ios-red" />
            <p className="text-lg font-bold">{diasNoPagados}</p>
            <p className="text-[11px] text-[#3C3C43] dark:text-[#EBEBF5]/60">No pagados</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="mt-[22px] text-sm font-bold leading-tight">
              {formatCurrency(totalPagado)}
            </p>
            <p className="text-[11px] text-[#3C3C43] dark:text-[#EBEBF5]/60">Total del mes</p>
          </div>
        </div>

        <PaymentCalendarGrid
          dias={dias}
          registrosPorFecha={registrosPorFecha}
          fechaSeleccionada={fechaSeleccionada}
          onSelect={setFechaSeleccionada}
          hoy={hoyISO}
        />

        <DayPaymentPanel
          fecha={fechaSeleccionada}
          registro={registroSeleccionado}
          montoActual={registroSeleccionado?.monto ?? null}
          onGuardarPagado={async (monto) => {
            await marcarDiaPagado(fechaSeleccionada, monto);
            await invalidarTodo();
          }}
          onGuardarNoPagado={async () => {
            await marcarDiaNoPagado(fechaSeleccionada);
            await invalidarTodo();
          }}
          onQuitarMarca={async () => {
            await quitarMarcaDelDia(fechaSeleccionada);
            await invalidarTodo();
          }}
        />
      </div>
    </div>
  );
}
