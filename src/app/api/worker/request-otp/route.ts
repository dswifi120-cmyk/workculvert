import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { workerOtps } from "@/db/schema";
import { expiresInMinutes, generateOtpCode } from "@/lib/security";
import { cleanPhone } from "@/app/api/jobs/route";
import { getServerLocale } from "@/lib/server-locale";

export async function POST(req: Request) {
  const isEn = (await getServerLocale()) === "en";
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const phone = typeof body?.phone === "string" ? cleanPhone(body.phone) : "";
    if (phone.length < 11 || phone.length > 16) {
      return NextResponse.json(
        { ok: false, error: isEn ? "Please enter a valid phone number." : "সঠিক ফোন নম্বর দিন।" },
        { status: 400 }
      );
    }

    const code = generateOtpCode();
    const db = await getDb();
    await db.insert(workerOtps).values({ phone, code, expiresAt: expiresInMinutes(10) });

    return NextResponse.json({
      ok: true,
      demoCode: process.env.SMS_PROVIDER ? undefined : code,
      message: process.env.SMS_PROVIDER
        ? isEn
          ? "OTP has been sent."
          : "OTP পাঠানো হয়েছে।"
        : isEn
          ? "Demo mode: OTP is displayed on screen."
          : "ডেমো মোড: OTP স্ক্রিনেই দেখানো হচ্ছে।",
    });
  } catch (err) {
    console.error("[worker/request-otp] failed:", err);
    return NextResponse.json(
      { ok: false, error: isEn ? "Could not send OTP." : "OTP পাঠানো যায়নি।" },
      { status: 500 }
    );
  }
}
