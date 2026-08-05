import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS applies its own squircle mask, so this one is full-bleed — a rounded
 * rect here would show a double corner.
 */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><path d="M16 33V15l13 18V15" stroke="#08080a" stroke-width="3.2" stroke-linecap="square" stroke-linejoin="miter"/></svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
        }}
      >
        <img
          width="132"
          height="132"
          alt=""
          src={`data:image/svg+xml;utf8,${encodeURIComponent(MARK)}`}
        />
      </div>
    ),
    { ...size }
  );
}
