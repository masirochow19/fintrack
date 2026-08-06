import { z } from "zod";

export const movimientoSchema = z
  .object({
    tipo: z.enum(["ingreso", "gasto", "transferencia"]),
    monto: z.coerce
      .number({ invalid_type_error: "Ingresa un monto válido." })
      .positive("El monto debe ser mayor a 0."),
    categoria_id: z.string().nullable().optional(),
    metodo_pago_id: z.string().nullable().optional(),
    descripcion: z.string().max(120, "Máximo 120 caracteres.").optional(),
    fecha: z.string().min(1, "Selecciona una fecha."),
    notas: z.string().max(500, "Máximo 500 caracteres.").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo !== "transferencia" && !data.categoria_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona una categoría.",
        path: ["categoria_id"],
      });
    }
  });

export type MovimientoFormValues = z.infer<typeof movimientoSchema>;
