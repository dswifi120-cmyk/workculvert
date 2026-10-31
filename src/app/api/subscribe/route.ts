import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      email?: unknown;
    } | null;

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (email.length > 320) {
      return NextResponse.json(
        { ok: false, error: "Email is too long." },
        { status: 400 }
      );
    }

    await db.insert(subscribers).values({ email }).onConflictDoNothing();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
