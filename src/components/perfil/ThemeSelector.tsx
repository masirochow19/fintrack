import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const OPCIONES = [
  { value: "light" as const, label: "Claro", icon: Sun },
  { value: "dark" as const, label: "Oscuro", icon: Moon },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex rounded-2xl bg-black/5 p-1 dark:bg-white/10">
      {OPCIONES.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-medium transition-all ${theme === value
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