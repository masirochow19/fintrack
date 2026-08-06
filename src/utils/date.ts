const NOMBRES_MES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const NOMBRES_MES_CORTO = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

/** Formatea una fecha local como YYYY-MM-DD sin desfases de zona horaria. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Rango [primer día, último día] del mes dado (mes es 1-12). */
export function rangoDelMes(anio: number, mes: number): { desde: string; hasta: string } {
  const inicio = new Date(anio, mes - 1, 1);
  const fin = new Date(anio, mes, 0);
  return { desde: toISODate(inicio), hasta: toISODate(fin) };
}

export function mesAnterior(anio: number, mes: number): { anio: number; mes: number } {
  return mes === 1 ? { anio: anio - 1, mes: 12 } : { anio, mes: mes - 1 };
}

export function mesYAnioActual(): { anio: number; mes: number } {
  const ahora = new Date();
  return { anio: ahora.getFullYear(), mes: ahora.getMonth() + 1 };
}

/** Cantidad de días del mes dado (mes es 1-12). */
export function diasEnMes(anio: number, mes: number): number {
  return new Date(anio, mes, 0).getDate();
}

/** Si el mes es el actual, cuántos días han pasado hasta hoy; si es un mes
 * pasado, todos sus días; nunca mayor a los días reales del mes. */
export function diasTranscurridosEnMes(anio: number, mes: number): number {
  const { anio: anioActual, mes: mesActual } = mesYAnioActual();
  if (anio === anioActual && mes === mesActual) {
    return new Date().getDate();
  }
  return diasEnMes(anio, mes);
}

export function esMesActual(anio: number, mes: number): boolean {
  const actual = mesYAnioActual();
  return anio === actual.anio && mes === actual.mes;
}

export interface DiaCalendario {
  fecha: string;
  dia: number;
  enMes: boolean;
}

/** Genera la grilla de días para un mes calendario (semana empieza lunes),
 * incluyendo los días de relleno de los meses adyacentes para completar
 * semanas completas. */
export function obtenerDiasCalendario(anio: number, mes: number): DiaCalendario[] {
  const primerDia = new Date(anio, mes - 1, 1);
  const diasDelMes = diasEnMes(anio, mes);

  // JS: getDay() 0=domingo..6=sábado. Convertimos a semana que empieza lunes (0=lunes..6=domingo).
  const offsetInicio = (primerDia.getDay() + 6) % 7;

  const dias: DiaCalendario[] = [];

  for (let i = offsetInicio; i > 0; i--) {
    const d = new Date(anio, mes - 1, 1 - i);
    dias.push({ fecha: toISODate(d), dia: d.getDate(), enMes: false });
  }

  for (let d = 1; d <= diasDelMes; d++) {
    const fecha = new Date(anio, mes - 1, d);
    dias.push({ fecha: toISODate(fecha), dia: d, enMes: true });
  }

  while (dias.length % 7 !== 0) {
    const ultimaFecha = dias[dias.length - 1]!.fecha;
    const [y, m, d] = ultimaFecha.split("-").map(Number);
    const siguiente = new Date(y!, m! - 1, d! + 1);
    dias.push({
      fecha: toISODate(siguiente),
      dia: siguiente.getDate(),
      enMes: siguiente.getMonth() === mes - 1,
    });
  }

  return dias;
}

export const NOMBRES_DIA_SEMANA = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

export function nombreMes(mes: number): string {
  return NOMBRES_MES[mes - 1] ?? "";
}

export function nombreMesCorto(mes: number): string {
  return NOMBRES_MES_CORTO[mes - 1] ?? "";
}

/** Convierte "YYYY-MM-DD" a un formato corto legible, ej. "3 ago". */
export function formatFechaCorta(fechaISO: string): string {
  const [y, m, d] = fechaISO.split("-").map(Number);
  if (!y || !m || !d) return fechaISO;
  const fecha = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short" }).format(fecha);
}

/** Días restantes hasta la fecha (negativo si ya pasó). */
export function diasRestantes(fechaISO: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [y, m, d] = fechaISO.split("-").map(Number);
  if (!y || !m || !d) return 0;
  const fecha = new Date(y, m - 1, d);
  const diffMs = fecha.getTime() - hoy.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
