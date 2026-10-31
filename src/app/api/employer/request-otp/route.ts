import { NextResponse } from "next/server";
import { db } from "@/db";
import { employerOtps } from "@/db/schema";
import { expiresInMinutes, generateOtpCode } from "@/lib/security";

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const phone = typeof body?.phone === "string" ? cleanPhone(body.phone) : "";
    if (phone.length < 11 || phone.length > 16) {
      return NextResponse.json({ ok: false, error: "সঠিক ফোন নম্বর দিন।" }, { status: 400 });
    }
    const code = generateOtpCode();
    await db.insert(employerOtps).values({ phone, code, expiresAt: expiresInMinutes(10) });

    return NextResponse.json({
      ok: true,
      demoCode: process.env.SMS_PROVIDER ? undefined : code,
      message: process.env.SMS_PROVIDER
        ? "OTP পাঠানো হয়েছে।"
        : "ডেমো মোড: OTP স্ক্রিনেই দেখানো হচ্ছে।",
    });
  } catch (err) {
    console.error("[employer/request-otp] failed:", err);
    return NextResponse.json({ ok: false, error: "OTP পাঠানো যায়নি।" }, { status: 500 });
  }
}
