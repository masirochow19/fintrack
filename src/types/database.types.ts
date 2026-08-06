/**
 * Tipos de la base de datos de FinTrack.
 *
 * Escritos a mano para que coincidan con
 * supabase/migrations/0001_init_schema.sql. Cuando tengas la CLI de Supabase
 * conectada al proyecto, puedes regenerarlos con:
 *
 *   supabase gen types typescript --project-id <tu-project-ref> > src/types/database.types.ts
 */

export type Tema = "claro" | "oscuro" | "sistema";
export type TipoMovimiento = "ingreso" | "gasto" | "transferencia";
export type TipoCategoria = "ingreso" | "gasto";
export type TipoMetodoPago = "efectivo" | "debito" | "credito" | "transferencia" | "otro";

export interface Database {
  public: {
    Views: Record<string, never>;
    Tables: {
      usuarios: {
        Row: {
          id: string;
          nombre: string | null;
          email: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database["public"]["Tables"]["usuarios"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["usuarios"]["Row"]>;
      };
      configuracion_usuario: {
        Row: {
          usuario_id: string;
          tema: Tema;
          moneda: string;
          notificaciones_activas: boolean;
          recordatorios_activos: boolean;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database["public"]["Tables"]["configuracion_usuario"]["Row"]> & {
          usuario_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["configuracion_usuario"]["Row"]>;
      };
      metodos_pago: {
        Row: {
          id: string;
          usuario_id: string;
          nombre: string;
          tipo: TipoMetodoPago;
          icono: string | null;
          color: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database["public"]["Tables"]["metodos_pago"]["Row"]> & {
          usuario_id: string;
          nombre: string;
        };
        Update: Partial<Database["public"]["Tables"]["metodos_pago"]["Row"]>;
      };
      categorias: {
        Row: {
          id: string;
          usuario_id: string;
          nombre: string;
          tipo: TipoCategoria;
          color: string;
          icono: string;
          limite_mensual: number | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database["public"]["Tables"]["categorias"]["Row"]> & {
          usuario_id: string;
          nombre: string;
          tipo: TipoCategoria;
        };
        Update: Partial<Database["public"]["Tables"]["categorias"]["Row"]>;
      };
      movimientos: {
        Row: {
          id: string;
          usuario_id: string;
          tipo: TipoMovimiento;
          monto: number;
          categoria_id: string | null;
          metodo_pago_id: string | null;
          descripcion: string | null;
          fecha: string;
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database["public"]["Tables"]["movimientos"]["Row"]> & {
          usuario_id: string;
          tipo: TipoMovimiento;
          monto: number;
        };
        Update: Partial<Database["public"]["Tables"]["movimientos"]["Row"]>;
      };
      adjuntos: {
        Row: {
          id: string;
          movimiento_id: string;
          usuario_id: string;
          storage_path: string;
          tipo_mime: string | null;
          tamanio_bytes: number | null;
          created_at: string;
        };
        Relationships: [];
        Insert: Partial<Database["public"]["Tables"]["adjuntos"]["Row"]> & {
          movimiento_id: string;
          usuario_id: string;
          storage_path: string;
        };
        Update: Partial<Database["public"]["Tables"]["adjuntos"]["Row"]>;
      };
      presupuestos: {
        Row: {
          id: string;
          usuario_id: string;
          categoria_id: string | null;
          monto_limite: number;
          mes: number;
          anio: number;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database["public"]["Tables"]["presupuestos"]["Row"]> & {
          usuario_id: string;
          monto_limite: number;
          mes: number;
          anio: number;
        };
        Update: Partial<Database["public"]["Tables"]["presupuestos"]["Row"]>;
      };
      metas: {
        Row: {
          id: string;
          usuario_id: string;
          nombre: string;
          monto_objetivo: number;
          monto_actual: number;
          fecha_limite: string | null;
          completada: boolean;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database["public"]["Tables"]["metas"]["Row"]> & {
          usuario_id: string;
          nombre: string;
          monto_objetivo: number;
        };
        Update: Partial<Database["public"]["Tables"]["metas"]["Row"]>;
      };
    };
    Functions: {
      obtener_saldo_actual: {
        Args: Record<string, never>;
        Returns: number;
      };
      obtener_resumen_periodo: {
        Args: { p_desde: string; p_hasta: string };
        Returns: { ingresos: number; gastos: number }[];
      };
      obtener_gastos_por_categoria: {
        Args: { p_desde: string; p_hasta: string };
        Returns: {
          categoria_id: string;
          categoria_nombre: string;
          color: string;
          icono: string;
          total: number;
        }[];
      };
      obtener_resumen_mensual: {
        Args: { p_meses: number };
        Returns: { anio: number; mes: number; ingresos: number; gastos: number }[];
      };
      obtener_resumen_anual: {
        Args: { p_anio: number };
        Returns: { ingresos: number; gastos: number }[];
      };
      obtener_presupuestos_con_gasto: {
        Args: { p_mes: number; p_anio: number };
        Returns: {
          id: string;
          categoria_id: string | null;
          categoria_nombre: string | null;
          categoria_color: string | null;
          categoria_icono: string | null;
          monto_limite: number;
          gastado: number;
        }[];
      };
      agregar_aporte_meta: {
        Args: { p_meta_id: string; p_monto: number };
        Returns: Database["public"]["Tables"]["metas"]["Row"];
      };
    };
  };
}
