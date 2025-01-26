"use client";

import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { User, Lock } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { HTTP_URL } from "../utils/configs/urls";
import Link from "next/link";

// Define the schema for form validation
const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username must be less than 50 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(100, "Password must be less than 100 characters"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(true);
    try {
      const res = await axios.post(`${HTTP_URL}/login`, data);

      console.log(res.data); //delte this
      Cookies.set("token", res.data); //set the cookie
      router.replace("/room");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border rounded-lg py-8 px-6 shadow-sm overflow-hidden max-w-md mx-auto"
    >
      <div className="bg-gray-100 rounded-full py-2 px-4 w-fit m-auto">
        <span className="font-medium text-sm text-gray-800 flex gap-x-1 justify-center items-center">
          <User size={15} /> User Login
        </span>
      </div>
      <div className="mt-4 mb-10">
        <span className="text-3xl font-bold text-slate-800 text-center block">
          Welcome to Excelledraw
        </span>
        <p className="text-center text-gray-400 mt-2">
          Welcome back, we are waiting for you 👉👈
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={loading} className="flex flex-col gap-4">
          <div>
            <div className="relative">
              <input
                {...register("username")}
                className={`pl-10 pr-2 py-2 text-sm border w-full rounded-md text-slate-800 ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                type="text"
                placeholder="Username"
                aria-invalid={!!errors.username}
              />
              <User
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label="Username icon"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <input
                {...register("password")}
                className={`pl-10 pr-2 py-2 text-sm border w-full text-slate-800 rounded-md ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                type="password"
                placeholder="Password"
                aria-invalid={!!errors.password}
              />
              <Lock
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label="Password icon"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-slate-800 py-3 px-10 rounded-md hover:bg-slate-900 text-white text-sm"
            style={{
              cursor: loading ? "not-allowed" : "pointer",
            }}
            aria-disabled={loading}
            aria-busy={loading}
            disabled={loading}
          >
            {loading ? (
              <>
                <span>😊 Loading...</span>
              </>
            ) : (
              "Login"
            )}
          </Button>
        </fieldset>
      </form>
      <div className="flex justify-center items-center">
        <span className="text-sm mx-auto mt-4 text-gray-500">
          New User? Please <Link href="/signup">Signup</Link> first
        </span>
      </div>
    </motion.div>
  );
}
