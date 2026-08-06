import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/layouts/AuthLayout";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/utils/validation/authSchemas";
import { sendPasswordResetEmail } from "@/services/auth.service";
import { traducirErrorAuth } from "@/utils/authErrors";

export function ForgotPasswordPage() {
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setErrorGeneral(null);
    try {
      await sendPasswordResetEmail(values.email);
      setEnviado(true);
    } catch (error) {
      setErrorGeneral(traducirErrorAuth(error));
    }
  }

  if (enviado) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        subtitle="Te enviamos un enlace para crear una nueva contraseña."
      >
        <Link to="/login">
          <Button variant="ghost" type="button">
            Volver a iniciar sesión
          </Button>
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle="Ingresa tu correo y te enviaremos un enlace"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <TextField
          label="Correo"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          error={errors.email?.message}
          {...register("email")}
        />

        {errorGeneral && (
          <p className="rounded-xl bg-ios-red/10 px-3 py-2 text-sm text-ios-red">
            {errorGeneral}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Enviar enlace
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
        <Link to="/login" className="font-medium text-ios-blue hover:underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
