"use client";

import { createContext, useContext, useEffect } from "react";
import { useSocket } from "../hook/useSocket";

type SocketContext = {
  socket: WebSocket | null;
  loading: boolean;
  error: string | null;
};

const initialState: SocketContext = {
  socket: null,
  loading: true,
  error: null,
};

const webScoketContext = createContext(initialState);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { socket, loading, error } = useSocket();
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);
  return (
    <webScoketContext.Provider value={{ socket, loading, error }}>
      {children}
    </webScoketContext.Provider>
  );
};

export const useSocketContext = () => useContext(webScoketContext);
