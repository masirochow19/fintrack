import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  // Falla rápido en desarrollo si faltan las variables de entorno,
  // en vez de dejar que Supabase falle silenciosamente más adelante.
  console.warn(
    "[FinTrack] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY. " +
      "Copia .env.example a .env.local y completa tus credenciales de Supabase.",
  );
}

export const supabase = createClient<Database>(
  supabaseUrl ?? "",
  supabasePublishableKey ?? "",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
