"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthContainer } from "./AuthContainer";
import { Label } from "./ui/label";
import { Crosshair, Lock, User } from "lucide-react";
import { AuthInputField } from "./ui/input";
import { Button } from "@repo/ui/button";
import Link from "next/link";

const signupSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username must be less than 50 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(100, "Password must be less than 100 characters"),
  name: z
    .string()
    .min(1, "name is reuqired")
    .max(50, "Name must be less then 50 characters"),
});

type SignupSchemaType = z.infer<typeof signupSchema>;

export const SignUpForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", password: "", name: "" },
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: SignupSchemaType) => {
    setLoading(true);
    try {
      setTimeout(() => {
        setLoading(false);
        console.log(data);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      //setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Label>
        <User size={15} /> User Signup
      </Label>
      <div className="mt-4 mb-10">
        <span className="text-3xl font-bold text-slate-800 text-center block">
          Welcome to Excelledraw
        </span>
        <p className="text-center text-gray-400 mt-2">
          We welcome you to our platform, and we hope you will love it! 😍❤️
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={loading} className="flex flex-col gap-4">
          <div>
            <div className="relative">
              <AuthInputField
                control={control}
                errors={errors}
                type="text"
                placeholder="name"
                aria-invalid={!!errors.name}
                name="name"
              />
              <Crosshair
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label="name icon"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
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
          Alrady have an account? Please <Link href="/login">Login</Link>
        </span>
      </div>
    </AuthContainer>
  );
};
