"use client";

import { ToolBar } from "@/components/ToolBar";
import { EntintyManager } from "@/utils/canvas/EntityManager";
import { Painter } from "@/utils/canvas/Painter";
import { HTTP_URL } from "@/utils/configs/urls";
import { useSocketContext } from "@/utils/contexts/webScoketContext";
import axios from "axios";
import { Circle, Home, PencilIcon, Square } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Shape } from "@/utils/canvas/common-types/canvas-util-class-common-types";

const drawOptions = [
  { name: "line" as "line", shape: PencilIcon },
  { name: "rect" as "rect", shape: Square },
  { name: "ovel" as "ovel", shape: Circle },
];

type dbResponse = {
  _id: string;
  message: string;
  roomId: number;
  userId: string;
  createdAt: string;
};

const colors = ["red", "white", "green"];

export default function Canvas() {
  const { roomId } = useParams();
  const router = useRouter();

  if (!roomId) {
    return <div>No Room ID is found!</div>;
  }

  const [shape, setShape] = useState<"ovel" | "line" | "rect">("line");
  const [color, setColor] = useState(colors[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useSocketContext();
  const [manager, setManager] = useState<EntintyManager>();

  useEffect(() => {
    const url = new URL("/api/v1/chats/" + roomId, HTTP_URL);
    axios
      .get(url.toString(), {
        headers: {
          Authorization: `${Cookies.get("token")}`,
        },
      })
      .then((res) => {
        const drawings = res.data.chats.map((item: dbResponse) => {
          const obj = JSON.parse(item.message) as Shape;
          return obj;
        });
        return drawings;
      })
      .then((drawings) => {
        const manager = new EntintyManager(drawings);
        setManager(manager);
      })
      .catch((e) => {
        console.error(e);
      });
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
      <div
        className="fixed top-5 left-5 z-30 bg-slate-800/70 rounded-md p-2 cursor-pointer"
        onClick={() => {
          router.replace("/room");
        }}
      >
        <Home className="text-slate-200" size={25} />
      </div>
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
