import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { ADMIN_EMAIL, ADMIN_OTP_CODE, createAdminSession } from "@/lib/auth";
import { getServerLocale } from "@/lib/server-locale";

function safeEquals(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  const isEn = (await getServerLocale()) === "en";
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const code = typeof body?.code === "string" ? body.code.trim() : "";

    if (!safeEquals(email, ADMIN_EMAIL.toLowerCase())) {
      return NextResponse.json(
        { ok: false, error: isEn ? "This email is not authorized as admin." : "এই ইমেইলটি অ্যাডমিন হিসেবে অনুমোদিত নয়।" },
        { status: 401 }
      );
    }
    if (!safeEquals(code, ADMIN_OTP_CODE)) {
      return NextResponse.json(
        { ok: false, error: isEn ? "Invalid OTP / security code." : "OTP/সিকিউরিটি কোড সঠিক নয়।" },
        { status: 401 }
      );
    }

    await createAdminSession(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/login] failed:", err);
    return NextResponse.json(
      { ok: false, error: isEn ? "Server error." : "সার্ভার সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
