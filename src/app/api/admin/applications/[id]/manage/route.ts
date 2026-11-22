import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { applications, jobs } from "@/db/schema";
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
  const appId = Number(id);
  if (!Number.isInteger(appId) || appId < 1) {
    return NextResponse.json({ ok: false, error: "Invalid application id" }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as { action?: string };
  const action = body.action ?? "";
  const db = await getDb();

  const existing = await db
    .select()
    .from(applications)
    .where(eq(applications.id, appId))
    .limit(1);

  const appRow = existing[0];
  if (!appRow) {
    return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });
  }

  if (action === "accept_and_assign") {
    const workerId = Number(appRow.applicantUid);
    await db
      .update(applications)
      .set({ status: "গৃহীত (Assigned)" })
      .where(eq(applications.id, appId));

    if (Number.isInteger(workerId) && workerId > 0) {
      await db
        .update(jobs)
        .set({
          assignedWorkerId: workerId,
          status: "assigned",
          verifiedByAdmin: true,
          workerResponse: "accepted",
          workerResponseAt: new Date(),
        })
        .where(eq(jobs.id, appRow.jobId));
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "reject") {
    await db
      .update(applications)
      .set({ status: "বাতিল (Rejected)" })
      .where(eq(applications.id, appId));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
