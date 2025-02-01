import { InputHTMLAttributes } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errors: FieldErrors<any>;
  name: "username" | "password" | "name";
  control: Control<any>;
}

export const AuthInputField = ({
  control,
  errors,
  name,
  ...props
}: AuthInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          {...props}
          className={`pl-10 pr-2 py-2 text-sm border w-full rounded-md text-slate-800 ${
            errors[name] ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}
    />
  );
};
