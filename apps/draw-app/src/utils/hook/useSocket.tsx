import { useEffect, useState } from "react";
import { WS_URL } from "../configs/urls";
import Cookies from "js-cookie";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("token");
  useEffect(() => {
    try {
      const ws = new WebSocket(`${WS_URL}/${token}`);
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
