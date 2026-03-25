import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const res = NextResponse.redirect(`${origin}/admin/login`);
  res.cookies.set({ name: ADMIN_COOKIE, value: "", maxAge: 0, path: "/" });
  return res;
}
