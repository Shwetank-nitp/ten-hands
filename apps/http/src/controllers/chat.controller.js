import { Chat } from "@repo/db/models/chat";
import { errorHandler } from "../utils/errorhandler.js";

export function GetRoomDrawings(req, res) {
  errorHandler(req, res, async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.userId;
    const query = await Chat.aggregate([
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
          clientId: userId,
        },
      },
    ]);
    res.send(
      query[0] || {
        clientId: userId,
        chats: [],
        total: 0,
      }
    );
  });
}
