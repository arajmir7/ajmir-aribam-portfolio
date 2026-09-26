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
        background: "#EDF1F5",
        color: "#17202E",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width="72" height="58" viewBox="145 10 410 300" aria-hidden="true">
          <path
            d="M360 76h15c24 0 39 12 52 37l74 140c10 21 24 34 38 42h-63z"
            fill="#6B8BA7"
          />
          <path d="m160 295 107-185 15 25-89 160z" fill="#17202E" />
          <path d="m322 22-43 73 90 170c10 19 25 30 46 30h41z" fill="#17202E" />
          <path
            d="M252 213h45c17 0 30 9 40 27l33 55h-48l-18-37c-11-23-27-42-52-42z"
            fill="#17202E"
          />
        </svg>
        <span style={{ fontSize: 32, letterSpacing: 4, fontWeight: 600 }}>
          AJMIR ARIBAM
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <span style={{ color: "#2C568F", fontSize: 18, letterSpacing: 3 }}>
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
          <span>Software that has to work</span>
          <span>beyond the screen.</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #CBD3DD",
          paddingTop: 17,
          color: "#3C4A5C",
          fontSize: 15,
          letterSpacing: 2,
        }}
      >
        <span>SELECTED WORK · ENGINEERING · NOTES</span>
        <span>SOFTWARE ENGINEER</span>
      </div>
    </div>,
    size,
  );
}
