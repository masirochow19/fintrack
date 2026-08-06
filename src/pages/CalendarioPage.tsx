import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MonthSelector } from "@/components/estadisticas/MonthSelector";
import { CalendarGrid } from "@/components/calendario/CalendarGrid";
import { RecentMovements } from "@/components/dashboard/RecentMovements";
import { useMovimientosDelMes } from "@/hooks/useCalendario";
import { mesYAnioActual, obtenerDiasCalendario, toISODate, formatFechaCorta } from "@/utils/date";

export function CalendarioPage() {
  const navigate = useNavigate();
  const hoyInfo = mesYAnioActual();
  const hoyISO = toISODate(new Date());

  const [anio, setAnio] = useState(hoyInfo.anio);
  const [mes, setMes] = useState(hoyInfo.mes);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoyISO);

  const movimientos = useMovimientosDelMes(anio, mes);
  const dias = useMemo(() => obtenerDiasCalendario(anio, mes), [anio, mes]);

  const indicadores = useMemo(() => {
    const mapa: Record<string, { tieneIngreso: boolean; tieneGasto: boolean }> = {};
    for (const mov of movimientos.data ?? []) {
      const actual = mapa[mov.fecha] ?? { tieneIngreso: false, tieneGasto: false };
      if (mov.tipo === "ingreso") actual.tieneIngreso = true;
      if (mov.tipo === "gasto") actual.tieneGasto = true;
      mapa[mov.fecha] = actual;
    }
    return mapa;
  }, [movimientos.data]);

  const movimientosDelDia = (movimientos.data ?? []).filter(
    (m) => m.fecha === fechaSeleccionada,
  );

  function handleCambioMes(nuevoAnio: number, nuevoMes: number) {
    setAnio(nuevoAnio);
    setMes(nuevoMes);
    // si el día seleccionado no cae en el nuevo mes, selecciona el 1ro
    setFechaSeleccionada(toISODate(new Date(nuevoAnio, nuevoMes - 1, 1)));
  }

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
        <h1 className="text-[15px] font-semibold">Calendario</h1>
        <div className="w-8" />
      </header>

      <div className="mx-auto max-w-lg space-y-4 p-4 pb-6">
        <div className="glass-card p-4">
          <MonthSelector anio={anio} mes={mes} onChange={handleCambioMes} />
        </div>

        <CalendarGrid
          dias={dias}
          indicadores={indicadores}
          fechaSeleccionada={fechaSeleccionada}
          onSelect={setFechaSeleccionada}
          hoy={hoyISO}
        />

        <div>
          <p className="mb-2 text-sm font-semibold">
            {formatFechaCorta(fechaSeleccionada)}
          </p>
          <RecentMovements movimientos={movimientosDelDia} isLoading={movimientos.isLoading} />
        </div>
      </div>
    </div>
  );
}
