import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Tema } from "@/types/database.types";

interface ThemeContextValue {
  /** Preferencia elegida por la persona: 'claro' | 'oscuro' | 'sistema'. */
  preferencia: Tema;
  /** Tema realmente aplicado ('light' | 'dark'), resolviendo 'sistema'. */
  temaAplicado: "light" | "dark";
  setPreferencia: (preferencia: Tema) => void;
}

const STORAGE_KEY = "fintrack:tema";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function prefiereOscuroElSistema(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolverTemaAplicado(preferencia: Tema): "light" | "dark" {
  if (preferencia === "sistema") return prefiereOscuroElSistema() ? "dark" : "light";
  return preferencia === "oscuro" ? "dark" : "light";
}

function getPreferenciaInicial(): Tema {
  const guardada = localStorage.getItem(STORAGE_KEY);
  if (guardada === "claro" || guardada === "oscuro" || guardada === "sistema") return guardada;
  return "sistema";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [preferencia, setPreferenciaState] = useState<Tema>(getPreferenciaInicial);

  // Aplica la clase `dark` cuando cambia la preferencia o el tema del sistema.
  useEffect(() => {
    const aplicar = () => {
      document.documentElement.classList.toggle("dark", resolverTemaAplicado(preferencia) === "dark");
    };
    aplicar();

    if (preferencia !== "sistema") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", aplicar);
    return () => media.removeEventListener("change", aplicar);
  }, [preferencia]);

  // Al iniciar sesión, la preferencia guardada en Supabase manda sobre la local
  // (así el tema viaja entre dispositivos).
  useEffect(() => {
    if (!session) return;
    supabase
      .from("configuracion_usuario")
      .select("tema")
      .eq("usuario_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.tema) {
          setPreferenciaState(data.tema);
          localStorage.setItem(STORAGE_KEY, data.tema);
        }
      });
  }, [session]);

  const setPreferencia = useCallback(
    (nueva: Tema) => {
      setPreferenciaState(nueva);
      localStorage.setItem(STORAGE_KEY, nueva);
      if (session) {
        void supabase
          .from("configuracion_usuario")
          .update({ tema: nueva })
          .eq("usuario_id", session.user.id);
      }
    },
    [session],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      preferencia,
      temaAplicado: resolverTemaAplicado(preferencia),
      setPreferencia,
    }),
    [preferencia, setPreferencia],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}
