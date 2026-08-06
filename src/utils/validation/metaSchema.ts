import { z } from "zod";

export const metaSchema = z.object({
  nombre: z.string().min(2, "Ingresa un nombre.").max(60, "Máximo 60 caracteres."),
  monto_objetivo: z
    .string()
    .min(1, "Ingresa un monto objetivo.")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, {
      message: "El monto debe ser mayor a 0.",
    }),
  fecha_limite: z.string().optional(),
});

export type MetaFormValues = z.infer<typeof metaSchema>;
