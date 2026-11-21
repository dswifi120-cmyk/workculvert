import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { employers, jobs, legalLogs } from "@/db/schema";
import { VALID_CATEGORY_VALUES, VALID_JOB_TYPES } from "@/lib/categories";
import { getServerLocale } from "@/lib/server-locale";

const BN_DIGIT_MAP: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
};

export function toLatinDigits(s: string) {
  return s.replace(/[০-৯]/g, (d) => BN_DIGIT_MAP[d] ?? d);
}

export function cleanPhone(phone: string) {
  return toLatinDigits(phone).replace(/[^\d+]/g, "").trim();
}

export async function POST(req: Request) {
  const locale = await getServerLocale();
  const isEn = locale === "en";

  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json(
        { ok: false, error: isEn ? "Please submit valid information." : "সঠিক তথ্য পাঠান।" },
        { status: 400 }
      );
    }

    const employerName = typeof body.employerName === "string" ? body.employerName.trim() : "";
    const phone = typeof body.phone === "string" ? cleanPhone(body.phone) : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const location = typeof body.location === "string" ? body.location.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const jobType = typeof body.jobType === "string" ? body.jobType.trim() : "দৈনিক";
    const durationText = typeof body.durationText === "string" ? body.durationText.trim() : "১ দিন";
    const urgent = Boolean(body.urgent);
    const termsAccepted = body.terms === "on" || body.terms === true;
    const budgetRaw =
      typeof body.budget === "string" || typeof body.budget === "number"
        ? toLatinDigits(String(body.budget)).replace(/[,৳\s]/g, "")
        : "";
    const budget = Number(budgetRaw);

    if (employerName.length < 2) {
      return NextResponse.json(
        { ok: false, error: isEn ? "Please enter your name." : "আপনার নাম লিখুন।" },
        { status: 400 }
      );
    }
    if (phone.length < 11 || phone.length > 16) {
      return NextResponse.json(
        { ok: false, error: isEn ? "Please enter a valid phone number." : "সঠিক ফোন নম্বর দিন।" },
        { status: 400 }
      );
    }
    if (title.length < 4 || title.length > 140) {
      return NextResponse.json(
        { ok: false, error: isEn ? "Work title must be at least 4 characters." : "কাজের নাম কমপক্ষে ৪ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }
    if (!VALID_CATEGORY_VALUES.includes(category)) {
      return NextResponse.json(
        { ok: false, error: isEn ? "Please choose a valid category." : "সঠিক ক্যাটাগরি বেছে নিন।" },
        { status: 400 }
      );
    }
    if (location.length < 2 || location.length > 80) {
      return NextResponse.json(
        { ok: false, error: isEn ? "Please enter a valid work location." : "কাজের সঠিক লোকেশন লিখুন।" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(budget) || budget < 100 || budget > 1000000) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Budget must be between ৳100 and ৳1,000,000."
            : "বাজেট ৳১০০ থেকে ৳১০,০০,০০০ এর মধ্যে দিন।",
        },
        { status: 400 }
      );
    }
    if (!termsAccepted) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "You must accept the Terms, Policy & Conditions before posting."
            : "কাজ পোস্টের আগে Terms, Policy & Conditions accept করতে হবে।",
        },
        { status: 400 }
      );
    }

    const db = await getDb();
    const employerRows = await db.select().from(employers).where(eq(employers.phone, phone)).limit(1);
    const employer = employerRows[0];
    if (!employer?.isPhoneVerified) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Please verify your phone OTP before posting."
            : "কাজ পোস্টের আগে ফোন OTP যাচাই করুন।",
        },
        { status: 403 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "0.0.0.0";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await db
      .insert(legalLogs)
      .values({
        userType: "employer",
        userPhone: phone,
        ipAddress: ip,
        userAgent,
      })
      .catch((e) => console.error("Legal log error:", e));

    await db.insert(jobs).values({
      employerId: employer.id,
      title,
      category,
      location,
      description,
      budget: Math.round(budget),
      durationText: durationText || "১ দিন",
      jobType: (VALID_JOB_TYPES as readonly string[]).includes(jobType) ? jobType : "দৈনিক",
      urgent,
      postedBy: employerName,
      contactPhone: phone,
      otpVerified: true,
      status: "pending_review",
      verifiedByAdmin: false,
    });

    return NextResponse.json({
      ok: true,
      message: isEn
        ? "Work posted — it will be shared with workers after admin verification."
        : "কাজ পোস্ট হয়েছে — অ্যাডমিন যাচাইয়ের পর worker-দের কাছে যাবে।",
    });
  } catch (err) {
    console.error("[jobs] POST failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: isEn
          ? "Server error. Please try again shortly."
          : "সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
