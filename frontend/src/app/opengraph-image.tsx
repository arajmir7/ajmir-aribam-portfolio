import { ImageResponse } from "next/og";
export const alt =
  "Ajmir Aribam — Software Engineer, Backend, Cloud, DevOps, AI Systems, Quality Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 70,
        background: "#f6f6f3",
        color: "#0a0d12",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          letterSpacing: 5,
          borderBottom: "2px solid #0a0d12",
          paddingBottom: 24,
        }}
      >
        AJMIR ARIBAM{" "}
        <span style={{ marginLeft: "auto", color: "#315cf5" }}>A.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 85, lineHeight: 1.05, fontWeight: 700 }}>
          Software Engineer
        </div>
        <div style={{ fontSize: 43, color: "#2449d0", marginTop: 12 }}>
          Backend · Cloud · DevOps · AI Systems · Quality
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          borderTop: "2px solid #0a0d12",
          paddingTop: 24,
        }}
      >
        <span>BUILD · CHECK · SHIP</span>
        <span>ENGINEERING PORTFOLIO / 2026</span>
      </div>
    </div>,
    size,
  );
}
