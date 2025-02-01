import { motion } from "framer-motion";
import { ReactNode } from "react";

export const AuthContainer = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border rounded-lg py-8 px-6 shadow-sm overflow-hidden max-w-md mx-auto"
    >
      {children}
    </motion.div>
  );
};
