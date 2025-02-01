"use client";

import { AnimateComits } from "@/utils/canvas/AnimateComits";
import { ComitManager } from "@/utils/canvas/ComitManager";
import { RefObject, useEffect, useRef, useState } from "react";

interface CometsProps {
  animateComitRef: RefObject<AnimateComits | null>;
}

const Comets = ({ animateComitRef }: CometsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";

    const manager = new ComitManager();
    animateComitRef.current = new AnimateComits(manager, ctx, canvas);

    // Handle window resize
    const resizeHandler = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    // Set initial canvas size
    resizeHandler();

    // Add resize event listener
    window.addEventListener("resize", resizeHandler);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (animateComitRef.current) {
        animateComitRef.current.stop(); // Stop the animation on cleanup
      }
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Comets;
