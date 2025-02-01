"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { User, Lock } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContainer } from "./AuthContainer";
import { Label } from "./ui/label";
import { AuthInputField } from "./ui/input";

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
    control,
    handleSubmit,
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
      const url = new URL("/api/v1/login", "http://localhost:8000");
      const res = await axios.post(url.toString(), data);
      Cookies.set("token", res.data);
      router.replace("/room");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Label>
        <User size={15} /> User Login
      </Label>
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
              <AuthInputField
                control={control}
                name="username"
                errors={errors}
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
              <AuthInputField
                control={control}
                name="password"
                errors={errors}
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
    </AuthContainer>
  );
}
