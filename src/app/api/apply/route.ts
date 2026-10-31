import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { getCurrentWorker } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const worker = await getCurrentWorker();
    if (!worker) {
      return NextResponse.json({ ok: false, error: "আবেদনের আগে worker login করুন।" }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const jobId = Number(body?.jobId);
    const jobTitle = typeof body?.jobTitle === "string" ? body.jobTitle.trim().slice(0, 120) : "";

    if (!Number.isInteger(jobId) || jobId < 1) {
      return NextResponse.json({ ok: false, error: "কাজটি খুঁজে পাওয়া যায়নি।" }, { status: 400 });
    }
    if (!jobTitle) {
      return NextResponse.json({ ok: false, error: "কাজের তথ্য অসম্পূর্ণ।" }, { status: 400 });
    }

    const inserted = await db
      .insert(applications)
      .values({
        jobId,
        jobTitle,
        applicantUid: String(worker.id),
        applicantName: worker.fullName,
        applicantEmail: worker.phone,
      })
      .onConflictDoNothing()
      .returning({ id: applications.id });

    if (inserted.length === 0) {
      return NextResponse.json({ ok: true, duplicate: true, message: "আপনি এই কাজে আগেই আবেদন করেছেন।" });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[apply] POST failed:", err);
    return NextResponse.json({ ok: false, error: "সার্ভারে সমস্যা — কিছুক্ষণ পর চেষ্টা করুন।" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const worker = await getCurrentWorker();
    if (!worker) {
      return NextResponse.json({ ok: false, error: "ইউজার চেনা গেল না।" }, { status: 401 });
    }
    const rows = await db
      .select()
      .from(applications)
      .where(eq(applications.applicantUid, String(worker.id)))
      .orderBy(desc(applications.createdAt))
      .limit(20);
    return NextResponse.json({ ok: true, applications: rows });
  } catch (err) {
    console.error("[apply] GET failed:", err);
    return NextResponse.json({ ok: false, error: "তথ্য আনা যায়নি।" }, { status: 500 });
  }
}
