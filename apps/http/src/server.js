// NPM packages
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Mutex } from "async-mutex";

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

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", async (req, res) => {
  const payload = userSignupSchema.safeParse(req.body);
  if (!payload.success) {
    return res.json({ error: zodErrorMessage(payload.error) });
  }

  const user = await User.create(payload.data);
  res.send(user);
});

app.post("/login", async (req, res) => {
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
});

app.post("/create-room", decodeToken, async (req, res) => {
  const { userId } = req.userId;
  const release = await mutex.acquire();
  try {
    const totalDocs = await Room.countDocuments();
    const roomId = totalDocs + 1;

    const room = await Room.create({
      adminId: userId,
      roomId,
    });

    res.send(room);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    release();
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});