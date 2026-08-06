import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function FloatingActionButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/movimientos/nuevo")}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
      whileTap={{ scale: 0.92 }}
      aria-label="Agregar movimiento"
      className="fixed bottom-24 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-ios-blue text-white shadow-lg shadow-ios-blue/30"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <Plus size={26} />
    </motion.button>
  );
}
