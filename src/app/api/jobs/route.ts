import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { employers, jobs, legalLogs } from "@/db/schema";

const BN_DIGIT_MAP: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
};

function toLatinDigits(s: string) {
  return s.replace(/[০-৯]/g, (d) => BN_DIGIT_MAP[d] ?? d);
}

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

const VALID_CATEGORIES = [
  "ইলেকট্রিশিয়ান",
  "প্লাম্বার",
  "ক্লিনার",
  "কেয়ারগিভার",
  "রংমিস্ত্রি",
  "কারপেন্টার",
  "ড্রাইভার",
  "নিরাপত্তাকর্মী",
  "এসি মিস্ত্রি",
  "অন্যান্য",
];

const VALID_TYPES = ["দৈনিক", "সাপ্তাহিক", "মাসিক", "চুক্তিভিত্তিক"];

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ ok: false, error: "সঠিক তথ্য পাঠান।" }, { status: 400 });
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

    if (employerName.length < 3) {
      return NextResponse.json({ ok: false, error: "আপনার নাম লিখুন।" }, { status: 400 });
    }
    if (phone.length < 11 || phone.length > 16) {
      return NextResponse.json({ ok: false, error: "সঠিক ফোন নম্বর দিন।" }, { status: 400 });
    }
    if (title.length < 4 || title.length > 120) {
      return NextResponse.json({ ok: false, error: "কাজের নাম কমপক্ষে ৪ অক্ষরের হতে হবে।" }, { status: 400 });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ ok: false, error: "সঠিক ক্যাটাগরি বেছে নিন।" }, { status: 400 });
    }
    if (location.length < 2 || location.length > 80) {
      return NextResponse.json({ ok: false, error: "কাজের সঠিক লোকেশন লিখুন।" }, { status: 400 });
    }
    if (!Number.isFinite(budget) || budget < 100 || budget > 1000000) {
      return NextResponse.json({ ok: false, error: "বাজেট ৳১০০ থেকে ৳১০,০০,০০০ এর মধ্যে দিন।" }, { status: 400 });
    }
    if (!termsAccepted) {
      return NextResponse.json({ ok: false, error: "কাজ পোস্টের আগে Terms, Policy & Conditions accept করতে হবে।" }, { status: 400 });
    }

    const employerRows = await db.select().from(employers).where(eq(employers.phone, phone)).limit(1);
    const employer = employerRows[0];
    if (!employer?.isPhoneVerified) {
      return NextResponse.json({ ok: false, error: "কাজ পোস্টের আগে ফোন OTP যাচাই করুন।" }, { status: 403 });
    }

    // IP Address & User Agent collect করা
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "0.0.0.0";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await db.insert(legalLogs).values({
      userType: "employer",
      userPhone: phone,
      ipAddress: ip,
      userAgent: userAgent,
    }).catch(e => console.error("Legal log error:", e));

    await db.insert(jobs).values({
      employerId: employer.id,
      title,
      category,
      location,
      description,
      budget: Math.round(budget),
      durationText: durationText || "১ দিন",
      jobType: VALID_TYPES.includes(jobType) ? jobType : "দৈনিক",
      urgent,
      postedBy: employerName,
      contactPhone: phone,
      otpVerified: true,
      status: "pending_review",
      verifiedByAdmin: false,
    });

    return NextResponse.json({
      ok: true,
      message: "কাজ পোস্ট হয়েছে — অ্যাডমিন যাচাইয়ের পর worker-দের কাছে যাবে।",
    });
  } catch (err) {
    console.error("[jobs] POST failed:", err);
    return NextResponse.json({ ok: false, error: "সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।" }, { status: 500 });
  }
}
