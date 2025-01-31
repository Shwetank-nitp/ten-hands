"use client";

import { ToolBar } from "@/components/ToolBar";
import { EntintyManager } from "@/utils/canvas/EntityManager";
import { Painter } from "@/utils/canvas/Painter";
import { useSocketContext } from "@/utils/contexts/webScoketContext";
import { Circle, PencilIcon, Square } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const drawOptions = [
  { name: "line" as "line", shape: PencilIcon },
  { name: "rect" as "rect", shape: Square },
  { name: "ovel" as "ovel", shape: Circle },
];

const colors = ["red", "white", "green"];

export default function Canvas() {
  const { roomId } = useParams();
  
  if (!roomId) {
    return <div>No Room ID is found!</div>;
  }

  const [shape, setShape] = useState<"ovel" | "line" | "rect">("line");
  const [color, setColor] = useState(colors[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useSocketContext();
  const [manager, setManager] = useState<EntintyManager>();

  useEffect(() => {
    const manager = new EntintyManager();
    setManager(manager);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    if (manager && socket) {
      const painter = new Painter(
        ctx,
        canvas,
        manager,
        color,
        socket,
        Number(roomId)
      );

      painter.startObserving(shape);
      return () => {
        painter.stopObserving();
      };
    }
  }, [shape, color, manager, socket]);

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
