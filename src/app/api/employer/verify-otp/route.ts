import { NextResponse } from "next/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { employerOtps, employers } from "@/db/schema";
import { cleanPhone, toLatinDigits } from "@/app/api/jobs/route";
import { getServerLocale } from "@/lib/server-locale";

export async function POST(req: Request) {
  const isEn = (await getServerLocale()) === "en";
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const phone = typeof body?.phone === "string" ? cleanPhone(body.phone) : "";
    const code = typeof body?.code === "string" ? toLatinDigits(body.code).trim() : "";
    const fullName = typeof body?.fullName === "string" && body.fullName.trim() ? body.fullName.trim() : "নিয়োগদাতা";
    const location = typeof body?.location === "string" && body.location.trim() ? body.location.trim() : "বগুড়া";

    const db = await getDb();
    const latest = await db
      .select()
      .from(employerOtps)
      .where(and(eq(employerOtps.phone, phone), gt(employerOtps.expiresAt, new Date())))
      .orderBy(desc(employerOtps.createdAt))
      .limit(1);

    if (!latest[0] || latest[0].code !== code) {
      return NextResponse.json(
        { ok: false, error: isEn ? "Invalid or expired OTP code." : "OTP সঠিক নয় বা মেয়াদ শেষ।" },
        { status: 400 }
      );
    }

    // Consume OTP so it cannot be replayed
    await db.delete(employerOtps).where(eq(employerOtps.id, latest[0].id));

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
    return NextResponse.json(
      { ok: false, error: isEn ? "Could not verify OTP." : "OTP যাচাই করা যায়নি।" },
      { status: 500 }
    );
  }
}
