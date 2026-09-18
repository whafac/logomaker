import { createHash } from "crypto";
import { NextRequest } from "next/server";

interface RateBucket {
  count: number;
  resetAt: number;
}

// 서버리스 인스턴스 단위 인메모리 제한 (MVP용)
const buckets = new Map<string, RateBucket>();

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

// 분당 요청 수 제한 확인
export function checkRateLimit(
  request: NextRequest,
  scope: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const key = `${scope}:${getClientKey(request)}`;
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSec: 0,
  };
}

// 진행 중 요청 중복 실행 방지용 잠금
const inflight = new Set<string>();

export function tryAcquireInflight(request: NextRequest, scope: string): boolean {
  const key = `${scope}:${getClientKey(request)}`;
  if (inflight.has(key)) return false;
  inflight.add(key);
  return true;
}

export function releaseInflight(request: NextRequest, scope: string): void {
  const key = `${scope}:${getClientKey(request)}`;
  inflight.delete(key);
}
