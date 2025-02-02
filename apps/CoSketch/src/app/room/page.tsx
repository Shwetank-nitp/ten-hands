import { Info } from "@/components/info";
import { RoomDashboard } from "@/components/RoomDashboard";
import { HTTP_URL } from "@/utils/configs/urls";
import axios from "axios";
import { cookies } from "next/headers";

export default async function Room() {
  const getCookies = await cookies();
  const token = getCookies.get("token")?.value;
  let rooms;

  try {
    const url = new URL("api/v1/user/rooms", HTTP_URL);
    const res = await axios.get(url.toString(), {
      headers: {
        Authorization: token,
      },
    });
    rooms = res.data;
  } catch (error) {
    console.log(error);
    return (
      <div>
        <Info
          title="Internal Server Error"
          disc={
            <span>
              We're experiencing technical difficulties.
              <br /> Our team has been notified and is working to resolve the
              issue.
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="lg:p-8 px-4 py-8 flex flex-col w-screen min-h-screen h-screen overflow-hidden bg-gray-100">
      <RoomDashboard rooms={rooms} />
    </div>
  );
}
