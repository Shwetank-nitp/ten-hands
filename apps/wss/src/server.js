import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { checkToken } from "./utils/check-token.js";
import { wsRequestSchema } from "@repo/zod-schema/ws";
import { RoomManager } from "./utils/RoomManager.js";
import { Chat } from "@repo/db/models/chat";
import { connectDb } from "@repo/db/connectDb";

dotenv.config({
  path: "./.env",
});

await connectDb().then(() => console.log("database connected"));

const roomManager = new RoomManager();

const wss = new WebSocketServer({ port: process.env.PORT });

wss.on("connection", async (ws, req) => {
  try {
    const token = req.url.split("/")[1];
    if (!token) return ws.close(4001, "Authentication token required");
    const userId = checkToken(token);
    if (!userId) return ws.close(4002, "Invalid token");

    // Message handling
    ws.on("message", async (data) => {
      try {
        const rawData = data.toString();
        const parsedJson = JSON.parse(rawData);
        const parsed = wsRequestSchema.parse(parsedJson);

        switch (parsed.type) {
          case "sub_room":
            roomManager.addUser(userId, parsed.roomId, ws);
            ws.send(
              JSON.stringify({
                type: "sub_ack",
                roomId: parsed.roomId,
                status: "subscribed",
              })
            );
            break;

          case "unsub_room":
            roomManager.unsubUser(userId, parsed.roomId);
            ws.send(
              JSON.stringify({
                type: "unsub_ack",
                roomId: parsed.roomId,
                status: "unsubscribed",
              })
            );
            break;

          case "draw":
            const { _id } = await Chat.create({
              roomId: parsed.roomId,
              userId: userId,
              message: JSON.stringify(parsed.message),
            });
            roomManager.broadcastToRoom(
              parsed.roomId,
              parsed.message,
              userId,
              _id
            );
            break;
          case "del":
            const shapeId = parsed.shapeId;
            const deleteDraw = await Chat.findByIdAndDelete(shapeId);
            console.log(deleteDraw);
            roomManager.brodcastDeletion(shapeId, parsed.roomId, userId);
          default:
            ws.send(JSON.stringify({ error: "Unknown message type" }));
        }
      } catch (error) {
        console.error("Message handling error:", error);
        ws.send(JSON.stringify({ error: "Invalid message format" }));
      }
    });

    ws.on("close", () => {
      console.log("webscoket closed");
      roomManager.cleanUp(userId);
    });
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      roomManager.cleanUp(userId);
    });
  } catch (error) {
    console.error("Connection error:", error);
    ws.close(4003, "Authentication failed");
  }
});
