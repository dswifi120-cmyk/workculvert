"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Camera,
  Check,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  Home,
  ImagePlus,
  Info,
  LoaderCircle,
  Lock,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  Wrench,
  X,
} from "lucide-react";
import {
  CATEGORY_OPTIONS,
  CATEGORY_TABS,
  type CategoryTabSlug,
} from "@/lib/categories";
import { BrandLogo } from "@/components/brand-logo";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-line bg-paper/60 py-3 pl-10 pr-4 text-[14.5px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card";

const BD_DISTRICTS_POPULAR = [
  { bn: "ঢাকা (Dhaka)", en: "Dhaka" },
  { bn: "চট্টগ্রাম (Chattogram)", en: "Chattogram" },
  { bn: "রাজশাহী (Rajshahi)", en: "Rajshahi" },
  { bn: "খুলনা (Khulna)", en: "Khulna" },
  { bn: "সিলেট (Sylhet)", en: "Sylhet" },
  { bn: "রংপুর (Rangpur)", en: "Rangpur" },
  { bn: "বরিশাল (Barishal)", en: "Barishal" },
  { bn: "ময়মনসিংহ (Mymensingh)", en: "Mymensingh" },
  { bn: "গাজীপুর (Gazipur)", en: "Gazipur" },
  { bn: "নারায়ণগঞ্জ (Narayanganj)", en: "Narayanganj" },
  { bn: "কুমিল্লা (Cumilla)", en: "Cumilla" },
  { bn: "বগুড়া (Bogura)", en: "Bogura" },
  { bn: "যশোর (Jashore)", en: "Jashore" },
  { bn: "কক্সবাজার (Cox's Bazar)", en: "Cox's Bazar" },
  { bn: "দিনাজপুর (Dinajpur)", en: "Dinajpur" },
  { bn: "পাবনা (Pabna)", en: "Pabna" },
  { bn: "টাঙ্গাইল (Tangail)", en: "Tangail" },
  { bn: "ফরিদপুর (Faridpur)", en: "Faridpur" },
  { bn: "নোয়াখালী (Noakhali)", en: "Noakhali" },
  { bn: "কুষ্টিয়া (Kushtia)", en: "Kushtia" },
];

async function compressNidImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("File read failed"));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Invalid image"));
      img.onload = () => {
        const maxDim = 960;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas unavailable"));
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.72);
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function NidPhotoUploader({
  label,
  subLabel,
  value,
  onChange,
  isEn,
}: {
  label: string;
  subLabel: string;
  value: string;
  onChange: (dataUrl: string) => void;
  isEn: boolean;
}) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const compressed = await compressNidImage(file);
      onChange(compressed);
    } catch {
      // ignore invalid file
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[13px] font-bold text-ink">{label}</p>
          <p className="text-[11px] text-mist">{subLabel}</p>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 rounded-lg border border-brick/20 bg-brick-soft px-2 py-1 text-[11px] font-semibold text-brick hover:bg-brick hover:text-white"
          >
            <Trash2 size={12} /> {isEn ? "Remove" : "মুছুন"}
          </button>
        )}
      </div>

      {/* Hidden inputs for Camera Capture and Gallery Picker */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className="relative mt-2.5 aspect-[16/10] w-full overflow-hidden rounded-xl border border-pine/30 bg-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-pine/90 px-2.5 py-0.5 text-[10.5px] font-bold text-paper backdrop-blur-sm">
            <Check size={11} /> {isEn ? "Attached" : "যুক্ত হয়েছে"}
          </span>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-pine/35 bg-tint/45 px-2.5 py-3.5 text-center text-[12px] font-bold text-pine transition-colors hover:bg-tint disabled:opacity-60"
          >
            {busy ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Camera size={18} />
            )}
            <span>{isEn ? "Take Photo (Camera)" : "ক্যামেরা দিয়ে তুলুন"}</span>
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => galleryInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-paper/80 px-2.5 py-3.5 text-center text-[12px] font-bold text-ink transition-colors hover:border-pine/40 hover:bg-tint/25 disabled:opacity-60"
          >
            {busy ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <ImagePlus size={18} className="text-river" />
            )}
            <span>{isEn ? "From Gallery" : "গ্যালারি থেকে দিন"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function WorkerAuthForm() {
  const router = useRouter();
  const { locale, t, setLocale } = useLanguage();
  const isEn = locale === "en";
  const wa = t.workerAuth;
  const pt = t.postForm;

  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Auth & Contact
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP state
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const [otpNote, setOtpNote] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [demoCode, setDemoCode] = useState("");

  // Multi-skills & Fresher
  const [isFresher, setIsFresher] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "ইলেকট্রিশিয়ান",
  ]);
  const [skillFilterTab, setSkillFilterTab] = useState<"all" | CategoryTabSlug>(
    "all"
  );
  const [experienceYears, setExperienceYears] = useState("");

  // Locations & Address Details (NID Permanent vs Present vs Preferred Work Areas)
  const [nidDistrict, setNidDistrict] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [presentAddress, setPresentAddress] = useState("");
  const [preferredAreas, setPreferredAreas] = useState("");
  const [bio, setBio] = useState("");

  // NID Verification State
  const [nidNumber, setNidNumber] = useState("");
  const [nidFrontImage, setNidFrontImage] = useState("");
  const [nidBackImage, setNidBackImage] = useState("");
  const [nidNameMatch, setNidNameMatch] = useState(false);

  const [termsModalOpen, setTermsModalOpen] = useState(false);

  function toggleSkill(val: string) {
    setSelectedSkills((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  }

  function handleFresherToggle(checked: boolean) {
    setIsFresher(checked);
    if (checked) {
      setExperienceYears("0");
      if (!selectedSkills.includes("নতুন কর্মী / ফ্রেশার (Fresher)")) {
        setSelectedSkills((prev) => [
          "নতুন কর্মী / ফ্রেশার (Fresher)",
          ...prev,
        ]);
      }
    } else {
      setSelectedSkills((prev) =>
        prev.filter((s) => s !== "নতুন কর্মী / ফ্রেশার (Fresher)")
      );
    }
  }

  const displayedSkillOptions =
    skillFilterTab === "all"
      ? CATEGORY_OPTIONS
      : CATEGORY_OPTIONS.filter((c) => c.tab === skillFilterTab);

  async function requestOtp() {
    if (otpLoading) return;
    if (phone.trim().length < 11) {
      setOtpNote(pt.phoneMinErr);
      return;
    }
    setOtpLoading(true);
    setOtpNote("");
    setPhoneVerified(false);
    try {
      const res = await fetch("/api/worker/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
        demoCode?: string;
      };
      if (!res.ok || !json.ok) {
        setOtpNote(json.error ?? pt.otpSendErr);
        return;
      }
      setOtpNote(json.message ?? pt.otpSentMsg);
      setDemoCode(json.demoCode ?? "");
      if (json.demoCode) {
        setOtpCode(json.demoCode);
      }
    } catch {
      setOtpNote(pt.networkErr);
    } finally {
      setOtpLoading(false);
    }
  }

  async function verifyOtp() {
    if (otpVerifyLoading) return;
    setOtpVerifyLoading(true);
    setOtpNote("");
    try {
      const res = await fetch("/api/worker/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otpCode }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setPhoneVerified(false);
        setOtpNote(json.error ?? pt.otpInvalidErr);
        return;
      }
      setPhoneVerified(true);
      setOtpNote(pt.verifiedText);
    } catch {
      setOtpNote(pt.networkErr);
    } finally {
      setOtpVerifyLoading(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "login") {
      try {
        const res = await fetch("/api/worker/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        });
        const json = (await res.json()) as { ok: boolean; error?: string };
        if (!res.ok || !json.ok) {
          setError(json.error ?? pt.genericErr);
          return;
        }
        router.push("/dashboard");
        router.refresh();
      } catch {
        setError(pt.networkErr);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Signup validations
    if (selectedSkills.length === 0 && !isFresher) {
      setLoading(false);
      setError(
        isEn
          ? "Please select at least one work skill or mark 'I am a Fresher'."
          : "কমপক্ষে একটি কাজের দক্ষতা নির্বাচন করুন অথবা 'আমি নতুন / ফ্রেশার' টিক দিন।"
      );
      return;
    }
    if (!nidFrontImage || !nidBackImage) {
      setLoading(false);
      setError(
        isEn
          ? "Please upload both Front and Back photos of your NID card."
          : "অনুগ্রহ করে আপনার NID কার্ডের সামনের ও পেছনের উভয় পাশের ছবি আপলোড করুন।"
      );
      return;
    }
    if (!nidNameMatch) {
      setLoading(false);
      setError(
        isEn
          ? "Please confirm that your Name & Permanent Address match your NID card."
          : "অনুগ্রহ করে নিশ্চিত করুন যে আপনার নাম ও স্থায়ী ঠিকানা NID কার্ডের সাথে মিল আছে।"
      );
      return;
    }
    if (!phoneVerified) {
      setLoading(false);
      setError(wa.otpRequiredErr);
      return;
    }
    if (password !== confirmPassword) {
      setLoading(false);
      setError(wa.passwordMismatchErr);
      return;
    }

    try {
      const payload = {
        fullName,
        phone,
        password,
        confirmPassword,
        skills: selectedSkills,
        category: selectedSkills[0] ?? "নতুন কর্মী / ফ্রেশার (Fresher)",
        isFresher,
        experienceYears: isFresher ? "0" : experienceYears || "0",
        baseLocation: nidDistrict || currentCity,
        currentLocation: currentCity,
        preferredAreas: preferredAreas || currentCity,
        permanentAddress,
        presentAddress: sameAsPermanent ? permanentAddress : presentAddress,
        nidNumber,
        nidNameMatch,
        nidFrontImage,
        nidBackImage,
        bio,
        terms: data.get("terms") === "on",
      };

      const res = await fetch("/api/worker/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !json.ok) {
        setError(json.error ?? pt.genericErr);
        return;
      }

      form.reset();
      setFullName("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setOtpCode("");
      setPhoneVerified(false);
      setOtpNote("");
      setDemoCode("");
      setNidNumber("");
      setNidFrontImage("");
      setNidBackImage("");
      setNidNameMatch(false);
      setMode("login");
      setMessage(json.message ?? "");
    } catch {
      setError(pt.networkErr);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper lg:grid lg:grid-cols-[0.95fr_1.15fr]">
      {/* Left Inspiring Editorial Showcase Panel */}
      <div className="relative overflow-hidden bg-pine-deep text-paper lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="dots-bg-light absolute inset-0 opacity-35" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-mint/15 blur-[120px]" />
        <div className="absolute -right-16 top-16 h-72 w-72 rounded-full bg-ochre/15 blur-[100px]" />

        <div className="relative flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-11">
          <div className="flex items-center justify-between gap-3">
            <Link href="/">
              <BrandLogo
                theme="dark"
                size="md"
                subtitle={isEn ? "All Bangladesh Network" : "সারা বাংলাদেশ নেটওয়ার্ক"}
              />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-paper/85 hover:bg-white/15 lg:hidden"
            >
              <ArrowLeft size={14} /> {wa.backHome}
            </Link>
          </div>

          <div className="my-7 lg:my-0">
            <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
              <Image
                src="/images/worker-onboard.jpg"
                alt={
                  isEn
                    ? "Verified Bangladeshi workers and freshers on WorkCulvert"
                    : "WorkCulvert-এর যাচাইকৃত কর্মী ও ফ্রেশার নেটওয়ার্ক"
                }
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 95vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/90 via-pine-deep/20 to-transparent" />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/15 bg-ink/65 px-3.5 py-2.5 backdrop-blur-md">
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-mint">
                  <BadgeCheck size={15} />
                  {isEn
                    ? "NID & OTP Verified Workforce"
                    : "NID ও OTP যাচাইকৃত বিশ্বস্ত প্ল্যাটফর্ম"}
                </span>
                <span className="rounded-full bg-ochre px-2.5 py-0.5 text-[10.5px] font-bold text-ink">
                  {isEn ? "Experienced + Freshers Welcome" : "দক্ষ ও ফ্রেশার উভয়েই স্বাগতম"}
                </span>
              </div>
            </div>

            <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11.5px] font-semibold text-mint">
              <Sparkles size={12} /> {wa.sideBadge}
            </p>
            <h2 className="mt-3.5 text-2xl font-bold leading-[1.3] sm:text-3xl">
              {wa.sideTitlePrefix}{" "}
              <span className="font-serif text-mint">
                {wa.sideTitleHighlight}
              </span>{" "}
              {wa.sideTitleSuffix}
            </h2>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {[
                {
                  bn: "✓ একাধিক কাজের দক্ষতা নির্বাচনের সুবিধা",
                  en: "✓ Select multiple work skills at once",
                },
                {
                  bn: "✓ একদম নতুন / ফ্রেশারদের কাজের সুযোগ",
                  en: "✓ Zero-experience Freshers can join too",
                },
                {
                  bn: "✓ NID কার্ডের যেকোনো জেলা থেকে সারা দেশে কাজ",
                  en: "✓ Work in any city regardless of NID home district",
                },
                {
                  bn: "✓ সরাসরি নিয়োগদাতার পেমেন্ট, দালালমুক্ত",
                  en: "✓ Direct payment from employers, zero middlemen",
                },
              ].map((item) => (
                <div
                  key={item.en}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-[12.5px] text-paper/85"
                >
                  {isEn ? item.en : item.bn}
                </div>
              ))}
            </div>
          </div>

          <p className="hidden text-[12px] text-paper/45 lg:block">
            {wa.sideFooter}
          </p>
        </div>
      </div>

      {/* Right Interactive Form Column */}
      <div className="relative flex items-start justify-center px-4 py-8 sm:px-8 sm:py-12">
        <div className="dots-bg absolute inset-0" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative w-full max-w-2xl"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="hidden items-center gap-1.5 text-sm font-medium text-mist transition-colors hover:text-pine lg:inline-flex"
            >
              <ArrowLeft size={15} /> {wa.backHome}
            </Link>
            <div className="ml-auto inline-flex items-center rounded-full border border-line bg-card p-0.5 text-[12px] font-bold">
              <button
                type="button"
                onClick={() => setLocale("bn")}
                className={cn(
                  "rounded-full px-2.5 py-1 transition-colors",
                  locale === "bn" ? "bg-pine text-paper" : "text-mist"
                )}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={cn(
                  "rounded-full px-2.5 py-1 font-latin transition-colors",
                  locale === "en" ? "bg-pine text-paper" : "text-mist"
                )}
              >
                EN
              </button>
            </div>
          </div>

          <div className="shadow-lift rounded-3xl border border-line bg-card p-5 sm:p-8">
            {/* Login / Signup Switch */}
            <div className="grid grid-cols-2 gap-1 rounded-full border border-line bg-paper p-1">
              {(["signup", "login"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setError("");
                    setMessage("");
                  }}
                  className={cn(
                    "rounded-full py-2.5 text-[14px] font-semibold transition-colors",
                    mode === m
                      ? "bg-pine text-paper shadow"
                      : "text-mist hover:text-ink"
                  )}
                >
                  {m === "login" ? wa.tabLogin : wa.tabSignup}
                </button>
              ))}
            </div>

            <h1 className="mt-5 text-[23px] font-bold text-ink sm:text-[26px]">
              {mode === "login" ? wa.loginHeading : wa.signupHeading}
            </h1>
            <p className="mt-1 text-[13.5px] text-mist">
              {mode === "login" ? wa.loginSub : wa.signupSub}
            </p>

            {message && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-pine/25 bg-tint px-4 py-3 text-[13.5px] font-semibold text-pine">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {mode === "signup" && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-pine/15 bg-tint/60 px-3.5 py-2.5 text-[12px] leading-relaxed text-pine">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>{wa.demoNotice}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-6">
              {mode === "signup" ? (
                <>
                  {/* STEP 1: SKILLS & EXPERIENCE (MULTI-SELECT + FRESHER) */}
                  <div className="space-y-4 rounded-2xl border border-line bg-paper/45 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
                        <span className="grid size-6 place-items-center rounded-full bg-pine text-[11px] font-bold text-paper">
                          1
                        </span>
                        {isEn
                          ? "Skills & Experience (Select Multiple)"
                          : "কাজের দক্ষতা ও অভিজ্ঞতা (একাধিক সিলেক্ট করা যাবে)"}
                      </h3>
                      <span className="rounded-full bg-tint px-2.5 py-0.5 text-[11.5px] font-bold text-pine">
                        {selectedSkills.length}{" "}
                        {isEn ? "selected" : "টি নির্বাচিত"}
                      </span>
                    </div>

                    {/* Fresher / Zero Experience Toggle Card */}
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-all",
                        isFresher
                          ? "border-ochre bg-ochre-soft/65 shadow-sm"
                          : "border-line bg-card hover:border-pine/35"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isFresher}
                        onChange={(e) => handleFresherToggle(e.target.checked)}
                        className="mt-1 size-4 rounded border-line text-pine"
                      />
                      <div>
                        <p className="text-[13.5px] font-bold text-ink">
                          {isEn
                            ? "🌱 I am a Fresher / New Worker (No prior work experience)"
                            : "🌱 আমি একদম নতুন / ফ্রেশার (আগের কোনো কাজের অভিজ্ঞতা নেই)"}
                        </p>
                        <p className="mt-0.5 text-[12px] text-mist">
                          {isEn
                            ? "No problem! Freshers can join for general assistance, delivery, event helping, pet care, cleaning, or trainee tasks."
                            : "কোনো অভিজ্ঞতা না থাকলেও সমস্যা নেই! সাধারণ সহায়ক, ডেলিভারি, ইভেন্ট হেল্পার, ক্লিনিং বা শিক্ষানবিশ হিসেবে কাজ করতে পারবেন।"}
                        </p>
                      </div>
                    </label>

                    {/* Category Filter Tabs for easier multi-selection */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSkillFilterTab("all")}
                        className={cn(
                          "rounded-full px-3 py-1 text-[11.5px] font-bold transition-colors",
                          skillFilterTab === "all"
                            ? "bg-ink text-paper"
                            : "border border-line bg-card text-mist hover:text-ink"
                        )}
                      >
                        {isEn ? "All Skills" : "সব কাজ"}
                      </button>
                      {CATEGORY_TABS.map((ct) => (
                        <button
                          key={ct.slug}
                          type="button"
                          onClick={() => setSkillFilterTab(ct.slug)}
                          className={cn(
                            "rounded-full px-3 py-1 text-[11.5px] font-bold transition-colors",
                            skillFilterTab === ct.slug
                              ? "bg-ink text-paper"
                              : "border border-line bg-card text-mist hover:text-ink"
                          )}
                        >
                          {isEn ? ct.en : ct.bn}
                        </button>
                      ))}
                    </div>

                    {/* Multi-select Skill Chips */}
                    <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                      {displayedSkillOptions.map((opt) => {
                        const checked = selectedSkills.includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => toggleSkill(opt.value)}
                            className={cn(
                              "flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[13px] font-semibold transition-all",
                              checked
                                ? "border-pine bg-pine text-paper shadow-sm"
                                : "border-line bg-card text-ink hover:border-pine/40"
                            )}
                          >
                            <span className="truncate">
                              {isEn ? opt.en : opt.bn}
                            </span>
                            <span
                              className={cn(
                                "grid size-4.5 shrink-0 place-items-center rounded-full border",
                                checked
                                  ? "border-paper bg-paper text-pine"
                                  : "border-line"
                              )}
                            >
                              {checked && <Check size={11} strokeWidth={3} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {!isFresher && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                            {isEn
                              ? "Years of Experience"
                              : "কাজের অভিজ্ঞতা (বছর)"}
                          </label>
                          <div className="relative">
                            <Wrench
                              size={15}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
                            />
                            <input
                              value={experienceYears}
                              onChange={(e) =>
                                setExperienceYears(e.target.value)
                              }
                              inputMode="numeric"
                              placeholder={
                                isEn ? "e.g. 2 (or 0)" : "যেমন: ২ বছর (বা ০)"
                              }
                              className={inputCls}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                            {isEn
                              ? "Tools / Vehicle Info (Optional)"
                              : "যন্ত্রপাতি বা বাহন (ঐচ্ছিক)"}
                          </label>
                          <input
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder={
                              isEn
                                ? "e.g. Own bike / electrical toolkit"
                                : "যেমন: নিজস্ব বাইক / টুলবক্স আছে"
                            }
                            className="w-full rounded-xl border border-line bg-card px-3.5 py-3 text-[14px] text-ink outline-none focus:border-pine"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* STEP 2: IDENTITY & NID VERIFICATION (FRONT & BACK CAMERA/GALLERY) */}
                  <div className="space-y-4 rounded-2xl border border-pine/20 bg-tint/25 p-4 sm:p-5">
                    <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
                      <span className="grid size-6 place-items-center rounded-full bg-pine text-[11px] font-bold text-paper">
                        2
                      </span>
                      {isEn
                        ? "NID Verification & Exact Name Match"
                        : "NID যাচাইকরণ ও পরিচয়পত্র অনুযায়ী নাম"}
                    </h3>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                          {isEn
                            ? "Full Name (Must match NID Card)"
                            : "পূর্ণ নাম (NID কার্ডের নামের সাথে মিল রেখে) *"}
                        </label>
                        <div className="relative">
                          <User
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
                          />
                          <input
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={
                              isEn
                                ? "Exact name as on NID"
                                : "NID কার্ডে যেভাবে নাম লেখা আছে"
                            }
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                          {isEn
                            ? "NID / Smart Card Number *"
                            : "NID / স্মার্ট কার্ড নম্বর *"}
                        </label>
                        <div className="relative">
                          <CreditCard
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
                          />
                          <input
                            required
                            value={nidNumber}
                            onChange={(e) => setNidNumber(e.target.value)}
                            inputMode="numeric"
                            placeholder={
                              isEn ? "10, 13 or 17 digit NID" : "১০, ১৩ বা ১৭ সংখ্যার NID নম্বর"
                            }
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Camera & Gallery Uploaders for NID Front + Back */}
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <NidPhotoUploader
                        label={
                          isEn
                            ? "NID Front Side Photo *"
                            : "NID সামনের অংশের ছবি *"
                        }
                        subLabel={
                          isEn
                            ? "Clear photo showing Name, Photo & NID No."
                            : "নাম, ছবি ও NID নম্বর যেন স্পষ্ট বোঝা যায়"
                        }
                        value={nidFrontImage}
                        onChange={setNidFrontImage}
                        isEn={isEn}
                      />
                      <NidPhotoUploader
                        label={
                          isEn
                            ? "NID Back Side Photo *"
                            : "NID পেছনের অংশের ছবি *"
                        }
                        subLabel={
                          isEn
                            ? "Clear photo showing Permanent Address & Barcode"
                            : "পেছনের ঠিকানা ও বারকোড যেন স্পষ্ট থাকে"
                        }
                        value={nidBackImage}
                        onChange={setNidBackImage}
                        isEn={isEn}
                      />
                    </div>

                    <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-pine/25 bg-card px-3.5 py-2.5 text-[12.5px] font-semibold text-ink">
                      <input
                        type="checkbox"
                        checked={nidNameMatch}
                        onChange={(e) => setNidNameMatch(e.target.checked)}
                        className="mt-0.5 size-4 rounded border-line text-pine"
                      />
                      <span className="flex items-center gap-1.5">
                        <FileCheck2 size={15} className="shrink-0 text-pine" />
                        {isEn
                          ? "I confirm my Full Name & Permanent Address match my uploaded NID card."
                          : "আমি নিশ্চিত করছি যে উপরের নাম ও স্থায়ী ঠিকানা আমার NID কার্ডের তথ্যের সাথে হুবহু মিল আছে।"}
                      </span>
                    </label>
                  </div>

                  {/* STEP 3: ADDRESS & FLEXIBLE WORK LOCATION ACROSS BANGLADESH */}
                  <div className="space-y-4 rounded-2xl border border-line bg-paper/45 p-4 sm:p-5">
                    <div>
                      <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
                        <span className="grid size-6 place-items-center rounded-full bg-pine text-[11px] font-bold text-paper">
                          3
                        </span>
                        {isEn
                          ? "NID Address & Where You Want to Work"
                          : "ঠিকানা ও যে এলাকায় কাজ করতে চান"}
                      </h3>
                      <p className="mt-1 text-[12px] text-mist">
                        {isEn
                          ? "Your NID may be from one district while you currently live or work in Dhaka, Chattogram, Bogura, or anywhere else — you can update your work location anytime from your dashboard."
                          : "আপনার NID এক জেলার হলেও আপনি বর্তমানে ঢাকা, চট্টগ্রাম, রাজশাহী, বগুড়া বা দেশের যেকোনো এলাকায় থেকে কাজ করতে পারেন এবং পরে ড্যাশবোর্ড থেকে লোকেশন পরিবর্তনও করতে পারবেন।"}
                      </p>
                    </div>

                    <datalist id="bd-city-suggestions">
                      {BD_DISTRICTS_POPULAR.map((d) => (
                        <option
                          key={d.en}
                          value={isEn ? d.en : d.bn}
                        />
                      ))}
                    </datalist>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                          {isEn
                            ? "NID Home District *"
                            : "NID অনুযায়ী স্থায়ী জেলা *"}
                        </label>
                        <div className="relative">
                          <Home
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
                          />
                          <input
                            required
                            list="bd-city-suggestions"
                            value={nidDistrict}
                            onChange={(e) => setNidDistrict(e.target.value)}
                            placeholder={
                              isEn
                                ? "Select or type district"
                                : "জেলা নির্বাচন বা টাইপ করুন"
                            }
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                          {isEn
                            ? "Permanent Address (As on NID Back) *"
                            : "স্থায়ী ঠিকানা (NID কার্ডের পেছনে যেমন আছে) *"}
                        </label>
                        <input
                          required
                          value={permanentAddress}
                          onChange={(e) => setPermanentAddress(e.target.value)}
                          placeholder={
                            isEn
                              ? "Village/Road, Post Office, Upazila"
                              : "গ্রাম/মহল্লা, ডাকঘর, উপজেলা"
                          }
                          className="w-full rounded-xl border border-line bg-card px-3.5 py-3 text-[14px] text-ink outline-none focus:border-pine"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                          {isEn
                            ? "Current Living City / Thana *"
                            : "বর্তমানে কোন শহর/থানায় আছেন? *"}
                        </label>
                        <div className="relative">
                          <MapPin
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-river"
                          />
                          <input
                            required
                            list="bd-city-suggestions"
                            value={currentCity}
                            onChange={(e) => setCurrentCity(e.target.value)}
                            placeholder={
                              isEn
                                ? "e.g. Mirpur, Dhaka / Sadar"
                                : "যেমন: মিরপুর, ঢাকা / সদর"
                            }
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                          {isEn
                            ? "Preferred Areas to Work *"
                            : "কোন কোন এলাকায় কাজ করতে চান? *"}
                        </label>
                        <div className="relative">
                          <Navigation
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pine"
                          />
                          <input
                            required
                            value={preferredAreas}
                            onChange={(e) => setPreferredAreas(e.target.value)}
                            placeholder={
                              isEn
                                ? "e.g. Dhanmondi, Uttara, Mirpur"
                                : "যেমন: ধানমন্ডি, উত্তরা বা আপনার আশেপাশের এলাকা"
                            }
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-[12.5px] font-semibold text-ink">
                          {isEn
                            ? "Present Residence Details"
                            : "বর্তমান বসবাসের বিস্তারিত ঠিকানা"}
                        </label>
                        <label className="flex cursor-pointer items-center gap-1.5 text-[11.5px] font-semibold text-pine">
                          <input
                            type="checkbox"
                            checked={sameAsPermanent}
                            onChange={(e) =>
                              setSameAsPermanent(e.target.checked)
                            }
                            className="size-3.5 rounded border-line text-pine"
                          />
                          {isEn
                            ? "Same as NID address"
                            : "স্থায়ী ঠিকানার অনুরূপ"}
                        </label>
                      </div>
                      {!sameAsPermanent && (
                        <input
                          value={presentAddress}
                          onChange={(e) => setPresentAddress(e.target.value)}
                          placeholder={
                            isEn
                              ? "House/Mess/Road, Area, City"
                              : "বাসা/মেস নম্বর, রোড, এলাকা"
                          }
                          className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-pine"
                        />
                      )}
                    </div>
                  </div>
                </>
              ) : null}

              {/* STEP 4 (OR LOGIN): PHONE OTP & PASSWORD */}
              <div className="space-y-4">
                {mode === "signup" && (
                  <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
                    <span className="grid size-6 place-items-center rounded-full bg-pine text-[11px] font-bold text-paper">
                      4
                    </span>
                    {isEn
                      ? "Phone OTP Verification & Account Password"
                      : "ফোন OTP যাচাই ও পাসওয়ার্ড সেটআপ"}
                  </h3>
                )}

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
                  />
                  <input
                    name="phone"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneVerified(false);
                    }}
                    placeholder={wa.phonePlaceholder}
                    className={inputCls}
                  />
                </div>

                {mode === "signup" && (
                  <>
                    <div className="grid gap-2.5 sm:grid-cols-[1fr_auto]">
                      <div className="relative">
                        <ShieldCheck
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
                        />
                        <input
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder={wa.otpPlaceholder}
                          className={inputCls}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={requestOtp}
                          disabled={otpLoading}
                          className="flex-1 rounded-xl border border-line bg-paper px-4 py-3 text-[13px] font-semibold text-pine transition-colors hover:bg-tint disabled:opacity-60 sm:flex-none"
                        >
                          {otpLoading ? (
                            <LoaderCircle size={15} className="animate-spin" />
                          ) : (
                            wa.sendOtpBtn
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={verifyOtp}
                          disabled={otpVerifyLoading}
                          className="flex-1 rounded-xl bg-pine px-4 py-3 text-[13px] font-semibold text-paper transition-colors hover:bg-pine-dark disabled:opacity-60 sm:flex-none"
                        >
                          {otpVerifyLoading ? (
                            <LoaderCircle size={15} className="animate-spin" />
                          ) : (
                            wa.verifyOtpBtn
                          )}
                        </button>
                      </div>
                    </div>

                    {(otpNote || demoCode || phoneVerified) && (
                      <div
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-[13px]",
                          phoneVerified
                            ? "border-pine/20 bg-tint text-pine"
                            : "border-ochre/20 bg-ochre-soft text-ink"
                        )}
                      >
                        <p className="flex items-center gap-2 font-medium">
                          {phoneVerified ? (
                            <CheckCircle2 size={15} />
                          ) : (
                            <Phone size={15} />
                          )}
                          {otpNote || (phoneVerified ? pt.verifiedText : "OTP")}
                        </p>
                        {demoCode && !phoneVerified ? (
                          <p className="mt-1 font-semibold">
                            {pt.demoOtpPrefix} {demoCode}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </>
                )}

                <div
                  className={cn(
                    "grid gap-3.5",
                    mode === "signup" && "sm:grid-cols-2"
                  )}
                >
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
                    />
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder={
                        mode === "login"
                          ? wa.passwordLoginPlaceholder
                          : wa.passwordNewPlaceholder
                      }
                      className={inputCls}
                    />
                  </div>

                  {mode === "signup" && (
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder={wa.passwordConfirmPlaceholder}
                        className={inputCls}
                      />
                    </div>
                  )}
                </div>

                {mode === "signup" && (
                  <label className="flex items-start gap-3 rounded-2xl border border-line bg-paper/50 px-4 py-3 text-[13px] font-medium text-ink">
                    <input
                      type="checkbox"
                      name="terms"
                      required
                      className="mt-0.5 size-4 rounded border-line text-pine"
                    />
                    <span>
                      {pt.termsPrefix}{" "}
                      <button
                        type="button"
                        onClick={() => setTermsModalOpen(true)}
                        className="font-semibold text-pine underline decoration-pine/30 underline-offset-2"
                      >
                        {pt.termsLink}
                      </button>{" "}
                      {pt.termsSuffix}
                    </span>
                  </label>
                )}
              </div>

              {error && (
                <p className="flex items-start gap-2 rounded-xl bg-brick-soft px-4 py-3 text-[13px] font-medium text-brick">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />{" "}
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-pine py-4 text-[15.5px] font-bold text-paper shadow-[0_12px_30px_-10px_rgba(12,91,78,0.5)] transition-all hover:-translate-y-0.5 hover:bg-pine-dark disabled:opacity-60"
              >
                {loading ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : mode === "login" ? (
                  wa.loginBtn
                ) : (
                  wa.signupBtn
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Terms Modal */}
      <AnimatePresence>
        {termsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTermsModalOpen(false)}
            className="fixed inset-0 z-[90] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="shadow-lift w-full max-w-lg rounded-3xl border border-line bg-card p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-lg font-bold text-ink">
                  {pt.termsModalTitle}
                </h4>
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(false)}
                  className="grid size-8 place-items-center rounded-full border border-line text-mist hover:text-ink"
                >
                  <X size={15} />
                </button>
              </div>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-mist">
                {pt.termsPoints.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setTermsModalOpen(false)}
                className="mt-6 w-full rounded-full bg-pine py-2.5 text-sm font-semibold text-paper hover:bg-pine-dark"
              >
                {pt.closeBtn}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
