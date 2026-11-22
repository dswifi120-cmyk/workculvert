import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { applications, jobs } from "@/db/schema";
import { getCurrentWorker } from "@/lib/auth";
import { getServerLocale } from "@/lib/server-locale";

export async function POST(req: Request) {
  const isEn = (await getServerLocale()) === "en";
  try {
    const worker = await getCurrentWorker();
    if (!worker) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Please log in as an approved worker before applying."
            : "আবেদনের আগে worker login করুন।",
        },
        { status: 401 }
      );
    }

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const jobId = Number(body?.jobId);

    if (!Number.isInteger(jobId) || jobId < 1) {
      return NextResponse.json(
        { ok: false, error: isEn ? "Job not found." : "কাজটি খুঁজে পাওয়া যায়নি।" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const jobRows = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
    const job = jobRows[0];
    if (!job || !job.verifiedByAdmin) {
      return NextResponse.json(
        { ok: false, error: isEn ? "This job is not open for applications." : "কাজটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const inserted = await db
      .insert(applications)
      .values({
        jobId,
        jobTitle: job.title.slice(0, 120),
        applicantUid: String(worker.id),
        applicantName: worker.fullName,
        applicantEmail: worker.phone,
      })
      .onConflictDoNothing()
      .returning({ id: applications.id });

    if (inserted.length === 0) {
      return NextResponse.json({
        ok: true,
        duplicate: true,
        message: isEn ? "You have already applied to this job." : "আপনি এই কাজে আগেই আবেদন করেছেন।",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[apply] POST failed:", err);
    return NextResponse.json(
      { ok: false, error: isEn ? "Server error — please try again." : "সার্ভারে সমস্যা — কিছুক্ষণ পর চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const isEn = (await getServerLocale()) === "en";
  try {
    const worker = await getCurrentWorker();
    if (!worker) {
      return NextResponse.json(
        { ok: false, error: isEn ? "Unauthorized." : "ইউজার চেনা গেল না।" },
        { status: 401 }
      );
    }
    const db = await getDb();
    const rows = await db
      .select()
      .from(applications)
      .where(eq(applications.applicantUid, String(worker.id)))
      .orderBy(desc(applications.createdAt))
      .limit(20);
    return NextResponse.json({ ok: true, applications: rows });
  } catch (err) {
    console.error("[apply] GET failed:", err);
    return NextResponse.json(
      { ok: false, error: isEn ? "Could not load applications." : "তথ্য আনা যায়নি।" },
      { status: 500 }
    );
  }
}
