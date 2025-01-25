"use client";

// package imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const roomFormSchema = z.object({
  roomId: z.number().min(1, "RoomIds are positive integers"),
});

type RoomFormSchemaType = z.infer<typeof roomFormSchema>;

export function RoomForm() {
  const form = useForm<RoomFormSchemaType>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      roomId: 0,
    },
  });

  const router = useRouter();

  // submission handler
  const onSubmit = (data: RoomFormSchemaType) => {
    router.push(`room/${data.roomId}`);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset>
          <input
            {...form.register("roomId", { valueAsNumber: true })}
            placeholder="enter the name"
            style={{
              padding: "0.25rem 0.55rem",
            }}
          />
          <button
            style={{
              padding: "0.25rem 0.55rem",
            }}
          >
            Join
          </button>
        </fieldset>
        {form.formState.errors.roomId && (
          <p style={{ color: "red" }}>{form.formState.errors.roomId.message}</p>
        )}
      </form>
    </div>
  );
}
