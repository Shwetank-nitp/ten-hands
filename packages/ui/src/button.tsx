import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: ReactNode;
  size?: "small" | "normal" | "large";
  className?: string;
}

const classes = {
  small: "py-2 px-3 text-sm tracking-lighter rounded-md max-h-max",
  normal: "py-2 px-6 t ext-md rounded-md text-sm max-h-max",
  large: "py-4 px-3 rounded-md min-w-[8rem] text-sm max-h-max",
};

const variantCSS = {
  primary: "bg-slate-800 text-white",
  secondary: "bg-slate-100 hover:bg-slate-200",
  danger: "bg-red-400 hover:bg-red-500",
};

export const Button = ({
  children,
  size = "normal",
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={classes[size] + " " + variantCSS[variant] + " " + className}
      {...props}
    >
      {children}
    </button>
  );
};
