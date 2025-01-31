import { roomSchema } from "@repo/zod-schema/room";
import { errorHandler } from "../utils/errorhandler.js";
import { Mutex } from "async-mutex";
import { Room } from "@repo/db/models/room";
import mongoose from "mongoose";

const mutex = new Mutex();

export async function CreateRoom(req, res) {
  errorHandler(req, res, async (req, res) => {
    const { userId } = req.userId;
    const payload = roomSchema.safeParse(req.body);

    if (!payload.success) {
      return res.status(400).json({ error: payload.error.errors });
    }

    const { roomName } = payload.data;

    const release = await mutex.acquire();
    try {
      const query = await Room.aggregate([
        {
          $group: {
            _id: null,
            maxId: { $max: "$roomId" },
          },
        },
      ]);

      const maxId = query.length > 0 ? query[0].maxId : 0;
      const roomId = maxId + 1;

      const room = await Room.create({
        adminId: userId,
        roomId,
        roomName,
      });

      res.status(201).json({
        roomId: room.roomId,
      });
    } catch (error) {
      if (error?.code === 11000) {
        console.error("Duplicate room name:", error);
        res
          .status(400)
          .json({ error: "A room with this name already exists." });
      } else {
        console.error("Internal Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } finally {
      release();
    }
  });
}

export function GetUserRooms(req, res) {
  errorHandler(req, res, async (req, res) => {
    const { userId } = req.userId;
    const rooms = await Room.aggregate(
      [
        {
          $match: {
            adminId: new mongoose.Types.ObjectId(userId),
          },
        },
      ],
      [
        {
          $project: {
            adminId: 1,
            roomId: 1,
            createdAt: 1,
            roomName: 1,
          },
        },
      ]
    );
    res.send(rooms);
  });
}

export function IsRoomAvalable(req, res) {
  errorHandler(req, res, async (req, res) => {
    const { roomId } = req.params;
    const info = await Room.findOne({
      roomId: roomId,
    });
    if (!info) {
      res.status(404).send("room not found");
    }
    res.status(200).send("room found");
  });
}
