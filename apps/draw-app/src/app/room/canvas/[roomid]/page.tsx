"use client";

import { ToolBar } from "@/components/ToolBar";
import { EntintyManager } from "@/utils/canvas/EntityManager";
import { Painter } from "@/utils/canvas/Painter";
import { useSocketContext } from "@/utils/contexts/webScoketContext";
import { Circle, PencilIcon, Square } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const drawOptions = [
  { name: "line" as "line", shape: PencilIcon },
  { name: "rect" as "rect", shape: Square },
  { name: "ovel" as "ovel", shape: Circle },
];

const colors = ["red", "white", "green"];

export default function Canvas() {
  const roomId = 3; // fix this later from params

  const [shape, setShape] = useState<"ovel" | "line" | "rect">("line");
  const [color, setColor] = useState(colors[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket, loading } = useSocketContext();
  const [manager, setManager] = useState<EntintyManager>();

  useEffect(() => {
    if (socket && !loading) {
      if (!Number(roomId)) {
        console.log("error :", roomId, Number(roomId));
      }
      const manager = new EntintyManager(socket, Number(roomId));
      setManager(manager);
    }
  }, [socket, loading]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    if (manager) {
      // draw logic here
      const painter = new Painter(ctx, canvas, manager, color);

      painter.startObserving(shape);
      return () => {
        painter.stopObserving();
      };
    }
  }, [shape, color, manager]);

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
