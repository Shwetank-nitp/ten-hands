import { useEffect, useState } from "react";
import { WS_URL } from "../configs/urls";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const ws = new WebSocket(WS_URL);
      setSocket(ws);
    } catch (error) {
      console.log(error);
      setError("Cannot connect to websocket server");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    socket,
    loading,
    error,
  };
};
