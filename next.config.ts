import type { NextConfig } from "next";

// Production only - dev needs eval for HMR. 'unsafe-inline' covers the
// pre-paint intro script and Next's own hydration scripts (no nonce infra).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Allow dev requests from other devices on the LAN (phone testing)
  allowedDevOrigins: ["192.168.1.*"],
  images: {
    formats: ["image/avif", "image/webp"],
    // The hero portrait is the LCP element and a face - q75 (the default)
    // shows on skin tones. Next 15 requires every quality used to be declared.
    qualities: [75, 90],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Content-Security-Policy", value: CSP }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
