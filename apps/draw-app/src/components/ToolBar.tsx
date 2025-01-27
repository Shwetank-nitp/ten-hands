import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

interface ToolBarPorps {
  drawOptions: { name: "line" | "rect" | "ovel"; shape: LucideIcon }[];
  shape: "line" | "rect" | "ovel";
  setShape: Dispatch<SetStateAction<"line" | "rect" | "ovel">>;
}

export function ToolBar({ drawOptions, shape, setShape }: ToolBarPorps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-md fixed z-30 top-5 left-1/2 origin-center flex gap-4 bg-slate-800/70 py-2 px-6 overflow-hidden"
    >
      {drawOptions.map((item) => (
        <button
          key={item.name}
          className={`hover:bg-slate-800 rounded-md p-2 transition-all ${item.name === shape ? "bg-slate-800" : ""}`}
          onClick={() => setShape(item.name)}
        >
          <item.shape size={15} className="text-slate-200"></item.shape>
        </button>
      ))}
    </motion.div>
  );
}
