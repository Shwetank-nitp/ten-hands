"use client";

import { ToolBar } from "@/components/ToolBar";
import { EntintyManager } from "@/utils/canvas/EntityManager";
import { Painter } from "@/utils/canvas/Painter";
import { Circle, PencilIcon, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Line = () => (
  <div>
    <svg
      height="20"
      width="20"
      stroke="#E2E8F0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="0" y1="20" x2="20" y2="0" strokeWidth={2} />
    </svg>
  </div>
);

const drawOptions = [
  { name: "line" as "line", shape: PencilIcon },
  { name: "rect" as "rect", shape: Square },
  { name: "ovel" as "ovel", shape: Circle },
];

const manager = new EntintyManager();

export default function Canvas() {
  const [shape, setShape] = useState<"ovel" | "line" | "rect">("line");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // draw logic here
    const painter = new Painter(ctx, canvas, manager);

    painter.startObserving(shape);
    return () => {
      painter.stopObserving();
    };
  }, [shape]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      <ToolBar shape={shape} setShape={setShape} drawOptions={drawOptions} />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
}
