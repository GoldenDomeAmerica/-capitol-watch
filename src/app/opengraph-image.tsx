import { ImageResponse } from "next/og";

export const alt = "American Capitol Watch — Georgia bills in plain English";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f0e8",
          color: "#10243e",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", height: 12, width: 180, background: "#8e1b2a" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, letterSpacing: 4, color: "#8e1b2a" }}>GEORGIA</div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, marginTop: 12 }}>
            American Capitol Watch
          </div>
          <div style={{ fontSize: 32, marginTop: 20 }}>Plain-English bills from the Gold Dome.</div>
        </div>
        <div style={{ fontSize: 22 }}>Taxes · Guns · Schools · Elections · Property rights</div>
      </div>
    ),
    size,
  );
}
