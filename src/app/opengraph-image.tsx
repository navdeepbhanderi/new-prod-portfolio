import { ImageResponse } from "next/og";

export const alt = "Navdeep Bhanderi — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: "80px",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            color: "#a1a1aa",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "1px solid #2a2a2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              color: "#fafafa",
            }}
          >
            NB
          </div>
          navdeepbhanderi
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>
            Navdeep Bhanderi
          </div>
          <div style={{ fontSize: 36, color: "#a1a1aa", maxWidth: 900 }}>
            Building modern, scalable web applications.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, fontSize: 24, color: "#71717a" }}>
          {["Next.js", "React", "Node.js", "Generative AI", "Web3"].map((t) => (
            <div
              key={t}
              style={{
                border: "1px solid #2a2a2e",
                borderRadius: 999,
                padding: "8px 20px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
