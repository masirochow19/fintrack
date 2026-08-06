import { Check } from "lucide-react";
import { PALETA_COLORES } from "@/utils/colors";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {PALETA_COLORES.map((color) => {
        const seleccionado = value === color;
        return (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            aria-label={`Color ${color}`}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-90"
            style={{ backgroundColor: color }}
          >
            {seleccionado && <Check size={16} className="text-white" strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
}
