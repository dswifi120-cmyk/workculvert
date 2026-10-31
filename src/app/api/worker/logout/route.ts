import { NextResponse } from "next/server";
import { clearWorkerSession } from "@/lib/auth";

export async function POST() {
  await clearWorkerSession();
  return NextResponse.json({ ok: true });
}
