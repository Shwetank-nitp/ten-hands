// NPM packages
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Mutex } from "async-mutex";
import cors from "cors";

// Middleware
import { decodeToken } from "./middlewares/token-decode.js";

// utils
import { zodErrorMessage } from "./utils/zod-error-message.js";

// Workspace packages
import { JWT_SECRET } from "@repo/backend-common/config";
import { connectDb } from "@repo/db/connectDb";
import { User } from "@repo/db/models/user";
import { Room } from "@repo/db/models/room";
import { userSignupSchema, userLoginSchema } from "@repo/zod-schema/user";
import { roomSchema } from "@repo/zod-schema/room";
import { Chat } from "@repo/db/models/chat";
import mongoose from "mongoose";

dotenv.config({
  path: "./.env",
});

// Connect to DB
await connectDb()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

const mutex = new Mutex();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", async (req, res) => {
  try {
    const payload = userSignupSchema.safeParse(req.body);
    if (!payload.success) {
      return res.json({ error: zodErrorMessage(payload.error) });
    }

    const user = await User.create(payload.data);
    res.send(user);
  } catch (error) {
    if (error?.code === 11000) {
      res.status(400).json({ error: "User already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const payload = userLoginSchema.safeParse(req.body);
    if (!payload.success) {
      return res.status(400).json({ error: zodErrorMessage(payload.error) });
    }

    const user = await User.findOne({ username: payload.data.username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordCorrect = payload.data.password === user.password;

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.send(token);
  } catch (error) {
    console.log(error);
    res.json({ error: "internal server error" }).status(500);
  }
});

app.post("/create-room", decodeToken, async (req, res) => {
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
      res.status(400).json({ error: "A room with this name already exists." });
    } else {
      console.error("Internal Server Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } finally {
    release();
  }
});
app.get("/rooms", decodeToken, async (req, res) => {
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

app.get("/chats/:roomId", decodeToken, async (req, res) => {
  const { roomId } = req.params;
  if (!Number(roomId)) {
    res
      .json({
        error:
          "roomId must be a number or string with with only numberical digits",
      })
      .status(401);
    return;
  }

  const paramsString = req.url.split("?")[1];
  const searchParams = new URLSearchParams(paramsString);

  const limit = Number(searchParams.get("limit"));
  const skip = Number(searchParams.get("skip"));

  const chats = await Chat.aggregate([
    {
      $match: {
        roomId: Number(roomId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip || 0,
    },
    {
      $limit: limit || 5,
    },
  ]);

  res.send(chats);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
