import { Router } from "express";
import {
  CreateRoom,
  GetUserRooms,
  IsRoomAvalable,
} from "../controllers/room.controller.js";
import { decodeToken } from "../middlewares/token-decode.js";

const roomRouter = Router();

roomRouter.get("/check/:roomId", decodeToken, IsRoomAvalable);
roomRouter.post("/room/create", decodeToken, CreateRoom);
roomRouter.get("/user/rooms", decodeToken, GetUserRooms);

export default roomRouter;
