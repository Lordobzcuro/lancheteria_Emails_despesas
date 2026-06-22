import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0f14" }}>
        <div style={{ display: "flex", color: "#3aa0ff", fontSize: 300, fontWeight: 800 }}>LR</div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
