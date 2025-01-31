import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "@repo/db/connectDb";
import userRouter from "./routes/user.routes.js";
import roomRouter from "./routes/room.routes.js";
import chatRouter from "./routes/chat.routes.js";

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

const baseApiRoute = "/api/v1";

app.use(baseApiRoute, userRouter);
app.use(baseApiRoute, roomRouter);
app.use(baseApiRoute, chatRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
