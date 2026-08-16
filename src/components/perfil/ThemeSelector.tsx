import { Moon, Smartphone, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import type { Tema } from "@/types/database.types";

const OPCIONES: { value: Tema; label: string; icon: typeof Sun }[] = [
  { value: "claro", label: "Claro", icon: Sun },
  { value: "oscuro", label: "Oscuro", icon: Moon },
  { value: "sistema", label: "Sistema", icon: Smartphone },
];

export function ThemeSelector() {
  const { preferencia, setPreferencia } = useTheme();

  return (
    <div className="flex rounded-2xl bg-black/5 p-1 dark:bg-white/10">
      {OPCIONES.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setPreferencia(value)}
          className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-medium transition-all ${
            preferencia === value
              ? "bg-white text-[#1C1C1E] shadow-sm dark:bg-[#3A3A3C] dark:text-white"
              : "text-[#3C3C43] dark:text-[#EBEBF5]/60"
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}
