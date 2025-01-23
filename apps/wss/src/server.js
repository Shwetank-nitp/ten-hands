import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { JWT_SECRET } from "@repo/backend-common/config";

dotenv.config({
  path: "./.env",
});

const wss = new WebSocketServer({ port: process.env.PORT });

wss.on("connection", (ws, req) => {
  console.log("Client connected");

  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    ws.close();
    return;
  }

  // delete this from the production
  console.log(JWT_SECRET);

  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded || !decoded.userId) {
    ws.close();
    return;
  }

  ws.on("message", (message) => {
    console.log(message);
  });
});
