import { NextResponse } from "next/server";
import { db } from "@/db";
import { workerOtps } from "@/db/schema";
import { expiresInMinutes } from "@/lib/security";

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

    const code = "123456";
    await db.insert(workerOtps).values({ phone, code, expiresAt: expiresInMinutes(10) });

    return NextResponse.json({
      ok: true,
      demoCode: code,
      message: "ডেমো OTP পাঠানো হয়েছে।",
    });
  } catch (err) {
    console.error("[worker/request-otp] failed:", err);
    return NextResponse.json({ ok: false, error: "OTP পাঠানো যায়নি।" }, { status: 500 });
  }
}
