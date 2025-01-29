import { HTMLAttributes, ReactNode } from "react";

export const CardInfo = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={"text-xs text-gray-500" + " " + className}>{children}</div>
  );
};

export const CardTitle = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      style={{ fontSize: "2rem" }}
      className={"font-bold tracking-tighter" + " " + className}
    >
      {children}
    </div>
  );
};

export const Card = ({
  children,
  className = "",
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={
        "border p-4 rounded-md flex flex-col bg-white" + " " + className
      }
    >
      {children}
    </div>
  );
};
