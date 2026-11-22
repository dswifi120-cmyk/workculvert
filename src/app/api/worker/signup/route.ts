import { NextResponse } from "next/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { workers, legalLogs, workerOtps } from "@/db/schema";
import { hashPassword } from "@/lib/security";
import { cleanPhone, toLatinDigits } from "@/app/api/jobs/route";
import { VALID_CATEGORY_VALUES } from "@/lib/categories";
import { getServerLocale } from "@/lib/server-locale";

const MAX_IMAGE_DATA_LENGTH = 900_000; // ~650KB compressed JPEG base64

export async function POST(req: Request) {
  const isEn = (await getServerLocale()) === "en";
  try {
    const body = (await req.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (!body) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Please submit valid information."
            : "সঠিক তথ্য পাঠান।",
        },
        { status: 400 }
      );
    }

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const phone =
      typeof body.phone === "string" ? cleanPhone(body.phone) : "";
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword =
      typeof body.confirmPassword === "string" ? body.confirmPassword : "";
    const termsAccepted = body.terms === "on" || body.terms === true;
    const isFresher = body.isFresher === true || body.isFresher === "true";

    // Parse multi-skills array (fallback to single `category` field)
    const rawSkills = Array.isArray(body.skills)
      ? body.skills
          .map((s) => (typeof s === "string" ? s.trim() : ""))
          .filter((s) => VALID_CATEGORY_VALUES.includes(s))
      : [];

    const fallbackCategory =
      typeof body.category === "string" &&
      VALID_CATEGORY_VALUES.includes(body.category.trim())
        ? body.category.trim()
        : "";

    const skillsArray = Array.from(
      new Set(
        rawSkills.length > 0
          ? rawSkills
          : fallbackCategory
            ? [fallbackCategory]
            : isFresher
              ? ["নতুন কর্মী / ফ্রেশার (Fresher)"]
              : []
      )
    );

    const primaryCategory =
      skillsArray[0] ||
      (isFresher ? "নতুন কর্মী / ফ্রেশার (Fresher)" : "");

    const baseLocation =
      typeof body.baseLocation === "string" ? body.baseLocation.trim() : "";
    const currentLocation =
      typeof body.currentLocation === "string" && body.currentLocation.trim()
        ? body.currentLocation.trim()
        : baseLocation;
    const preferredAreas =
      typeof body.preferredAreas === "string"
        ? body.preferredAreas.trim()
        : currentLocation;
    const permanentAddress =
      typeof body.permanentAddress === "string"
        ? body.permanentAddress.trim()
        : "";
    const presentAddress =
      typeof body.presentAddress === "string"
        ? body.presentAddress.trim()
        : "";

    const nidNumber =
      typeof body.nidNumber === "string"
        ? toLatinDigits(body.nidNumber.trim()).replace(/\s+/g, "")
        : "";
    const nidNameMatch =
      body.nidNameMatch === true || body.nidNameMatch === "on";
    const nidFrontImage =
      typeof body.nidFrontImage === "string" ? body.nidFrontImage.trim() : "";
    const nidBackImage =
      typeof body.nidBackImage === "string" ? body.nidBackImage.trim() : "";

    const bio = typeof body.bio === "string" ? body.bio.trim() : "";
    const expRaw = isFresher
      ? "0"
      : body.experienceYears !== undefined
        ? toLatinDigits(String(body.experienceYears))
        : "0";
    const experienceYears = Number(expRaw || 0);

    if (fullName.length < 2) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Full name (matching NID) must be at least 2 characters."
            : "NID কার্ড অনুযায়ী পূর্ণ নাম কমপক্ষে ২ অক্ষরের হতে হবে।",
        },
        { status: 400 }
      );
    }
    if (phone.length < 11 || phone.length > 16) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Please enter a valid 11-digit phone number."
            : "সঠিক ফোন নম্বর দিন।",
        },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Password must be at least 6 characters."
            : "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
        },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Passwords do not match."
            : "New password এবং confirm password মেলেনি।",
        },
        { status: 400 }
      );
    }
    if (!primaryCategory || currentLocation.length < 2) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Please select at least one skill (or Fresher) and your current location."
            : "কমপক্ষে একটি কাজের দক্ষতা (অথবা ফ্রেশার) এবং আপনার বর্তমান অবস্থান নির্বাচন করুন।",
        },
        { status: 400 }
      );
    }
    if (nidNumber.length < 8) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Please enter a valid NID / Smart Card number."
            : "সঠিক জাতীয় পরিচয়পত্র (NID / Smart Card) নম্বর দিন।",
        },
        { status: 400 }
      );
    }
    if (!nidNameMatch) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Please confirm that your Full Name & Permanent Address match your NID card."
            : "অনুগ্রহ করে নিশ্চিত করুন যে আপনার নাম ও স্থায়ী ঠিকানা NID কার্ডের সাথে হুবহু মিল আছে।",
        },
        { status: 400 }
      );
    }
    if (
      !nidFrontImage.startsWith("data:image/") ||
      !nidBackImage.startsWith("data:image/")
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Please upload both NID Front and NID Back photos (via Camera or Gallery)."
            : "NID কার্ডের সামনের এবং পেছনের উভয় পাশের ছবি (ক্যামেরা বা গ্যালারি থেকে) আপলোড করা বাধ্যতামূলক।",
        },
        { status: 400 }
      );
    }
    if (
      nidFrontImage.length > MAX_IMAGE_DATA_LENGTH ||
      nidBackImage.length > MAX_IMAGE_DATA_LENGTH
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "NID image size is too large. Please retake or upload a smaller photo."
            : "NID ছবির সাইজ বেশি বড়। অনুগ্রহ করে আবার ছবি তুলুন বা পরিষ্কার ছোট ছবি দিন।",
        },
        { status: 400 }
      );
    }
    if (!termsAccepted) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "You must accept the Terms, Policy & Conditions before signup."
            : "সাইনআপের আগে Terms, Policy & Conditions accept করতে হবে।",
        },
        { status: 400 }
      );
    }

    const db = await getDb();
    const verifiedOtp = await db
      .select()
      .from(workerOtps)
      .where(
        and(
          eq(workerOtps.phone, phone),
          eq(workerOtps.verified, true),
          gt(workerOtps.expiresAt, new Date())
        )
      )
      .orderBy(desc(workerOtps.createdAt))
      .limit(1);

    if (!verifiedOtp[0]) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "Phone OTP verification is required before signup."
            : "সাইনআপের আগে ফোন OTP যাচাই বাধ্যতামূলক।",
        },
        { status: 403 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await db.insert(workers).values({
      fullName,
      phone,
      passwordHash: hashPassword(password),
      category: primaryCategory,
      skillsList: JSON.stringify(skillsArray),
      isFresher,
      experienceYears: isFresher
        ? 0
        : Number.isFinite(experienceYears)
          ? Math.max(0, Math.min(45, Math.round(experienceYears)))
          : 0,
      baseLocation: baseLocation || currentLocation,
      currentLocation,
      preferredAreas: preferredAreas || currentLocation,
      permanentAddress,
      presentAddress,
      nidNumber,
      nidNameMatch: true,
      nidFrontImage,
      nidBackImage,
      bio,
      isApproved: false,
      isActive: false,
      status: "pending",
    });

    await db.delete(workerOtps).where(eq(workerOtps.phone, phone));

    await db
      .insert(legalLogs)
      .values({
        userType: "worker",
        userPhone: phone,
        ipAddress: ip,
        userAgent,
      })
      .catch((e) => console.error("Legal log error:", e));

    return NextResponse.json({
      ok: true,
      message: isEn
        ? "Profile & NID verification submitted! Once approved by Admin, you can log in and start accepting work."
        : "আপনার প্রোফাইল ও NID তথ্য সফলভাবে জমা হয়েছে! অ্যাডমিন যাচাই অনুমোদন করলেই আপনি লগইন করে কাজ নিতে পারবেন।",
    });
  } catch (err) {
    const msg = String((err as Error)?.message ?? "");
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return NextResponse.json(
        {
          ok: false,
          error: isEn
            ? "A worker profile already exists with this phone number."
            : "এই ফোন নম্বরে আগে থেকেই কর্মী প্রোফাইল রয়েছে।",
        },
        { status: 409 }
      );
    }
    console.error("[worker/signup] failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: isEn
          ? "Server error. Please try again."
          : "সার্ভার সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
