import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

interface CelebrationOverlayProps {
  visible: boolean;
  nombreMeta: string;
}

export function CelebrationOverlay({ visible, nombreMeta }: CelebrationOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-card mx-6 flex flex-col items-center p-8 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-ios-green text-white"
            >
              <PartyPopper size={30} />
            </motion.div>
            <h2 className="text-lg font-bold">¡Meta completada!</h2>
            <p className="mt-1 text-sm text-[#3C3C43] dark:text-[#EBEBF5]/60">
              Lograste juntar el monto objetivo de "{nombreMeta}". 🎉
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
