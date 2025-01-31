import { userLoginSchema, userSignupSchema } from "@repo/zod-schema/user";
import { errorHandler } from "../utils/errorhandler.js";
import { zodErrorMessage } from "../utils/zod-error-message.js";
import { User } from "@repo/db/models/user";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export async function Signup(req, res) {
  errorHandler(req, res, async (req, res) => {
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
        return;
      }
      throw error;
    }
  });
}

export async function Login(req, res) {
  errorHandler(req, res, async (req, res) => {
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
}
