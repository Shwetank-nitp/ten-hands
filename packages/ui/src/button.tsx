"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button = ({
  children,
  className,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button className={className} {...props} onClick={onClick}>
      {children}
    </button>
  );
};
