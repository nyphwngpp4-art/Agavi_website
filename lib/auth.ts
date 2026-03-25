import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "agavi_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sign(value: string): string {
  const secret = process.env.ADMIN_PASSWORD ?? "fallback-secret";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionToken(timestamp: number): string {
  const payload = `${timestamp}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

// For use in server components
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

// For use in API route handlers (NextRequest)
export function isAdminRequest(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export function sessionCookieOptions(token: string) {
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}
