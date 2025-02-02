import { z } from "zod";

export const wsRequestSchema = z.object({
  type: z.enum(["sub_room", "unsub_room", "draw", "del"]),
  roomId: z.number(),
  message: z
    .object({
      type: z.string(),
      color: z.string(),
      params: z.any(),
    })
    .optional(),
  shapeId: z.optional(z.string()),
});
