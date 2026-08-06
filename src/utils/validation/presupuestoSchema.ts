import { z } from "zod";

export const presupuestoSchema = z.object({
  categoria_id: z.string().min(1, "Selecciona una categoría."),
  monto_limite: z
    .string()
    .min(1, "Ingresa un monto.")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, {
      message: "El monto debe ser mayor a 0.",
    }),
});

export type PresupuestoFormValues = z.infer<typeof presupuestoSchema>;

/** Sentinel usado en el <select> para representar el presupuesto general
 * (categoria_id null) sin pelear con el tipado de string del form. */
export const CATEGORIA_GENERAL = "general";
