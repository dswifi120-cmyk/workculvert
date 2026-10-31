import { NextResponse } from "next/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { workerOtps } from "@/db/schema";

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const phone = typeof body?.phone === "string" ? cleanPhone(body.phone) : "";
    const code = typeof body?.code === "string" ? body.code.trim() : "";

    const latest = await db
      .select()
      .from(workerOtps)
      .where(and(eq(workerOtps.phone, phone), gt(workerOtps.expiresAt, new Date())))
      .orderBy(desc(workerOtps.createdAt))
      .limit(1);

    if (!latest[0] || latest[0].code !== code) {
      return NextResponse.json({ ok: false, error: "OTP সঠিক নয় বা মেয়াদ শেষ।" }, { status: 400 });
    }

    await db.update(workerOtps).set({ verified: true }).where(eq(workerOtps.id, latest[0].id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[worker/verify-otp] failed:", err);
    return NextResponse.json({ ok: false, error: "OTP যাচাই করা যায়নি।" }, { status: 500 });
  }
}
