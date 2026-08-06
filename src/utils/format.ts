/** Formatea un monto como moneda. Por defecto CLP (sin decimales, como Chile). */
export function formatCurrency(monto: number, moneda: string = "CLP"): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: moneda === "CLP" ? 0 : 2,
  }).format(monto);
}

/** Formatea una variación porcentual, ej. +12.4% / -8.1% */
export function formatPorcentaje(valor: number): string {
  const signo = valor > 0 ? "+" : "";
  return `${signo}${valor.toFixed(1)}%`;
}

/** % de cambio entre dos valores. Si el anterior es 0, evita división por 0. */
export function calcularVariacion(actual: number, anterior: number): number {
  if (anterior === 0) return actual === 0 ? 0 : 100;
  return ((actual - anterior) / anterior) * 100;
}
