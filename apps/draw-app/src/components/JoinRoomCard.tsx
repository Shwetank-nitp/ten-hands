"use client";

import { Button } from "@repo/ui/button";
import { Card, CardInfo, CardTitle } from "@repo/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocketContext } from "@/utils/contexts/webScoketContext";
import { HTTP_URL } from "@/utils/configs/urls";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const MotionCard = motion.create(Card);

interface JoinRoomCardProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function JoinRoomCard({ open, setOpen }: JoinRoomCardProps) {
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { socket } = useSocketContext();

  const handleJoinClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const roomId = Number(id);

    const url = new URL("/api/v1/check/" + roomId, HTTP_URL);
    try {
      await axios.get(url.toString(), {
        headers: {
          Authorization: `${Cookies.get("token")}`,
        },
      });
      if (socket && roomId) {
        socket.send(
          JSON.stringify({
            type: "sub_room",
            roomId: roomId,
          })
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(error);
      setError(
        axiosError.status === 404
          ? "Room Not Found 🛑"
          : "Somthing went wrong 💀"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (m: MessageEvent) => {
        const parsed = JSON.parse(m.data);
        if (parsed?.error) {
          setError(error);
          setLoading(false);
        }
        if (parsed?.type === "sub_ack") {
          router.push("/canvas" + parsed?.roomId);
          setLoading(false);
        }
      };
    }
  }, [socket]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="w-screen h-screen flex justify-center items-center fixed z-50 top-0 left-0 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <MotionCard
            initial={{
              opacity: 0,
              scale: 0,
            }}
            exit={{
              opacity: 0,
            }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="shadow-xl"
          >
            <CardInfo>Join the room using roomId 👋</CardInfo>
            <CardTitle className="mb-4 mt-2">Enter the Room Id</CardTitle>
            <div className="mb-2">
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="py-2 px-4 w-full mb-2 rounded-md border"
                placeholder="Room name"
              />
              <span className="text-sm text-red-600 tracking-tighter">
                {error}
              </span>
            </div>
            <Button onClick={handleJoinClick} disabled={loading}>
              {loading ? "Joining..." : "Join"}
            </Button>
          </MotionCard>
        </div>
      )}
    </AnimatePresence>
  );
}
