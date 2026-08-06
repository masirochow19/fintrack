import { NOMBRES_DIA_SEMANA, type DiaCalendario } from "@/utils/date";

interface IndicadorDia {
  tieneIngreso: boolean;
  tieneGasto: boolean;
}

interface CalendarGridProps {
  dias: DiaCalendario[];
  indicadores: Record<string, IndicadorDia>;
  fechaSeleccionada: string;
  onSelect: (fecha: string) => void;
  hoy: string;
}

export function CalendarGrid({
  dias,
  indicadores,
  fechaSeleccionada,
  onSelect,
  hoy,
}: CalendarGridProps) {
  return (
    <div className="glass-card p-3">
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[#8E8E93]">
        {NOMBRES_DIA_SEMANA.map((nombre) => (
          <div key={nombre} className="py-1">
            {nombre}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dias.map((dia) => {
          const seleccionado = dia.fecha === fechaSeleccionada;
          const esHoy = dia.fecha === hoy;
          const indicador = indicadores[dia.fecha];

          return (
            <button
              key={dia.fecha}
              type="button"
              onClick={() => onSelect(dia.fecha)}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-[13px] transition-colors ${
                !dia.enMes ? "text-[#C7C7CC] dark:text-white/20" : ""
              } ${
                seleccionado
                  ? "bg-ios-blue text-white font-semibold"
                  : esHoy
                    ? "bg-ios-blue/10 font-semibold text-ios-blue"
                    : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {dia.dia}
              {indicador && (
                <span className="mt-0.5 flex gap-0.5">
                  {indicador.tieneIngreso && (
                    <span
                      className={`h-1 w-1 rounded-full ${
                        seleccionado ? "bg-white" : "bg-ios-green"
                      }`}
                    />
                  )}
                  {indicador.tieneGasto && (
                    <span
                      className={`h-1 w-1 rounded-full ${
                        seleccionado ? "bg-white" : "bg-ios-red"
                      }`}
                    />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
