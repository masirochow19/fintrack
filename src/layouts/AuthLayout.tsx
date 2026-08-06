import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6 safe-top safe-bottom bg-gradient-to-b from-ios-blue/10 to-transparent dark:from-ios-blue/5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-sm p-8"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ios-blue text-white">
          <Wallet size={28} />
        </div>

        <h1 className="text-center text-xl font-semibold">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-center text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
            {subtitle}
          </p>
        )}

        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  );
}
