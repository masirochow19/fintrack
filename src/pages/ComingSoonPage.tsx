import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";

interface ComingSoonPageProps {
  titulo: string;
  icon?: LucideIcon;
}

export function ComingSoonPage({ titulo, icon: Icon = Construction }: ComingSoonPageProps) {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5 text-[#3C3C43] dark:bg-white/10 dark:text-[#EBEBF5]/70">
        <Icon size={26} />
      </div>
      <h1 className="text-lg font-semibold">{titulo}</h1>
      <p className="mt-1 max-w-xs text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
        Esta sección llega en un próximo paso del proyecto.
      </p>
    </div>
  );
}
