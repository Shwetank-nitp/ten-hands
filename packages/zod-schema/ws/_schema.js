import { z } from "zod";

export const wsRequestSchema = z.object({
  type: z.enum(["sub_room", "unsub_room", "chat"]),
  roomId: z.number(),
  message: z.optional(z.string().min(1)),
});
