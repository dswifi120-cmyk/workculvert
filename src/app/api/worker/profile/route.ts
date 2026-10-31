import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { workers } from "@/db/schema";
import { getCurrentWorker } from "@/lib/auth";

export async function POST(req: Request) {
  const worker = await getCurrentWorker();
  if (!worker) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const form = await req.formData();
  const currentLocation = String(form.get("currentLocation") ?? "").trim();
  const isActive = form.get("isActive") === "on";
  const bio = String(form.get("bio") ?? "").trim();

  await db
    .update(workers)
    .set({
      currentLocation: currentLocation || worker.currentLocation,
      isActive,
      bio: bio.slice(0, 400),
    })
    .where(eq(workers.id, worker.id));

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
