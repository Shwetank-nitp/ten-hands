"use client";

import { Lock, Paintbrush, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Paintbrush,
    title: "Intuitive Drawing Tools",
    description: "Professional-grade tools that feel natural and responsive.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Work together seamlessly with your team, anywhere in the world.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized performance for smooth drawing and editing experience.",
  },
  {
    icon: Lock,
    title: "Secure by Design",
    description: "Enterprise-grade security to protect your creative assets.",
  },
];

export function Features() {
  return (
    <div className="lg:px-11 px-4 py-4 mb-16">
      <div className="flex justify-center items-center">
        <span className="text-3xl font-bold">Crafted for Creatives</span>
      </div>
      <div className="flex justify-center items-center">
        <span className="text-lg text-gray-500">
          Every feature is designed to enhance your creative workflow
        </span>
      </div>
      <div className="flex gap-4 mt-8">
        {features.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="flex flex-col p-4 bg-gray-50 hover:bg-slate-100 transition-colors border rounded-md md:w-[360px]"
          >
            <div>
              <item.icon size={50} className="text-gray-800" />
            </div>
            <div className="text-gray-800 text-lg my-2">
              <span className="text-xl font-medium">{item.title}</span>
            </div>
            <div className="text-gray-500 text-base">{item.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
