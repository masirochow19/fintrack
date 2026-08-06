import type { MetodoPagoOpcion } from "@/services/metodosPago.service";

interface MetodoPagoSelectProps {
  metodos: MetodoPagoOpcion[] | undefined;
  isLoading: boolean;
  value: string | null | undefined;
  onChange: (metodoPagoId: string) => void;
}

export function MetodoPagoSelect({
  metodos,
  isLoading,
  value,
  onChange,
}: MetodoPagoSelectProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
      className="w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-[15px]
        outline-none transition-colors focus:border-ios-blue focus:ring-2 focus:ring-ios-blue/30
        dark:border-white/10 dark:bg-white/[0.06]"
    >
      <option value="">Sin especificar</option>
      {metodos?.map((metodo) => (
        <option key={metodo.id} value={metodo.id}>
          {metodo.nombre}
        </option>
      ))}
    </select>
  );
}
