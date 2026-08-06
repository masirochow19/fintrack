import type { TipoMovimiento } from "@/types/database.types";

export interface MovimientoConRelaciones {
  id: string;
  tipo: TipoMovimiento;
  monto: number;
  descripcion: string | null;
  fecha: string;
  notas: string | null;
  categoria: { id: string; nombre: string; color: string; icono: string } | null;
  metodo_pago: { id: string; nombre: string } | null;
}

export interface ResumenPeriodo {
  ingresos: number;
  gastos: number;
}

export interface GastoPorCategoria {
  categoria_id: string;
  categoria_nombre: string;
  color: string;
  icono: string;
  total: number;
}

export interface ResumenMensual {
  anio: number;
  mes: number;
  ingresos: number;
  gastos: number;
}

export interface PresupuestoConGasto {
  id: string;
  categoria_id: string | null;
  categoria_nombre: string | null;
  categoria_color: string | null;
  categoria_icono: string | null;
  monto_limite: number;
  gastado: number;
}
