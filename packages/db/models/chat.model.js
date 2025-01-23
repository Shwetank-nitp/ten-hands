import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  roomId: {
    type: mongoose.Types.ObjectId,
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
});

const Chat = model("Chat", chatSchema);
