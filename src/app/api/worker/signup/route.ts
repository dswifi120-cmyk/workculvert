import { NextResponse } from "next/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { workers, legalLogs, workerOtps } from "@/db/schema";
import { hashPassword } from "@/lib/security";

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ ok: false, error: "সঠিক তথ্য পাঠান।" }, { status: 400 });
    }
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const phone = typeof body.phone === "string" ? cleanPhone(body.phone) : "";
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
    const termsAccepted = body.terms === "on" || body.terms === true;
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const baseLocation = typeof body.baseLocation === "string" ? body.baseLocation.trim() : "";
    const currentLocation = typeof body.currentLocation === "string" ? body.currentLocation.trim() : baseLocation;
    const bio = typeof body.bio === "string" ? body.bio.trim() : "";
    const experienceYears = Number(body.experienceYears ?? 0);

    if (fullName.length < 3) {
      return NextResponse.json({ ok: false, error: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }, { status: 400 });
    }
    if (phone.length < 11 || phone.length > 16) {
      return NextResponse.json({ ok: false, error: "সঠিক ফোন নম্বর দিন।" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ ok: false, error: "New password এবং confirm password মেলেনি।" }, { status: 400 });
    }
    if (!termsAccepted) {
      return NextResponse.json({ ok: false, error: "সাইনআপের আগে Terms, Policy & Conditions accept করতে হবে।" }, { status: 400 });
    }
    if (category.length < 2 || baseLocation.length < 2) {
      return NextResponse.json({ ok: false, error: "ক্যাটাগরি ও লোকেশন লিখুন।" }, { status: 400 });
    }

    const verifiedOtp = await db
      .select()
      .from(workerOtps)
      .where(
        and(
          eq(workerOtps.phone, phone),
          eq(workerOtps.verified, true),
          gt(workerOtps.expiresAt, new Date())
        )
      )
      .orderBy(desc(workerOtps.createdAt))
      .limit(1);

    if (!verifiedOtp[0]) {
      return NextResponse.json({ ok: false, error: "সাইনআপের আগে ফোন OTP যাচাই বাধ্যতামূলক।" }, { status: 403 });
    }

    // IP Address & User Agent collect করা
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "0.0.0.0";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await db.insert(workers).values({
      fullName,
      phone,
      passwordHash: hashPassword(password),
      category,
      experienceYears: Number.isFinite(experienceYears) ? Math.max(0, Math.min(40, Math.round(experienceYears))) : 0,
      baseLocation,
      currentLocation,
      bio,
      isApproved: false,
      isActive: false,
      status: "pending",
    });

    // Legal agreement log
    await db.insert(legalLogs).values({
      userType: "worker",
      userPhone: phone,
      ipAddress: ip,
      userAgent: userAgent,
    }).catch(e => console.error("Legal log error:", e));

    return NextResponse.json({
      ok: true,
      message: "প্রোফাইল জমা হয়েছে। অ্যাডমিন যাচাই করলে আপনি লগইন করতে পারবেন।",
    });
  } catch (err) {
    const msg = String((err as Error)?.message ?? "");
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return NextResponse.json({ ok: false, error: "এই ফোন নম্বরে আগে থেকেই প্রোফাইল আছে।" }, { status: 409 });
    }
    console.error("[worker/signup] failed:", err);
    return NextResponse.json({ ok: false, error: "সার্ভার সমস্যা হয়েছে। আবার চেষ্টা করুন।" }, { status: 500 });
  }
}
