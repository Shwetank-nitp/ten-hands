"use client";

import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Comets from "./Comets";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import { AnimateComits } from "@/utils/canvas/AnimateComits";
import { useEffect, useRef, useState } from "react";
import CommitToggle from "./ui/comitToggle";

export function Hero() {
  const router = useRouter();
  const [on, setOn] = useState(true);
  const animateComitRef = useRef<AnimateComits | null>(null);

  useEffect(() => {
    if (on && animateComitRef.current) {
      animateComitRef.current.start();
    } else if (animateComitRef.current) {
      animateComitRef.current.stop();
    }
  }, [on]);

  return (
    <section className="overflow-hidden relative">
      <div className="absolute top-5 right-5 z-50">
        <CommitToggle onClick={() => setOn(!on)} state={on} />
      </div>
      <div className="absolute top-0 left-0 -z-10">
        <Comets animateComitRef={animateComitRef} />
      </div>
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="w-screen h-screen flex justify-center items-center flex-col lg:px-36 px-2"
      >
        <div className="bg-gray-100 rounded-full py-2 px-4">
          <span className="font-medium text-sm text-gray-800 flex gap-x-1 justify-center items-center">
            <Pencil size={15} /> Introducing Excilledraw
          </span>
        </div>
        <div className="lg:py-8 py-4">
          <h2 className="text-5xl md:text-6xl font-bold text-center tracking-tight text-gray-900 selection:bg-green-400">
            Create, Collaborate, and Bring
            <br /> Your Ideas to Life
          </h2>
        </div>
        <div className="mb-4">
          <p className="text-center text-gray-500 lg:text-xl text-lg selection:bg-pink-300">
            The most intuitive drawing tool for creative professionals. Design
            with precision, collaborate in real-
            <br />
            time, and elevate your creative workflow.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="primary"
            size="large"
            onClick={() => {
              router.push("/login");
            }}
            className="bg-slate-800 min-w-[8rem] rounded-md py-4 px-3 text-white text-sm"
          >
            Get Started
          </Button>
          <a href="https://github.com/Shwetank-nitp/ten-hands" target="_blank">
            <Button
              size="large"
              variant="secondary"
              className="bg-gray-100 min-w-[8rem] hover:bg-gray-200 rounded-md py-2 px-3 text-sm"
            >
              View Code
            </Button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
