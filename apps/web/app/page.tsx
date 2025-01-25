import { RoomForm } from "../components/RoomForm";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <div>
        <h1>👋 Welcome to Chat app this is just a prototype.</h1>
        <p
          style={{
            margin: "1.5rem 0",
          }}
        >
          Enter the room number to join the room
        </p>
      </div>
      <RoomForm />
      <span
        style={{
          margin: "0.5rem 0",
          fontSize: ".75rem",
        }}
      >
        Made by Shwetank-nitp @github
      </span>
    </div>
  );
}
