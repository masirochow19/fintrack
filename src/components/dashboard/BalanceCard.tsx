import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/Skeleton";

interface BalanceCardProps {
  saldo: number | undefined;
  isLoading: boolean;
}

export function BalanceCard({ saldo, isLoading }: BalanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card bg-gradient-to-br from-ios-blue to-ios-indigo p-6 text-white"
    >
      <p className="text-sm font-medium text-white/80">Saldo actual</p>
      {isLoading ? (
        <Skeleton className="mt-2 h-9 w-40 bg-white/20" />
      ) : (
        <p className="mt-1 text-3xl font-bold tracking-tight">
          {formatCurrency(saldo ?? 0)}
        </p>
      )}
    </motion.div>
  );
}
