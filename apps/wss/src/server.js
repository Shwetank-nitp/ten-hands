// pnpm packages
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// worksapce packages
import { JWT_SECRET } from "@repo/backend-common/config";
import { wsRequestSchema } from "@repo/zod-schema/ws";
import { Chat } from "@repo/db/models/chat";
import { connectDb } from "@repo/db/connectDb";

dotenv.config({
  path: "./.env",
});

await connectDb().then(() => console.log("database connected"));

const connectedUserRoomWs = [];

const wss = new WebSocketServer({ port: process.env.PORT });

wss.on("connection", (ws, req) => {
  const params = req.url.split("?")[1];
  const searchParms = new URLSearchParams(params);
  const token = searchParms.get("token");

  if (!token) {
    ws.close();
    return;
  }

  let decoded;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.userId) {
      ws.close();
      return;
    }
  } catch (error) {
    ws.close();
    return;
  }

  ws.on("message", async (message) => {
    const request = JSON.parse(message);
    const payload = wsRequestSchema.safeParse(request);

    if (!payload.success) {
      ws.send("invalid schema formate formate");
      return;
    }

    const { roomId, type } = payload.data;

    if (type === "sub_room") {
      const index = connectedUserRoomWs.findIndex(
        (item) => item.userId === decoded.userId
      );
      if (index === -1) {
        connectedUserRoomWs.push({
          userId: decoded.userId,
          roomIds: [roomId],
          ws,
        });
        ws.send("subscribed");
      } else if (connectedUserRoomWs[index].roomIds.includes(roomId)) {
        ws.send("user alreay subed to the roomId");
      } else {
        connectedUserRoomWs[index].roomIds.push(roomId);
        ws.send("subscribed");
      }
    }

    if (type === "unsub_room") {
      const index = connectedUserRoomWs.findIndex(
        (item) => item.userId === decoded.userId
      );
      if (
        index === -1 ||
        !connectedUserRoomWs[index].roomIds.includes(roomId)
      ) {
        ws.send("user is not connect to this roomId");
        return;
      }

      connectedUserRoomWs[index].roomIds = connectedUserRoomWs[
        index
      ].roomIds.filter((id) => id !== roomId);
      ws.send("unsubscribed");
    }

    if (type === "chat" && payload.data?.message) {
      await Chat.create({
        roomId,
        userId: decoded.userId,
        message: payload.data.message,
      });
      connectedUserRoomWs.forEach((item) => {
        if (item.roomIds.includes(roomId)) {
          item.ws.send(
            JSON.stringify({
              userId: item.userId,
              message: payload.data.message,
            })
          );
        }
      });
    }
  });
});
