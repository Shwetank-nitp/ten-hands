import { Router } from "express";
import { Login, Signup } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.post("/signup", Signup);
userRouter.post("/login", Login);

export default userRouter;
