"use client";

import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useScoket } from "../hooks/useSocket";

interface Chat {
  userId: string;
  message: string;
}

export default function ChatRoomClient({
  roomId,
  history,
}: {
  history: Chat[];
  roomId: number;
}) {
  const token = Cookies.get("token");

  const { loading, socket } = useScoket(token as string);
  const [chats, setChats] = useState<Chat[]>([...history]);

  useEffect(() => {
    if (socket && !loading) {
      const handleMessage = (e: MessageEvent) => {
        try {
          const body = JSON.parse(e.data);
          console.log(body);
          setChats((chat) => [body, ...chat]);
        } catch {
          console.warn("Invalid WebSocket message:", e.data);
        }
      };

      socket.onmessage = handleMessage;
      socket.onerror = (err) => console.error("WebSocket error:", err);

      return () => {
        socket.close();
      };
    }
  }, [socket, loading]);

  useEffect(() => {
    if (!loading && socket) {
      socket.send(
        JSON.stringify({
          type: "sub_room",
          roomId: Number(roomId),
        })
      );
    }

    return () => {
      if (socket) {
        socket.send(
          JSON.stringify({
            type: "unsub_room",
            roomId: Number(roomId),
          })
        );
      }
    };
  }, [socket, loading]);

  const handleSend = (val: string) => {
    if (val.trim() === "") return;
    socket?.send(
      JSON.stringify({
        type: "chat",
        roomId: Number(roomId),
        message: val,
      })
    );
  };

  return loading || !socket ? (
    <h1>Loading...</h1>
  ) : (
    <div>
      {chats.map((item, index) => (
        <p key={index}>
          <strong>{item.userId}: </strong>
          {item.message}
        </p>
      ))}
      <MessageBox handler={handleSend} />
    </div>
  );
}

function MessageBox({ handler }: { handler: (val: string) => void }) {
  const [message, setMessage] = useState<string>("");

  const sendMessage = () => {
    handler(message);
    setMessage(""); // Clear input after sending
  };

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your chat here"
      />
      <button onClick={sendMessage}>Send</button>
      <Link href={"/"}>Home</Link>
    </div>
  );
}
