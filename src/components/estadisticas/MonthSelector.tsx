import { ChevronLeft, ChevronRight } from "lucide-react";
import { esMesActual, mesAnterior, nombreMes } from "@/utils/date";

interface MonthSelectorProps {
  anio: number;
  mes: number;
  onChange: (anio: number, mes: number) => void;
}

export function MonthSelector({ anio, mes, onChange }: MonthSelectorProps) {
  const esActual = esMesActual(anio, mes);

  function irAlMesAnterior() {
    const anterior = mesAnterior(anio, mes);
    onChange(anterior.anio, anterior.mes);
  }

  function irAlMesSiguiente() {
    if (esActual) return; // no se navega al futuro
    const siguiente = mes === 12 ? { anio: anio + 1, mes: 1 } : { anio, mes: mes + 1 };
    onChange(siguiente.anio, siguiente.mes);
  }

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={irAlMesAnterior}
        aria-label="Mes anterior"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#3C3C43] dark:bg-white/10 dark:text-[#EBEBF5]/70"
      >
        <ChevronLeft size={16} />
      </button>

      <p className="text-sm font-semibold">
        {nombreMes(mes)} {anio}
      </p>

      <button
        type="button"
        onClick={irAlMesSiguiente}
        disabled={esActual}
        aria-label="Mes siguiente"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#3C3C43] disabled:opacity-30 dark:bg-white/10 dark:text-[#EBEBF5]/70"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
