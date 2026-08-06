import { supabase } from "@/services/supabase";

interface FilaExportacion {
  fecha: string;
  tipo: string;
  monto: number;
  categoria: string;
  metodo_pago: string;
  descripcion: string;
  notas: string;
}

function escaparCampoCSV(valor: string): string {
  if (valor.includes(",") || valor.includes('"') || valor.includes("\n")) {
    return `"${valor.replace(/"/g, '""')}"`;
  }
  return valor;
}

function construirCSV(filas: FilaExportacion[]): string {
  const encabezados = ["Fecha", "Tipo", "Monto", "Categoría", "Método de pago", "Descripción", "Notas"];
  const lineas = [encabezados.join(",")];

  for (const fila of filas) {
    lineas.push(
      [
        fila.fecha,
        fila.tipo,
        String(fila.monto),
        fila.categoria,
        fila.metodo_pago,
        fila.descripcion,
        fila.notas,
      ]
        .map(escaparCampoCSV)
        .join(","),
    );
  }

  return lineas.join("\n");
}

/** Trae todos los movimientos del usuario y dispara la descarga como CSV. */
export async function exportarMovimientosCSV(): Promise<void> {
  const { data, error } = await supabase
    .from("movimientos")
    .select(
      "fecha, tipo, monto, descripcion, notas, categorias(nombre), metodos_pago(nombre)",
    )
    .order("fecha", { ascending: false });

  if (error) throw error;

  const filas: FilaExportacion[] = ((data ?? []) as unknown as {
    fecha: string;
    tipo: string;
    monto: number;
    descripcion: string | null;
    notas: string | null;
    categorias: { nombre: string } | null;
    metodos_pago: { nombre: string } | null;
  }[]).map((fila) => ({
    fecha: fila.fecha,
    tipo: fila.tipo,
    monto: fila.monto,
    categoria: fila.categorias?.nombre ?? "",
    metodo_pago: fila.metodos_pago?.nombre ?? "",
    descripcion: fila.descripcion ?? "",
    notas: fila.notas ?? "",
  }));

  const csv = construirCSV(filas);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `fintrack-movimientos-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
