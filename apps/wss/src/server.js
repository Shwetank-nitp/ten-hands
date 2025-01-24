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
