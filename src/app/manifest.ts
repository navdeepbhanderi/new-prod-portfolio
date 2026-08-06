import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Navdeep Bhanderi - Senior Frontend Engineer",
    short_name: "Navdeep",
    description:
      "Frontend engineer with full-stack range, building and leading frontend delivery across modern web stacks.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    // Generated from the N-mark by app/icon.tsx and app/apple-icon.tsx.
    icons: [
      { src: "/icon", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
