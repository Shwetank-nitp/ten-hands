import { RoomDashboard } from "@/components/RoomDashboard";
import { HTTP_URL } from "@/utils/configs/urls";
import axios from "axios";
import { cookies } from "next/headers";

export default async function Room() {
  const getCookies = await cookies();
  const token = getCookies.get("token")?.value;
  let rooms;

  try {
    const res = await axios.get(`${HTTP_URL}/rooms`, {
      headers: {
        Authorization: token,
      },
    });
    rooms = res.data;
  } catch (error) {
    console.log(error);
    return <div>Internal Server Error</div>;
  }

  return (
    <div className="lg:p-8 px-4 py-8 flex flex-col w-screen min-h-screen h-screen overflow-hidden bg-gray-100">
      <RoomDashboard rooms={rooms} />
    </div>
  );
}
