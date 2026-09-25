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
        padding: "58px 70px",
        background: "#F8F6F1",
        color: "#0F1F1E",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width="72" height="58" viewBox="145 10 410 300" aria-hidden="true">
          <path
            d="M360 76h15c24 0 39 12 52 37l74 140c10 21 24 34 38 42h-63z"
            fill="#6B8BA7"
          />
          <path d="m160 295 107-185 15 25-89 160z" fill="#0F1F1E" />
          <path d="m322 22-43 73 90 170c10 19 25 30 46 30h41z" fill="#0F1F1E" />
          <path
            d="M252 213h45c17 0 30 9 40 27l33 55h-48l-18-37c-11-23-27-42-52-42z"
            fill="#0F1F1E"
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 28, letterSpacing: 5, fontWeight: 500 }}>
            AJMIR ARIBAM
          </span>
          <span
            style={{
              marginTop: 4,
              color: "#526A7A",
              fontSize: 11,
              letterSpacing: 4,
            }}
          >
            BUILDING USEFUL SYSTEMS
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <span style={{ color: "#365D76", fontSize: 18, letterSpacing: 3 }}>
          SOFTWARE ENGINEER
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 1040,
            fontSize: 66,
            fontWeight: 650,
            lineHeight: 1.08,
            letterSpacing: -2.5,
          }}
        >
          <span>I build software products</span>
          <span>and the systems behind them.</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #C9C5BC",
          paddingTop: 17,
          color: "#4E5C5E",
          fontSize: 15,
          letterSpacing: 2,
        }}
      >
        <span>SELECTED WORK · ENGINEERING · NOTES</span>
        <span>AJMIRARIBAM.COM</span>
      </div>
    </div>,
    size,
  );
}
