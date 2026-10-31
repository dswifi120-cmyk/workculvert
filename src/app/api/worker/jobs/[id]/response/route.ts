import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { getCurrentWorker } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const worker = await getCurrentWorker();
    if (!worker) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as { response?: string } | null;
    const response = body?.response === "accepted" ? "accepted" : "declined";

    const { id } = await params;

    // Check if job is actually assigned to this worker
    const jobRows = await db.select().from(jobs).where(eq(jobs.id, Number(id))).limit(1);
    const job = jobRows[0];

    if (!job || job.assignedWorkerId !== worker.id) {
      return NextResponse.json({ ok: false, error: "কাজটি আপনাকে অ্যাসাইন করা হয়নি।" }, { status: 403 });
    }

    await db.update(jobs).set({
      workerResponse: response,
      workerResponseAt: new Date()
    }).where(eq(jobs.id, job.id));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[job response] failed:", err);
    return NextResponse.json({ ok: false, error: "সার্ভারে সমস্যা হয়েছে।" }, { status: 500 });
  }
}
