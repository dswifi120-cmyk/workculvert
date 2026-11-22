import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { workers, workerSessions } from "@/db/schema";
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
  const workerId = Number(id);
  if (!Number.isInteger(workerId) || workerId < 1) {
    return NextResponse.json({ ok: false, error: "Invalid worker id" }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as { action?: string };
  const action = body.action ?? "";
  const db = await getDb();

  if (action === "approve") {
    await db
      .update(workers)
      .set({
        isApproved: true,
        isActive: true,
        status: "approved",
        approvedAt: new Date(),
      })
      .where(eq(workers.id, workerId));
    return NextResponse.json({ ok: true, status: "approved" });
  }

  if (action === "activate") {
    await db
      .update(workers)
      .set({ isActive: true, isApproved: true, status: "approved" })
      .where(eq(workers.id, workerId));
    return NextResponse.json({ ok: true, status: "active" });
  }

  if (action === "deactivate") {
    await db
      .update(workers)
      .set({ isActive: false, status: "inactive" })
      .where(eq(workers.id, workerId));
    return NextResponse.json({ ok: true, status: "inactive" });
  }

  if (action === "reject" || action === "suspend") {
    await db
      .update(workers)
      .set({
        isApproved: false,
        isActive: false,
        status: action === "reject" ? "rejected" : "suspended",
      })
      .where(eq(workers.id, workerId));
    await db
      .delete(workerSessions)
      .where(eq(workerSessions.workerId, workerId));
    return NextResponse.json({ ok: true, status: action });
  }

  if (action === "delete") {
    await db.delete(workers).where(eq(workers.id, workerId));
    return NextResponse.json({ ok: true, deleted: true });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
