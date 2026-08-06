import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/layouts/AuthLayout";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/utils/validation/authSchemas";
import { updatePassword } from "@/services/auth.service";
import { traducirErrorAuth } from "@/utils/authErrors";

/**
 * Supabase redirige aquí desde el enlace del correo de recuperación.
 * `detectSessionInUrl: true` (ver services/supabase.ts) ya deja al usuario
 * autenticado temporalmente para que pueda fijar su nueva contraseña.
 */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setErrorGeneral(null);
    try {
      await updatePassword(values.password);
      navigate("/", { replace: true });
    } catch (error) {
      setErrorGeneral(traducirErrorAuth(error));
    }
  }

  return (
    <AuthLayout title="Crea una nueva contraseña" subtitle="Elige una contraseña segura">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <TextField
          label="Nueva contraseña"
          isPassword
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />
        <TextField
          label="Confirmar contraseña"
          isPassword
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {errorGeneral && (
          <p className="rounded-xl bg-ios-red/10 px-3 py-2 text-sm text-ios-red">
            {errorGeneral}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Guardar contraseña
        </Button>
      </form>
    </AuthLayout>
  );
}
