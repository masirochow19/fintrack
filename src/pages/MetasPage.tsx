import { Link } from "react-router-dom";
import { Plus, Target } from "lucide-react";
import { GoalProgressCard } from "@/components/metas/GoalProgressCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMetas } from "@/hooks/useMetas";

export function MetasPage() {
  const metas = useMetas();

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Metas de ahorro</h1>
          <p className="text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
            Junta plata para lo que quieres lograr
          </p>
        </div>
        <Link
          to="/metas/nueva"
          aria-label="Nueva meta"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ios-blue text-white"
        >
          <Plus size={18} />
        </Link>
      </div>

      {metas.isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : metas.data && metas.data.length > 0 ? (
        <div className="space-y-3">
          {metas.data.map((meta) => (
            <GoalProgressCard key={meta.id} meta={meta} />
          ))}
        </div>
      ) : (
        <div className="glass-card flex flex-col items-center justify-center gap-2 p-10 text-center">
          <Target size={28} className="opacity-40" />
          <p className="text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
            Todavía no tienes metas de ahorro.
          </p>
          <Link to="/metas/nueva" className="mt-1 text-sm font-medium text-ios-blue">
            Crear meta
          </Link>
        </div>
      )}
    </div>
  );
}
