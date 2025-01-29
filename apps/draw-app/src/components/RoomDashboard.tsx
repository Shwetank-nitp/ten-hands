"use client";

import { Button } from "@repo/ui/button";
import { motion } from "framer-motion";
import { DoorOpen, LogIn, Plus } from "lucide-react";
import { RoomCard } from "@/components/RoomCard";
import { useRef, useState } from "react";
import { ContentNotFound } from "./ui/204";
import { CreateRoomCard } from "./CreateRoomCard";

interface RoomDashboardProps {
  rooms: {
    roomId: number;
    _id: string;
    roomName: string;
    adminName: string;
    createdAt: string;
  }[];
}

export const RoomDashboard = ({ rooms }: RoomDashboardProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "backInOut" }}
      className="h-full w-full flex flex-col relative"
    >
      {<CreateRoomCard open={open} setOpen={setOpen} />}
      <div className="flex justify-between">
        <div>
          <h1 className="flex gap-2 items-center">
            <span className="text-4xl tracking-tighter font-bold">Rooms</span>
            <DoorOpen className="text-slate-500" size={30} />
          </h1>
          <p className="text-slate-500">
            Create or join rooms to start collaborating
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="normal"
            className="flex justify-between gap-4 items-center max-h-fit"
          >
            <LogIn size={15} /> Join Room
          </Button>
          <Button
            variant="primary"
            size="normal"
            onClick={() => setOpen(true)}
            className="flex justify-between gap-4 items-center max-h-fit"
          >
            <Plus size={15} /> <span>Create a Room</span>
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease: "backInOut" }}
        className="flex flex-wrap gap-4 justify-start items-start my-8 flex-1"
        ref={parentRef}
      >
        {rooms.length > 0 ? (
          rooms.map((room, index) => {
            const date = new Date(room.createdAt);
            const stringifyDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            return (
              <RoomCard
                key={index}
                roomId={room.roomId.toString()}
                roomName={room.roomName}
                actionHandler={() => console.log("do")}
                date={stringifyDate}
                parentRef={parentRef}
              />
            );
          })
        ) : (
          <ContentNotFound />
        )}
      </motion.div>
    </motion.div>
  );
};
