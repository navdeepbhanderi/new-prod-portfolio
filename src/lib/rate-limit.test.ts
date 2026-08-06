import { describe, expect, it } from "vitest";
import { createRateLimiter, clientIp } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("allows up to max hits then limits", () => {
    const isLimited = createRateLimiter({ windowMs: 60_000, max: 2 });
    expect(isLimited("a")).toBe(false);
    expect(isLimited("a")).toBe(false);
    expect(isLimited("a")).toBe(true);
  });

  it("tracks keys independently", () => {
    const isLimited = createRateLimiter({ windowMs: 60_000, max: 1 });
    expect(isLimited("a")).toBe(false);
    expect(isLimited("b")).toBe(false);
    expect(isLimited("a")).toBe(true);
  });

  it("evicts oldest keys past maxKeys", () => {
    const isLimited = createRateLimiter({ windowMs: 60_000, max: 1, maxKeys: 2 });
    isLimited("a");
    isLimited("b");
    isLimited("c"); // evicts "a"
    expect(isLimited("a")).toBe(false); // fresh again after eviction
  });
});

describe("clientIp", () => {
  it("takes the first x-forwarded-for entry", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(clientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to unknown", () => {
    expect(clientIp(new Request("http://localhost"))).toBe("unknown");
  });
});
