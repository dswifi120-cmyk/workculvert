import { NextResponse } from "next/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { employerOtps, employers } from "@/db/schema";

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const phone = typeof body?.phone === "string" ? cleanPhone(body.phone) : "";
    const code = typeof body?.code === "string" ? body.code.trim() : "";
    const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "নিয়োগদাতা";
    const location = typeof body?.location === "string" ? body.location.trim() : "বগুড়া";

    const latest = await db
      .select()
      .from(employerOtps)
      .where(and(eq(employerOtps.phone, phone), gt(employerOtps.expiresAt, new Date())))
      .orderBy(desc(employerOtps.createdAt))
      .limit(1);

    if (!latest[0] || latest[0].code !== code) {
      return NextResponse.json({ ok: false, error: "OTP সঠিক নয় বা মেয়াদ শেষ।" }, { status: 400 });
    }

    await db
      .insert(employers)
      .values({ fullName, phone, location, isPhoneVerified: true })
      .onConflictDoUpdate({
        target: employers.phone,
        set: { fullName, location, isPhoneVerified: true },
      });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[employer/verify-otp] failed:", err);
    return NextResponse.json({ ok: false, error: "OTP যাচাই করা যায়নি।" }, { status: 500 });
  }
}
