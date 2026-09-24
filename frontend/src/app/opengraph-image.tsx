import { ImageResponse } from "next/og";

export const alt = "Ajmir Aribam — Software Engineer";
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
        padding: "54px 64px",
        background: "#f5f1e9",
        color: "#18211e",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <svg width="68" height="68" viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M5 52 21 11 37 52M27 52 43 11 59 52M12 38h40"
            fill="none"
            stroke="#2e5a49"
            strokeWidth="5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
        <div style={{ fontSize: 25, letterSpacing: 3, fontWeight: 700 }}>
          AJMIR ARIBAM
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 80,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -4,
          }}
        >
          <span>I build the product and</span>
          <span>the system behind it.</span>
        </div>
        <div style={{ fontSize: 29, color: "#2e5a49", marginTop: 27 }}>
          Software Engineer · Backend · Product · Quality
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #cad4ca",
          paddingTop: 20,
          fontSize: 19,
          letterSpacing: 2,
        }}
      >
        <span>PORTFOLIO / 2026</span>
        <span>SELECTED WORK · ENGINEERING · ABOUT</span>
      </div>
    </div>,
    size,
  );
}
