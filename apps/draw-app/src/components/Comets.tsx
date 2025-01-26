"use client";

import { useEffect, useRef } from "react";

const Comets = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const unitVec = {
      x: -1,
      y: 1,
    };

    const comets: {
      pos: {
        x: number;
        y: number;
        r: number;
      };
      color: string;
    }[] = [];

    let handler: number;
    function animation() {
      if (canvas && ctx) {
        handler = requestAnimationFrame(animation);
        // Fade out the canvas to create a tail effect
        ctx.fillStyle = "rgba(225, 225, 225, 0.3)"; // Semi-transparent black
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add a new comet
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 3.53;
        const hue = Math.floor(Math.random() * 360); // Random hue between 0 and 360
        const saturation = Math.floor(Math.random() * 100); // Random saturation between 0% and 100%
        const lightness = Math.floor(Math.random() * 100); // Random lightness between 0% and 100%
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        comets.push({
          pos: { x, y, r },
          color,
        });

        // Remove the oldest comet if there are too many
        if (comets.length > 100) {
          comets.splice(0, 1);
        }

        // Update and draw comets
        comets.forEach((item) => {
          item.pos.x += unitVec.x;
          item.pos.y += unitVec.y;

          // Draw the comet
          ctx.beginPath();
          ctx.arc(item.pos.x, item.pos.y, item.pos.r, 0, Math.PI * 2); // Circle with radius 5
          ctx.fillStyle = item.color;
          ctx.fill();
          ctx.closePath();
        });
      }
    }

    // Handle window resize
    const resizeHandler = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    // Set initial canvas size
    resizeHandler();

    // Start the animation loop
    animation();

    // Add resize event listener
    window.addEventListener("resize", resizeHandler);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeHandler);
      cancelAnimationFrame(handler);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    ></canvas>
  );
};

export default Comets;
