"use client";

import { EntintyManager } from "@/utils/canvas/EntityManager";
import { Painter } from "@/utils/canvas/Painter";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // draw logic here
    const manager = new EntintyManager();
    const painter = new Painter(ctx, canvas, manager);

    painter.startObserving("line");
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
}
