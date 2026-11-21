import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { jobs } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.redirect(new URL("/admin/login", req.url));

  const { id } = await params;
  const jobId = Number(id);
  if (!Number.isInteger(jobId) || jobId < 1) {
    return NextResponse.redirect(new URL("/admin?error=invalid-id", req.url));
  }

  const db = await getDb();
  await db
    .update(jobs)
    .set({ verifiedByAdmin: true, status: "verified" })
    .where(eq(jobs.id, jobId));

  return NextResponse.redirect(new URL("/admin?ok=job-verified", req.url));
}
