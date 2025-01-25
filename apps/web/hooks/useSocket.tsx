import { useEffect, useState } from "react";
import { BASE_WS } from "../web_configs/configs";

export function useScoket(token: string) {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${BASE_WS}?token=${token}`);
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    loading,
    socket,
  };
}
