/**
 * Supabase devuelve los mensajes de error de Auth en inglés. Esta función
 * traduce los casos más comunes; el resto cae a un mensaje genérico.
 */
export function traducirErrorAuth(error: unknown): string {
  const mensaje = error instanceof Error ? error.message : String(error);

  const mapa: Record<string, string> = {
    "Invalid login credentials": "Correo o contraseña incorrectos.",
    "Email not confirmed": "Debes confirmar tu correo antes de iniciar sesión.",
    "User already registered": "Ya existe una cuenta con ese correo.",
    "Password should be at least 6 characters":
      "La contraseña debe tener al menos 6 caracteres.",
    "Unable to validate email address: invalid format":
      "El formato del correo no es válido.",
    "For security purposes, you can only request this after":
      "Por seguridad, debes esperar un momento antes de volver a intentarlo.",
    "New password should be different from the old password.":
      "La nueva contraseña debe ser distinta a la anterior.",
  };

  const coincidencia = Object.keys(mapa).find((clave) => mensaje.includes(clave));
  return coincidencia ? mapa[coincidencia]! : "Ocurrió un error inesperado. Intenta nuevamente.";
}
