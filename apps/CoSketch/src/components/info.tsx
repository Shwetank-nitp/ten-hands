"use client";

import { Button } from "@repo/ui/button";
import { motion } from "framer-motion";
import { Info as InfoSvg } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface InfoProps {
  title: string;
  disc: ReactNode;
}

export function Info({ title, disc }: InfoProps) {
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
        <InfoSvg size={100} className="text-red-500" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col gap-4 text-center items-center"
      >
        <h2 className="text-2xl">{title}</h2>
        <p className="text-gray-500">{disc}</p>
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
