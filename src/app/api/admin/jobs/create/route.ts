import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { jobs } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";
import { VALID_CATEGORY_VALUES, VALID_JOB_TYPES } from "@/lib/categories";

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const budget = Number(body.budget ?? 0);
  const durationText =
    typeof body.durationText === "string" && body.durationText.trim()
      ? body.durationText.trim()
      : "১ দিন";
  const jobTypeRaw = typeof body.jobType === "string" ? body.jobType.trim() : "দৈনিক";
  const jobType = (VALID_JOB_TYPES as readonly string[]).includes(jobTypeRaw)
    ? jobTypeRaw
    : "দৈনিক";
  const postedBy =
    typeof body.postedBy === "string" && body.postedBy.trim()
      ? body.postedBy.trim()
      : "Admin Verified Client";
  const contactPhone =
    typeof body.contactPhone === "string" ? body.contactPhone.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const urgent = body.urgent === true || body.urgent === "on";

  if (
    title.length < 4 ||
    !VALID_CATEGORY_VALUES.includes(category) ||
    location.length < 2 ||
    !Number.isFinite(budget) ||
    budget < 50
  ) {
    return NextResponse.json(
      { ok: false, error: "সঠিক কাজের শিরোনাম, ক্যাটাগরি, লোকেশন ও বাজেট দিন।" },
      { status: 400 }
    );
  }

  const db = await getDb();
  await db.insert(jobs).values({
    title,
    category,
    location,
    budget: Math.round(budget),
    durationText,
    jobType,
    postedBy,
    contactPhone,
    description,
    urgent,
    otpVerified: true,
    verifiedByAdmin: true,
    status: "verified",
  });

  return NextResponse.json({ ok: true });
}
