import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/layouts/AuthLayout";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { registerSchema, type RegisterFormValues } from "@/utils/validation/authSchemas";
import { signUpWithPassword } from "@/services/auth.service";
import { traducirErrorAuth } from "@/utils/authErrors";

export function RegisterPage() {
  const navigate = useNavigate();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setErrorGeneral(null);
    try {
      const { session } = await signUpWithPassword(values);
      // Si el proyecto de Supabase exige confirmación de correo, `session`
      // viene null hasta que el usuario confirme el link recibido.
      if (session) {
        navigate("/", { replace: true });
      } else {
        setRegistroExitoso(true);
      }
    } catch (error) {
      setErrorGeneral(traducirErrorAuth(error));
    }
  }

  if (registroExitoso) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        subtitle="Te enviamos un enlace para confirmar tu cuenta antes de iniciar sesión."
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
    <AuthLayout title="Crea tu cuenta" subtitle="Empieza a controlar tus finanzas">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <TextField
          label="Nombre"
          autoComplete="name"
          placeholder="Tu nombre"
          error={errors.nombre?.message}
          {...register("nombre")}
        />
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
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-medium text-ios-blue hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
