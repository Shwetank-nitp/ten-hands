import mongoose, { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    roomId: {
      type: Number,
      required: true,
      unique: true,
    },
    adminId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Room = model("Room", roomSchema);
