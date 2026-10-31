import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { workers } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.redirect(new URL("/admin/login", req.url));

  const { id } = await params;
  const form = await req.formData();
  const action = String(form.get("action") ?? "");

  await db
    .update(workers)
    .set({
      isActive: action === "activate",
      status: action === "activate" ? "approved" : "inactive",
    })
    .where(eq(workers.id, Number(id)));

  return NextResponse.redirect(new URL("/admin?ok=worker-status", req.url));
}
