/**
 * Best-effort in-memory sliding-window rate limiter. Per serverless instance
 * (resets on cold start, not shared across instances). Swap for a shared
 * store (e.g. @upstash/ratelimit) if real abuse shows up.
 */
export function createRateLimiter({
  windowMs,
  max,
  maxKeys = 5000,
}: {
  windowMs: number;
  max: number;
  maxKeys?: number;
}): (key: string) => boolean {
  const hits = new Map<string, number[]>();

  return function isLimited(key: string): boolean {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    const limited = recent.length >= max;
    if (!limited) recent.push(now);

    // Delete-then-set keeps Map insertion order tracking recency, so the
    // eviction below drops the least-recently-seen keys first.
    hits.delete(key);
    hits.set(key, recent);
    for (const k of hits.keys()) {
      if (hits.size <= maxKeys) break;
      hits.delete(k);
    }

    return limited;
  };
}

/** Client IP as seen through the platform proxy (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
