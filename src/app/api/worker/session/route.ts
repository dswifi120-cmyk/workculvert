import { NextResponse } from "next/server";
import { getCurrentWorker } from "@/lib/auth";

export async function GET() {
  const worker = await getCurrentWorker();
  return NextResponse.json({ ok: true, worker });
}
