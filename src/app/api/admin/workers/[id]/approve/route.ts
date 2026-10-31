import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { workers } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.redirect(new URL("/admin/login", req.url));

  const { id } = await params;
  await db
    .update(workers)
    .set({ isApproved: true, status: "approved", approvedAt: new Date() })
    .where(eq(workers.id, Number(id)));

  return NextResponse.redirect(new URL("/admin?ok=worker-approved", req.url));
}
