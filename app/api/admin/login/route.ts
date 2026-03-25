import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  ADMIN_COOKIE,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Admin not configured" },
      { status: 500 }
    );
  }

  if (body.password !== expected) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = createSessionToken(Date.now());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookieOptions(token));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    maxAge: 0,
    path: "/",
  });
  return res;
}
