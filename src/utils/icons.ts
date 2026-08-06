import {
  Banknote,
  Car,
  Circle,
  CreditCard,
  Film,
  HeartPulse,
  Home,
  type LucideIcon,
  MoreHorizontal,
  PlusCircle,
  ShoppingBag,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

const ICONOS: Record<string, LucideIcon> = {
  "utensils-crossed": UtensilsCrossed,
  car: Car,
  home: Home,
  film: Film,
  "heart-pulse": HeartPulse,
  "shopping-bag": ShoppingBag,
  "more-horizontal": MoreHorizontal,
  wallet: Wallet,
  "plus-circle": PlusCircle,
  banknote: Banknote,
  "credit-card": CreditCard,
};

/** Devuelve el componente de ícono para el nombre guardado en la BD, con un
 * círculo genérico como respaldo para íconos que aún no están mapeados. */
export function obtenerIcono(nombre: string | null | undefined): LucideIcon {
  if (!nombre) return Circle;
  return ICONOS[nombre] ?? Circle;
}

export const ICONOS_CATEGORIA_DISPONIBLES = Object.keys(ICONOS);
