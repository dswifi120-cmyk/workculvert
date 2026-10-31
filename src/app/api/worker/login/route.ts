import { NextResponse } from "next/server";
import { db } from "@/db";
import { workers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/security";
import { createWorkerSession } from "@/lib/auth";

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const phone = typeof body?.phone === "string" ? cleanPhone(body.phone) : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!phone || !password) {
      return NextResponse.json({ ok: false, error: "ফোন নম্বর ও পাসওয়ার্ড দিন।" }, { status: 400 });
    }

    const rows = await db.select().from(workers).where(eq(workers.phone, phone)).limit(1);
    const worker = rows[0];
    if (!worker || !verifyPassword(password, worker.passwordHash)) {
      return NextResponse.json({ ok: false, error: "ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়।" }, { status: 401 });
    }
    if (!worker.isApproved || worker.status !== "approved") {
      return NextResponse.json({ ok: false, error: "আপনার প্রোফাইল এখনো অ্যাডমিন দ্বারা অনুমোদিত হয়নি।" }, { status: 403 });
    }

    await createWorkerSession(worker.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[worker/login] failed:", err);
    return NextResponse.json({ ok: false, error: "সার্ভার সমস্যা হয়েছে।" }, { status: 500 });
  }
}
