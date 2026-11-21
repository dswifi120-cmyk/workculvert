import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { workers } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.redirect(new URL("/admin/login", req.url));

  const { id } = await params;
  const workerId = Number(id);
  if (!Number.isInteger(workerId) || workerId < 1) {
    return NextResponse.redirect(new URL("/admin?error=invalid-id", req.url));
  }

  const db = await getDb();
  await db
    .update(workers)
    .set({ isApproved: true, status: "approved", approvedAt: new Date() })
    .where(eq(workers.id, workerId));

  return NextResponse.redirect(new URL("/admin?ok=worker-approved", req.url));
}
