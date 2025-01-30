import { SocketContextProvider } from "@/utils/contexts/webScoketContext";
import { ReactNode } from "react";

export default function SocketLayerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SocketContextProvider>{children}</SocketContextProvider>;
}
