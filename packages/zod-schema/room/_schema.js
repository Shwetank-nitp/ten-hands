import { z } from "zod";

const roomSchema = z.object({
  roomName: z.string().min(2).max(50),
});

export { roomSchema };
