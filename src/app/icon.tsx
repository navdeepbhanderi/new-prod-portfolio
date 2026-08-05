import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

/**
 * Favicon form of the N-mark: inverted, and without the release dot — at 16px
 * the dot collapses into the stroke and reads as noise. Delivered as a data-URI
 * so the geometry survives satori without an SVG-element dependency.
 */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><path d="M16 33V15l13 18V15" stroke="#08080a" stroke-width="3.2" stroke-linecap="square" stroke-linejoin="miter"/></svg>`;

export default function Icon() {
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
          borderRadius: 48,
        }}
      >
        <img
          width="150"
          height="150"
          alt=""
          src={`data:image/svg+xml;utf8,${encodeURIComponent(MARK)}`}
        />
      </div>
    ),
    { ...size }
  );
}
