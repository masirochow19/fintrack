import { NOMBRES_DIA_SEMANA, type DiaCalendario } from "@/utils/date";
import type { RegistroPagoDia } from "@/services/registroPago.service";

interface PaymentCalendarGridProps {
  dias: DiaCalendario[];
  registrosPorFecha: Record<string, RegistroPagoDia>;
  fechaSeleccionada: string;
  onSelect: (fecha: string) => void;
  hoy: string;
}

export function PaymentCalendarGrid({
  dias,
  registrosPorFecha,
  fechaSeleccionada,
  onSelect,
  hoy,
}: PaymentCalendarGridProps) {
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
          const registro = registrosPorFecha[dia.fecha];

          let claseEstado = "hover:bg-black/5 dark:hover:bg-white/10";
          if (registro?.pagado) {
            claseEstado = "bg-ios-green/15 text-ios-green font-semibold";
          } else if (registro && !registro.pagado) {
            claseEstado = "bg-ios-red/15 text-ios-red font-semibold";
          } else if (esHoy) {
            claseEstado = "bg-ios-blue/10 font-semibold text-ios-blue";
          }

          return (
            <button
              key={dia.fecha}
              type="button"
              onClick={() => onSelect(dia.fecha)}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-[13px] transition-colors ${
                !dia.enMes ? "text-[#C7C7CC] dark:text-white/20" : ""
              } ${seleccionado ? "ring-2 ring-ios-blue" : ""} ${dia.enMes ? claseEstado : ""}`}
            >
              {dia.dia}
            </button>
          );
        })}
      </div>
    </div>
  );
}
