import { Button } from "@repo/ui/button";
import { Card, CardInfo, CardTitle } from "@repo/ui/card";
import { Database } from "lucide-react";
import { RefObject, useState } from "react";
import { motion } from "framer-motion";

interface RoomCardProps {
  roomId: string;
  roomName: string;
  date: string;
  parentRef: RefObject<HTMLDivElement | null>;
  actionHandler: () => void;
}

const MotionCard = motion.create(Card);

export const RoomCard = ({
  roomId,
  roomName,
  date,
  actionHandler,
  parentRef,
}: RoomCardProps) => {
  const [dragging, setDragging] = useState(false);
  return (
    <MotionCard
      drag
      whileDrag={{
        scale: 1.1,
      }}
      dragMomentum={false}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      dragConstraints={parentRef}
      className="min-w-[250px] bg-white shadow-md"
    >
      <CardInfo className="flex gap-1">
        <Database size={15} />{" "}
        <span className="text-xs">room ID: {roomId}</span>
      </CardInfo>
      <CardTitle className="mb-4">{roomName}</CardTitle>
      <CardInfo className="mb-2">Date: {date}</CardInfo>
      <Button className="font-bold text-xs" onClick={actionHandler}>
        Join Room
      </Button>
    </MotionCard>
  );
};
