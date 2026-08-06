import { ICONOS_CATEGORIA_DISPONIBLES, obtenerIcono } from "@/utils/icons";

interface IconPickerProps {
  value: string;
  color: string;
  onChange: (icono: string) => void;
}

export function IconPicker({ value, color, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {ICONOS_CATEGORIA_DISPONIBLES.map((nombreIcono) => {
        const Icono = obtenerIcono(nombreIcono);
        const seleccionado = value === nombreIcono;
        return (
          <button
            key={nombreIcono}
            type="button"
            onClick={() => onChange(nombreIcono)}
            aria-label={`Ícono ${nombreIcono}`}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors ${
              seleccionado
                ? "border-transparent text-white"
                : "border-white/60 bg-white/50 text-[#3C3C43] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#EBEBF5]/70"
            }`}
            style={seleccionado ? { backgroundColor: color } : undefined}
          >
            <Icono size={18} />
          </button>
        );
      })}
    </div>
  );
}
