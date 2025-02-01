"use client";

import { Button } from "@repo/ui/button";
import { Card, CardInfo, CardTitle } from "@repo/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import { HTTP_URL } from "@/utils/configs/urls";
import { useRouter } from "next/navigation";

const MotionCard = motion.create(Card);

interface CreateRoomCardProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateRoomCard({ open, setOpen }: CreateRoomCardProps) {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const token = Cookies.get("token");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const url = new URL("api/v1/room/create", HTTP_URL);
      await axios.post(
        url.toString(),
        { roomName: name },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setOpen(false);
      router.replace("/room");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message?.error || error.message);
        console.error("Error creating room:", error);
      } else {
        setError("An unexpected error occurred.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

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
            <CardInfo>
              Make sure to keep your card name short and relevant 😊
            </CardInfo>
            <CardTitle className="mb-4 mt-2">Enter your Room Name</CardTitle>
            <div className="mb-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="py-2 px-4 w-full mb-2 rounded-md border"
                placeholder="Room name"
              />
              <span className="text-sm text-red-600 tracking-tighter">
                {error}
              </span>
            </div>
            <Button onClick={handleCreateClick} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </MotionCard>
        </div>
      )}
    </AnimatePresence>
  );
}
