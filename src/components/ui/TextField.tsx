import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Muestra un botón para alternar visibilidad, pensado para contraseñas */
  isPassword?: boolean;
}

/**
 * Input de formulario reutilizable en toda la app (no solo Auth).
 * Se integra con react-hook-form vía `register(...)` gracias al forwardRef.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, isPassword, type, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [visible, setVisible] = useState(false);

    const resolvedType = isPassword ? (visible ? "text" : "password") : type;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-[#3C3C43] dark:text-[#EBEBF5]/70"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`w-full rounded-2xl border bg-white/70 dark:bg-white/[0.06] px-4 py-3 text-[15px]
              outline-none transition-colors placeholder:text-[#3C3C43]/40 dark:placeholder:text-[#EBEBF5]/30
              focus:border-ios-blue focus:ring-2 focus:ring-ios-blue/30
              ${error ? "border-ios-red" : "border-white/60 dark:border-white/10"}
              ${isPassword ? "pr-11" : ""}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8E8E93]"
              aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-ios-red">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";
