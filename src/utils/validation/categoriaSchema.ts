import { z } from "zod";

export const categoriaSchema = z.object({
  nombre: z.string().min(2, "Ingresa un nombre.").max(40, "Máximo 40 caracteres."),
  tipo: z.enum(["ingreso", "gasto"]),
  color: z.string().min(1, "Elige un color."),
  icono: z.string().min(1, "Elige un ícono."),
  // Se deja como texto libre (el input numérico de HTML igual entrega string
  // en RHF); se convierte a number|null recién al enviar el formulario.
  limite_mensual: z
    .string()
    .optional()
    .refine(
      (valor) => !valor || (!Number.isNaN(Number(valor)) && Number(valor) > 0),
      { message: "El límite debe ser un número mayor a 0." },
    ),
});

export type CategoriaFormValues = z.infer<typeof categoriaSchema>;
