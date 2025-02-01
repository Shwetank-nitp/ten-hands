"use client";

import { Button } from "@repo/ui/button";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

export function InternalServerError() {
  const router = useRouter();
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <Info size={100} className="text-red-500" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col gap-4 text-center items-center"
      >
        <h2 className="text-2xl">Internal Server Error</h2>
        <p className="text-gray-500">
          We're experiencing technical difficulties.
          <br /> Our team has been notified and is working to resolve the issue.
        </p>
        <Button
          variant="danger"
          className="bg-red-400 w-fit hover:bg-red-500 text-white transition-all"
          onClick={() => {
            router.replace("/");
          }}
        >
          Try Again
        </Button>
      </motion.div>
    </div>
  );
}
