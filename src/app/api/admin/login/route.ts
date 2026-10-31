import { NextResponse } from "next/server";
import { ADMIN_EMAIL, ADMIN_OTP_CODE, createAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const code = typeof body?.code === "string" ? body.code.trim() : "";

    if (email !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ ok: false, error: "এই ইমেইলটি অ্যাডমিন হিসেবে অনুমোদিত নয়।" }, { status: 401 });
    }
    if (code !== ADMIN_OTP_CODE) {
      return NextResponse.json({ ok: false, error: "OTP/সিকিউরিটি কোড সঠিক নয়।" }, { status: 401 });
    }

    await createAdminSession(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/login] failed:", err);
    return NextResponse.json({ ok: false, error: "সার্ভার সমস্যা হয়েছে।" }, { status: 500 });
  }
}
