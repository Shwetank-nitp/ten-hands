"use client";

import { ToolBar } from "@/components/ToolBar";
import { EntintyManager } from "@/utils/canvas/EntityManager";
import { Painter } from "@/utils/canvas/Painter";
import { Circle, PencilIcon, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const drawOptions = [
  { name: "line" as "line", shape: PencilIcon },
  { name: "rect" as "rect", shape: Square },
  { name: "ovel" as "ovel", shape: Circle },
];

const colors = ["red", "white", "green"];

const manager = new EntintyManager();

export default function Canvas() {
  const [shape, setShape] = useState<"ovel" | "line" | "rect">("line");
  const [color, setColor] = useState(colors[0]); // TODO::Later
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // draw logic here
    const painter = new Painter(ctx, canvas, manager, color);

    painter.startObserving(shape);
    return () => {
      painter.stopObserving();
    };
  }, [shape, color]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      <ToolBar
        setColor={setColor}
        currColor={color}
        colors={colors}
        shape={shape}
        setShape={setShape}
        drawOptions={drawOptions}
      />
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
