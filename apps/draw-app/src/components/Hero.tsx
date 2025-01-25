"use client";

import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

export function Hero() {
  return (
    <section className="overflow-hidden">
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
          <h2 className="text-5xl md:text-6xl font-bold text-center tracking-tight text-gray-900">
            Create, Collaborate, and Bring
            <br /> Your Ideas to Life
          </h2>
        </div>
        <div className="mb-4">
          <p className="text-center text-gray-500 lg:text-xl text-lg">
            The most intuitive drawing tool for creative professionals. Design
            with precision, collaborate in real-
            <br />
            time, and elevate your creative workflow.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-slate-800 min-w-[8rem] rounded-md py-4 px-3 text-white text-sm">
            Get Started
          </button>
          <button className="bg-gray-100 min-w-[8rem] hover:bg-gray-200 rounded-md py-2 px-3 text-sm">
            watch Demo
          </button>
        </div>
      </motion.div>
    </section>
  );
}
