import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f4f0",
          fontSize: 340,
        }}
      >
        🌱
      </div>
    ),
    { width: 512, height: 512 }
  );
}
