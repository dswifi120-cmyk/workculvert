import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { jobs } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const jobId = Number(id);
  if (!Number.isInteger(jobId) || jobId < 1) {
    return NextResponse.json({ ok: false, error: "Invalid job id" }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    workerId?: number | string;
    title?: string;
    location?: string;
    budget?: number | string;
    description?: string;
  };

  const db = await getDb();
  const action = body.action ?? "";

  if (action === "verify") {
    await db
      .update(jobs)
      .set({ verifiedByAdmin: true, status: "verified" })
      .where(eq(jobs.id, jobId));
    return NextResponse.json({ ok: true, status: "verified" });
  }

  if (action === "unpublish" || action === "reject") {
    await db
      .update(jobs)
      .set({
        verifiedByAdmin: false,
        status: action === "reject" ? "rejected" : "pending_review",
        assignedWorkerId: null,
      })
      .where(eq(jobs.id, jobId));
    return NextResponse.json({ ok: true, status: action });
  }

  if (action === "complete") {
    await db
      .update(jobs)
      .set({ status: "completed" })
      .where(eq(jobs.id, jobId));
    return NextResponse.json({ ok: true, status: "completed" });
  }

  if (action === "assign") {
    const workerId = Number(body.workerId ?? 0);
    if (!Number.isInteger(workerId) || workerId < 1) {
      await db
        .update(jobs)
        .set({
          assignedWorkerId: null,
          status: "verified",
          workerResponse: "pending",
        })
        .where(eq(jobs.id, jobId));
      return NextResponse.json({ ok: true, status: "unassigned" });
    }

    await db
      .update(jobs)
      .set({
        assignedWorkerId: workerId,
        status: "assigned",
        verifiedByAdmin: true,
        workerResponse: "pending",
      })
      .where(eq(jobs.id, jobId));
    return NextResponse.json({ ok: true, status: "assigned" });
  }

  if (action === "edit") {
    const updates: Partial<typeof jobs.$inferInsert> = {};
    if (typeof body.title === "string" && body.title.trim().length >= 3) {
      updates.title = body.title.trim();
    }
    if (typeof body.location === "string" && body.location.trim().length >= 2) {
      updates.location = body.location.trim();
    }
    if (body.budget !== undefined) {
      const b = Number(body.budget);
      if (Number.isFinite(b) && b >= 50) updates.budget = Math.round(b);
    }
    if (typeof body.description === "string") {
      updates.description = body.description.trim();
    }
    await db.update(jobs).set(updates).where(eq(jobs.id, jobId));
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    await db.delete(jobs).where(eq(jobs.id, jobId));
    return NextResponse.json({ ok: true, deleted: true });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
