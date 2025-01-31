import { Chat } from "@repo/db/models/chat";
import { errorHandler } from "../utils/errorhandler.js";

export function GetRoomDrawings() {
  errorHandler(req, res, async (req, res) => {
    const { roomId } = req.params;
    const chats = await Chat.aggregate([
      {
        $match: {
          roomId: Number(roomId),
        },
      },
      {
        $group: {
          _id: "$roomId",
          chats: { $push: "$$ROOT" },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          chats: 1,
          total: 1,
        },
      },
    ]);
    res.send(chats);
  });
}
