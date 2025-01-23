import { z } from "zod";

const userLoginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(100),
});

const userSignupSchema = z.object({
  name: z.string().min(1).max(50),
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(100),
});

export { userLoginSchema, userSignupSchema };
