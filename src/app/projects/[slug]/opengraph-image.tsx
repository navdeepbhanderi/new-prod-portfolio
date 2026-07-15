import { ImageResponse } from "next/og";
import { PROJECTS } from "@/data/projects";
import { PROFILE } from "@/lib/profile";

export const alt = "Case study — Navdeep Bhanderi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);
  const title = project?.title ?? PROFILE.name;
  const tagline = project?.tagline ?? PROFILE.headline;
  const stack = project?.stack ?? [];

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
          Case study
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ fontSize: 34, color: "#a1a1aa", maxWidth: 940 }}>{tagline}</div>
        </div>

        <div style={{ display: "flex", gap: 12, fontSize: 24, color: "#71717a" }}>
          {stack.slice(0, 5).map((t) => (
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
