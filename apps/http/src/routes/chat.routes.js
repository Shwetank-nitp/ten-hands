import { Router } from "express";
import { GetRoomDrawings } from "../controllers/chat.controller.js";
import { decodeToken } from "../middlewares/token-decode.js";

const chatRouter = Router();

chatRouter.get("/chats/:roomId", decodeToken, GetRoomDrawings);

export default chatRouter;
