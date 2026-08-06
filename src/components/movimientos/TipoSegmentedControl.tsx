import type { TipoMovimiento } from "@/types/database.types";

interface TipoSegmentedControlProps {
  value: TipoMovimiento;
  onChange: (tipo: TipoMovimiento) => void;
}

const OPCIONES: { value: TipoMovimiento; label: string }[] = [
  { value: "gasto", label: "Gasto" },
  { value: "ingreso", label: "Ingreso" },
  { value: "transferencia", label: "Transferencia" },
];

export function TipoSegmentedControl({ value, onChange }: TipoSegmentedControlProps) {
  return (
    <div className="flex rounded-2xl bg-black/5 p-1 dark:bg-white/10">
      {OPCIONES.map((opcion) => (
        <button
          key={opcion.value}
          type="button"
          onClick={() => onChange(opcion.value)}
          className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all ${
            value === opcion.value
              ? "bg-white text-[#1C1C1E] shadow-sm dark:bg-[#3A3A3C] dark:text-white"
              : "text-[#3C3C43] dark:text-[#EBEBF5]/60"
          }`}
        >
          {opcion.label}
        </button>
      ))}
    </div>
  );
}
