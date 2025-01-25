import mongoose, { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    roomId: {
      type: Number,
      ref: "Room",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Chat = model("Chat", chatSchema);
