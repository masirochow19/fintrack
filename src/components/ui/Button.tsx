import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "ghost" | "danger";
  children: ReactNode;
}

export function Button({
  isLoading,
  variant = "primary",
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-ios-blue text-white shadow-sm hover:brightness-105",
    ghost:
      "bg-black/5 dark:bg-white/10 text-[#1C1C1E] dark:text-white hover:bg-black/10 dark:hover:bg-white/20",
    danger: "bg-ios-red text-white shadow-sm hover:brightness-105",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}
