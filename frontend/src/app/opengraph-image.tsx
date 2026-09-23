import { ImageResponse } from "next/og";
export const alt =
  "MD Ajmir Aribam — Software Engineer, Backend, Cloud & DevOps";
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
        background: "#ece9e2",
        color: "#1e2427",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          letterSpacing: 5,
          borderBottom: "2px solid #1e2427",
          paddingBottom: 24,
        }}
      >
        MD AJMIR ARIBAM{" "}
        <span style={{ marginLeft: "auto", color: "#9d573e" }}>A.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 85, lineHeight: 1.05, fontWeight: 700 }}>
          Software Engineer
        </div>
        <div style={{ fontSize: 57, color: "#9d573e", marginTop: 12 }}>
          Backend, Cloud &amp; DevOps.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          borderTop: "2px solid #1e2427",
          paddingTop: 24,
        }}
      >
        <span>BUILD THE SYSTEM. OWN THE BOUNDARY.</span>
        <span>ENGINEERING PORTFOLIO / 2026</span>
      </div>
    </div>,
    size,
  );
}
