import axios from "axios";
import { BASE_HTTP } from "../../../web_configs/configs";
import { cookies } from "next/headers";
import ChatRoomClient from "../../../components/ChatRoomClient";

interface RoomInterface {
  params: Promise<{
    id: number;
  }>;
}

export default async function Room({ params }: RoomInterface) {
  const { id: roomId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const getChats = await axios.get(`${BASE_HTTP}chats/${roomId}`, {
    headers: {
      Authorization: token, // get from cookies but its next server component
    },
  });

  return (
    <div>
      <h1>Welcome to Room: {roomId}</h1>
      <ChatRoomClient roomId={roomId} history={getChats.data} />
    </div>
  );
}
