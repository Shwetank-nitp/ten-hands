// pnpm packages
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// worksapce packages
import { JWT_SECRET } from "@repo/backend-common/config";

dotenv.config({
  path: "./.env",
});

const wss = new WebSocketServer({ port: process.env.PORT });

wss.on("connection", (ws, req) => {
  const params = req.url.split("?")[1];
  const searchParms = new URLSearchParams(params);
  const token = searchParms.get("token");

  if (!token) {
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.userId) {
      ws.close();
      return;
    }
  } catch (error) {
    ws.close();
    return;
  }

  ws.on("message", (message) => {
    console.log(message);
  });
});
