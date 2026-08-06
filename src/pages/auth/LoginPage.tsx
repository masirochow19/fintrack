import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/layouts/AuthLayout";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { loginSchema, type LoginFormValues } from "@/utils/validation/authSchemas";
import { signInWithPassword } from "@/services/auth.service";
import { traducirErrorAuth } from "@/utils/authErrors";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  async function onSubmit(values: LoginFormValues) {
    setErrorGeneral(null);
    try {
      await signInWithPassword(values);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorGeneral(traducirErrorAuth(error));
    }
  }

  return (
    <AuthLayout title="Bienvenido a FinTrack" subtitle="Inicia sesión para continuar">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <TextField
          label="Correo"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Contraseña"
          isPassword
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="text-right">
          <Link
            to="/recuperar-password"
            className="text-sm font-medium text-ios-blue hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {errorGeneral && (
          <p className="rounded-xl bg-ios-red/10 px-3 py-2 text-sm text-ios-red">
            {errorGeneral}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Iniciar sesión
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className="font-medium text-ios-blue hover:underline">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
}
