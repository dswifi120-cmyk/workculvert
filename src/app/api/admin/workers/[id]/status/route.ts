import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { workers, workerSessions } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.redirect(new URL("/admin/login", req.url));

  const { id } = await params;
  const workerId = Number(id);
  if (!Number.isInteger(workerId) || workerId < 1) {
    return NextResponse.redirect(new URL("/admin?error=invalid-id", req.url));
  }

  const form = await req.formData();
  const action = String(form.get("action") ?? "");
  const activating = action === "activate";

  const db = await getDb();
  await db
    .update(workers)
    .set({
      isActive: activating,
      isApproved: activating ? true : false,
      status: activating ? "approved" : "inactive",
    })
    .where(eq(workers.id, workerId));

  if (!activating) {
    await db.delete(workerSessions).where(eq(workerSessions.workerId, workerId));
  }

  return NextResponse.redirect(new URL("/admin?ok=worker-status", req.url));
}
