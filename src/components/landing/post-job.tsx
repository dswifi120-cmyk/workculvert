"use client";

import { useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Check,
  HeartHandshake,
  Info,
  LoaderCircle,
  MapPin,
  Navigation,
  Package,
  PawPrint,
  Send,
  ShieldCheck,
  Smartphone,
  Wrench,
  X,
} from "lucide-react";
import {
  CATEGORY_OPTIONS,
  JOB_TYPE_OPTIONS,
  getCategoriesForTab,
  type CategoryTabSlug,
} from "@/lib/categories";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

type State = "idle" | "loading" | "done" | "error";

const inputCls =
  "w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card";

const TAB_ACCENT: Record<
  CategoryTabSlug,
  {
    headerBg: string;
    badgeCls: string;
    titleBn: string;
    titleEn: string;
    hintBn: string;
    hintEn: string;
    titlePlaceholderBn: string;
    titlePlaceholderEn: string;
    durationPresetsBn: string[];
    durationPresetsEn: string[];
    budgetPresets: string[];
  }
> = {
  "any-work": {
    headerBg: "from-pine/10 via-tint/50 to-transparent",
    badgeCls: "bg-tint text-pine border-pine/20",
    titleBn: "যেকোনো কাজ পোস্ট করুন",
    titleEn: "Post Any Custom Work",
    hintBn:
      "বাজার করা, ইভেন্ট হেল্পার, লোডিং বা যেকোনো দৈনন্দিন কাজের বিবরণ ও কতজন লোক লাগবে উল্লেখ করুন।",
    hintEn:
      "Describe your custom task, helper count, and preferred timing for fast local matching.",
    titlePlaceholderBn: "যেমন: বিয়ের অনুষ্ঠানে চেয়ার ও প্যান্ডেল গোছানোর ২ জন হেল্পার",
    titlePlaceholderEn: "e.g. 2 helpers needed for event setup & unloading",
    durationPresetsBn: ["২ ঘণ্টা", "অর্ধবেলা (৪ ঘণ্টা)", "১ দিন", "৩ দিন"],
    durationPresetsEn: ["2 hours", "Half day (4 hrs)", "1 day", "3 days"],
    budgetPresets: ["500", "1000", "2000", "5000"],
  },
  transportation: {
    headerBg: "from-river/12 via-rivertint/70 to-transparent",
    badgeCls: "bg-rivertint text-river border-river/25",
    titleBn: "রাইড, পার্সেল বা শিফটিং বুকিং",
    titleEn: "Book Ride, Parcel or Shifting",
    hintBn:
      "পিকআপ ও ড্রপ লোকেশন লিখুন এবং রাইড নাকি পার্সেল/বাসা শিফটিং তা নির্বাচন করুন।",
    hintEn:
      "Enter exact Pickup & Drop-off points and choose Passenger Ride, Parcel Delivery, or Cargo Shifting.",
    titlePlaceholderBn: "যেমন: আপনার এলাকা থেকে জরুরি পার্সেল ডেলিভারি / বাসা শিফটিং ট্রাক",
    titlePlaceholderEn: "e.g. Urgent bike parcel / 1-ton pickup for house shifting",
    durationPresetsBn: ["১ ঘণ্টা (ওয়ান ওয়ে)", "রাউন্ড ট্রিপ", "৪ ঘণ্টা", "সারাদিন"],
    durationPresetsEn: ["1 hr (One-way)", "Round trip", "4 hours", "Full day"],
    budgetPresets: ["250", "600", "1500", "3500"],
  },
  skilled: {
    headerBg: "from-ochre/15 via-ochre-soft/60 to-transparent",
    badgeCls: "bg-ochre-soft text-ochre-deep border-ochre/30",
    titleBn: "দক্ষ কারিগর / ক্লিনার টিম ডাকুন",
    titleEn: "Hire Skilled Technician or Crew",
    hintBn:
      "সমস্যার ধরন, বাসা নাকি অফিস এবং যন্ত্রপাতি/ম্যাটেরিয়াল কার—তা নির্বাচন করলে সঠিক মিস্ত্রি পাবেন।",
    hintEn:
      "Select property type, crew size, and whether the technician should bring spare parts/tools.",
    titlePlaceholderBn: "যেমন: ৩ বেডরুম ডিপ ক্লিনিং টিম / বাথরুম গিজার ও ট্যাপ মেরামত",
    titlePlaceholderEn: "e.g. Full 3BHK deep cleaning crew / AC master servicing",
    durationPresetsBn: ["২–৩ ঘণ্টা", "১ দিন", "২ দিন", "চুক্তিভিত্তিক কাজ"],
    durationPresetsEn: ["2–3 hours", "1 day", "2 days", "Complete job"],
    budgetPresets: ["800", "1800", "3500", "8000"],
  },
  caregiver: {
    headerBg: "from-brick/12 via-brick-soft/65 to-transparent",
    badgeCls: "bg-brick-soft text-brick border-brick/25",
    titleBn: "রোগী বা বয়স্ক সেবার রিকোয়েস্ট",
    titleEn: "Request Patient or Elderly Caregiver",
    hintBn:
      "হাসপাতাল নাকি বাসা, ডিউটি শিফট এবং পুরুষ/নারী কেয়ারগিভার প্রিফারেন্স স্পষ্টভাবে উল্লেখ করুন।",
    hintEn:
      "Specify hospital or home care, shift timing, patient condition, and caregiver gender preference.",
    titlePlaceholderBn: "যেমন: হাসপাতালে নাইট শিফট রোগীর অ্যাটেনডেন্ট / বাসায় বয়স্ক সেবা",
    titlePlaceholderEn: "e.g. Night-shift hospital attendant / Elderly care at home",
    durationPresetsBn: ["ডে শিফট (৮ ঘণ্টা)", "নাইট শিফট (১২ ঘণ্টা)", "২৪ ঘণ্টা", "১ মাস"],
    durationPresetsEn: ["Day shift (8h)", "Night shift (12h)", "24 hours", "1 month"],
    budgetPresets: ["1000", "1500", "7000", "15000"],
  },
  "pet-caretaker": {
    headerBg: "from-mint/20 via-tint/70 to-transparent",
    badgeCls: "bg-tint text-pine border-pine/25",
    titleBn: "পেট কেয়ারটেকার বুক করুন 🐾",
    titleEn: "Book a Loving Pet Caretaker 🐾",
    hintBn:
      "আপনার পোষা প্রাণী (বিড়াল/কুকুর/পাখি), সংখ্যা, খাবারের রুটিন ও ভ্যাকসিন তথ্য লিখুন।",
    hintEn:
      "Tell us about your furry/feathered friend — pet type, count, feeding routine & care needs.",
    titlePlaceholderBn: "যেমন: ২টি পার্শিয়ান বিড়ালের ৩ দিনের হোম সিটিং ও খাবার দেওয়া",
    titlePlaceholderEn: "e.g. 3-day home sitting for 2 Persian cats / Daily dog walk",
    durationPresetsBn: ["১ ঘণ্টা ওয়াকিং", "দিনে ২ বার ভিজিট", "২ দিন", "১ সপ্তাহ"],
    durationPresetsEn: ["1 hr walk", "2 visits/day", "2 days", "1 week"],
    budgetPresets: ["400", "900", "1800", "4500"],
  },
};

export function PostJobForm({
  activeTab,
  initialCategory,
  sectionLabel,
}: {
  activeTab?: CategoryTabSlug;
  initialCategory?: string;
  sectionLabel?: string;
} = {}) {
  const { locale, t } = useLanguage();
  const isEn = locale === "en";
  const pt = t.postForm;

  const effectiveTab: CategoryTabSlug = activeTab ?? "any-work";
  const theme = TAB_ACCENT[effectiveTab];

  const availableOptions = useMemo(() => {
    if (!activeTab || activeTab === "any-work") {
      return CATEGORY_OPTIONS;
    }
    return getCategoriesForTab(activeTab);
  }, [activeTab]);

  const defaultCat = useMemo(() => {
    if (
      initialCategory &&
      CATEGORY_OPTIONS.some((c) => c.value === initialCategory)
    ) {
      return initialCategory;
    }
    return availableOptions[0]?.value ?? "ইলেকট্রিশিয়ান";
  }, [initialCategory, availableOptions]);

  const [selectedCategory, setSelectedCategory] = useState(defaultCat);
  const [prevDefaultCat, setPrevDefaultCat] = useState(defaultCat);
  if (defaultCat !== prevDefaultCat) {
    setPrevDefaultCat(defaultCat);
    setSelectedCategory(defaultCat);
  }

  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [demoCode, setDemoCode] = useState("");
  const [otpNote, setOtpNote] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [budgetVal, setBudgetVal] = useState("");
  const [durationVal, setDurationVal] = useState("");
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Category-specific specialized fields
  // 1) Transportation
  const [transportMode, setTransportMode] = useState<"ride" | "parcel" | "shifting">("parcel");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [parcelWeight, setParcelWeight] = useState("");
  // 2) Skilled
  const [propertyType, setPropertyType] = useState<"home" | "office" | "shop">("home");
  const [toolsOption, setToolsOption] = useState<"worker-tools" | "have-materials">("worker-tools");
  const [workerCountNeeded, setWorkerCountNeeded] = useState("1");
  // 3) Caregiver
  const [carePlace, setCarePlace] = useState<"hospital" | "home">("hospital");
  const [careShift, setCareShift] = useState<"day" | "night" | "24h">("day");
  const [careGenderPref, setCareGenderPref] = useState<"any" | "female" | "male">("female");
  const [patientCondition, setPatientCondition] = useState("");
  // 4) Pet Caretaker
  const [petSpecies, setPetSpecies] = useState<"cat" | "dog" | "bird" | "other">("cat");
  const [petCount, setPetCount] = useState("1");
  const [petVaccinated, setPetVaccinated] = useState<"yes" | "no">("yes");
  const [petTemperament, setPetTemperament] = useState("");
  // 5) Any Work
  const [helpersCount, setHelpersCount] = useState("1");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("");

  const canSubmit = useMemo(
    () => verified && state !== "loading",
    [verified, state]
  );

  function buildStructuredDetails(rawDescription: string): string {
    const parts: string[] = [];

    if (activeTab === "transportation") {
      const modeLabel =
        transportMode === "ride"
          ? "Passenger Ride"
          : transportMode === "parcel"
            ? "Parcel Delivery"
            : "Goods / House Shifting";
      parts.push(`[Transport: ${modeLabel}]`);
      if (location) parts.push(`Pickup: ${location}`);
      if (dropoffLocation.trim()) parts.push(`Drop-off: ${dropoffLocation.trim()}`);
      if (parcelWeight.trim()) parts.push(`Load/Parcel Info: ${parcelWeight.trim()}`);
    } else if (activeTab === "skilled") {
      parts.push(
        `[Place: ${propertyType.toUpperCase()} | Pros needed: ${workerCountNeeded} | Tools: ${
          toolsOption === "worker-tools"
            ? "Technician brings tools"
            : "Client has parts/materials"
        }]`
      );
    } else if (activeTab === "caregiver") {
      parts.push(
        `[Care Venue: ${carePlace === "hospital" ? "Hospital" : "Home"} | Shift: ${careShift.toUpperCase()} | Preferred Caregiver: ${careGenderPref}]`
      );
      if (patientCondition.trim()) {
        parts.push(`Patient Info: ${patientCondition.trim()}`);
      }
    } else if (activeTab === "pet-caretaker") {
      parts.push(
        `[Pet: ${petSpecies.toUpperCase()} × ${petCount} | Vaccinated: ${petVaccinated.toUpperCase()}]`
      );
      if (petTemperament.trim()) {
        parts.push(`Routine/Notes: ${petTemperament.trim()}`);
      }
    } else if (activeTab === "any-work") {
      parts.push(`[Helpers needed: ${helpersCount}]`);
      if (preferredTimeSlot.trim()) {
        parts.push(`Preferred Time: ${preferredTimeSlot.trim()}`);
      }
    }

    if (rawDescription.trim()) {
      parts.push(rawDescription.trim());
    }
    return parts.join(" · ");
  }

  async function requestOtp() {
    if (otpLoading) return;
    if (phone.trim().length < 11) {
      setOtpNote(pt.phoneMinErr);
      return;
    }
    setOtpLoading(true);
    setOtpNote("");
    setDemoCode("");
    setVerified(false);
    try {
      const res = await fetch("/api/employer/request-otp", {
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
    if (verifyLoading) return;
    setVerifyLoading(true);
    setOtpNote("");
    try {
      const res = await fetch("/api/employer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          code: otpCode,
          fullName: employerName,
          location,
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setVerified(false);
        setOtpNote(json.error ?? pt.otpInvalidErr);
        return;
      }
      setVerified(true);
      setOtpNote(pt.verifiedText);
    } catch {
      setOtpNote(pt.networkErr);
    } finally {
      setVerifyLoading(false);
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!verified || state === "loading") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("loading");
    setMessage("");

    const rawDesc = String(data.get("description") ?? "");
    const combinedDesc = activeTab ? buildStructuredDetails(rawDesc) : rawDesc;

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerName: data.get("employerName"),
          phone: data.get("phone"),
          title: data.get("title"),
          category: selectedCategory,
          location: data.get("location"),
          budget: budgetVal || data.get("budget"),
          jobType: data.get("jobType"),
          durationText: durationVal || data.get("durationText"),
          description: combinedDesc,
          urgent: data.get("urgent") === "on",
          terms: data.get("terms") === "on",
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !json.ok) {
        setState("error");
        setMessage(json.error ?? pt.genericErr);
        return;
      }
      setState("done");
      setVerified(false);
      setOtpCode("");
      setOtpNote("");
      setDemoCode("");
      form.reset();
      setEmployerName("");
      setPhone("");
      setLocation("");
      setDropoffLocation("");
      setParcelWeight("");
      setPatientCondition("");
      setPetTemperament("");
      setPreferredTimeSlot("");
      setBudgetVal("");
      setDurationVal("");
      setSelectedCategory(defaultCat);
      setTimeout(() => setState("idle"), 6000);
    } catch {
      setState("error");
      setMessage(pt.networkErr);
    }
  }

  const durationPresets = isEn
    ? theme.durationPresetsEn
    : theme.durationPresetsBn;

  return (
    <div
      id="post-form"
      className="shadow-lift scroll-mt-32 overflow-hidden rounded-3xl border border-line bg-card"
    >
      {/* Customized Category Header Band */}
      <div
        className={cn(
          "border-b border-line bg-gradient-to-br p-5 sm:px-7 sm:py-6",
          theme.headerBg
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xl font-bold text-ink">
            {activeTab ? (isEn ? theme.titleEn : theme.titleBn) : pt.heading}
          </h3>
          {sectionLabel && (
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[11.5px] font-bold",
                theme.badgeCls
              )}
            >
              {sectionLabel}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist">
          {activeTab ? (isEn ? theme.hintEn : theme.hintBn) : pt.subheading}
        </p>
      </div>

      <div className="p-5 sm:p-7">
        <div className=" flex items-start gap-2 rounded-2xl border border-pine/15 bg-tint/60 px-3.5 py-2.5 text-[12px] leading-relaxed text-pine">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>{pt.demoBanner}</span>
        </div>

        {/* Quick Subcategory Chips when inside a category tab */}
        {activeTab && activeTab !== "any-work" && (
          <div className="mt-4">
            <p className="mb-2 text-[12px] font-semibold text-mist">
              {pt.quickPickLabel}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {availableOptions.map((opt) => {
                const active = selectedCategory === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedCategory(opt.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                      active
                        ? "border-pine bg-pine text-paper"
                        : "border-line bg-paper text-ink hover:border-pine/40"
                    )}
                  >
                    {isEn ? opt.en : opt.bn}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={submit} className="mt-5 space-y-4">
          {/* TAILORED CUSTOM SECTION PER TAB */}
          {activeTab === "transportation" && (
            <div className="space-y-3.5 rounded-2xl border border-river/20 bg-rivertint/45 p-4">
              <p className="flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.06em] text-river">
                <Navigation size={14} />
                {isEn ? "Trip & Parcel Details" : "রাইড / পার্সেল / শিফটিং বিবরণ"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: "parcel" as const,
                    bn: "পার্সেল ডেলিভারি",
                    en: "Parcel Drop",
                  },
                  { id: "ride" as const, bn: "যাত্রী রাইড", en: "Passenger Ride" },
                  {
                    id: "shifting" as const,
                    bn: "বাসা/মাল শিফটিং",
                    en: "Cargo Shifting",
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setTransportMode(m.id);
                      if (m.id === "parcel") {
                        setSelectedCategory(
                          "পার্সেল ও কুরিয়ার ডেলিভারি (Parcel Delivery)"
                        );
                      } else if (m.id === "ride") {
                        setSelectedCategory("Bike");
                      } else {
                        setSelectedCategory("Truck");
                      }
                    }}
                    className={cn(
                      "rounded-xl border px-2.5 py-2 text-center text-[12.5px] font-bold transition-all",
                      transportMode === m.id
                        ? "border-river bg-river text-white shadow-sm"
                        : "border-line bg-card text-ink hover:border-river/40"
                    )}
                  >
                    {isEn ? m.en : m.bn}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                    {isEn ? "Drop-off Destination" : "গন্তব্য / ড্রপ লোকেশন"}
                  </label>
                  <div className="relative">
                    <MapPin
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-river"
                    />
                    <input
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      placeholder={
                        isEn
                          ? "e.g. Uttara / Destination Area"
                          : "যেমন: গন্তব্য এলাকা / রোড"
                      }
                      className="w-full rounded-xl border border-line bg-card py-2.5 pl-9 pr-3 text-[14px] text-ink outline-none focus:border-river"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                    {transportMode === "ride"
                      ? isEn
                        ? "Passengers / Luggage"
                        : "যাত্রী সংখ্যা / ব্যাগ"
                      : isEn
                        ? "Parcel / Load Size"
                        : "পার্সেল বা মালের ওজন/ধরন"}
                  </label>
                  <div className="relative">
                    <Package
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-river"
                    />
                    <input
                      value={parcelWeight}
                      onChange={(e) => setParcelWeight(e.target.value)}
                      placeholder={
                        transportMode === "ride"
                          ? isEn
                            ? "e.g. 1 person, 1 bag"
                            : "যেমন: ১ জন যাত্রী"
                          : isEn
                            ? "e.g. 5kg box / 2-room furniture"
                            : "যেমন: ৫ কেজি পার্সেল / ২ রুমের ফার্নিচার"
                      }
                      className="w-full rounded-xl border border-line bg-card py-2.5 pl-9 pr-3 text-[14px] text-ink outline-none focus:border-river"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "skilled" && (
            <div className="space-y-3.5 rounded-2xl border border-ochre/30 bg-ochre-soft/35 p-4">
              <p className="flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.06em] text-ochre-deep">
                <Wrench size={14} />
                {isEn
                  ? "Technical & Site Setup"
                  : "কাজের স্থান ও সরঞ্জাম তথ্য"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "home" as const, bn: "বাসা / ফ্ল্যাট", en: "Home / Flat" },
                  { id: "office" as const, bn: "অফিস", en: "Office" },
                  { id: "shop" as const, bn: "দোকান / শোরুম", en: "Shop / Commercial" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPropertyType(p.id)}
                    className={cn(
                      "rounded-xl border px-2.5 py-2 text-[12.5px] font-bold transition-colors",
                      propertyType === p.id
                        ? "border-pine bg-pine text-paper"
                        : "border-line bg-card text-ink"
                    )}
                  >
                    {isEn ? p.en : p.bn}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                    {isEn ? "Tools & Spare Parts" : "যন্ত্রপাতি ও পার্টস"}
                  </label>
                  <select
                    value={toolsOption}
                    onChange={(e) =>
                      setToolsOption(
                        e.target.value as "worker-tools" | "have-materials"
                      )
                    }
                    className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-pine"
                  >
                    <option value="worker-tools">
                      {isEn
                        ? "Worker brings tools (buy parts as needed)"
                        : "মিস্ত্রি যন্ত্রপাতি আনবেন (প্রয়োজনে পার্টস কেনা হবে)"}
                    </option>
                    <option value="have-materials">
                      {isEn
                        ? "I already have parts/materials ready"
                        : "আমার কাছে পার্টস/মালামাল কেনা আছে"}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                    {isEn ? "Technicians / Crew Size" : "কতজন কর্মী প্রয়োজন?"}
                  </label>
                  <select
                    value={workerCountNeeded}
                    onChange={(e) => setWorkerCountNeeded(e.target.value)}
                    className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-pine"
                  >
                    <option value="1">{isEn ? "1 Skilled Pro" : "১ জন দক্ষ মিস্ত্রি"}</option>
                    <option value="2">{isEn ? "2 Pros (Pro + Helper)" : "২ জন (মিস্ত্রি + হেল্পার)"}</option>
                    <option value="3-5">{isEn ? "3–5 Person Team" : "৩–৫ জনের পূর্ণ টিম"}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "caregiver" && (
            <div className="space-y-3.5 rounded-2xl border border-brick/25 bg-brick-soft/40 p-4">
              <p className="flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.06em] text-brick">
                <HeartHandshake size={14} />
                {isEn
                  ? "Patient & Shift Preferences"
                  : "রোগী ও ডিউটি শিফট তথ্য"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "hospital" as const,
                    bn: "হাসপাতালে সেবা",
                    en: "At Hospital",
                  },
                  { id: "home" as const, bn: "বাসায় সেবা", en: "At Home" },
                ].map((cp) => (
                  <button
                    key={cp.id}
                    type="button"
                    onClick={() => {
                      setCarePlace(cp.id);
                      setSelectedCategory(
                        cp.id === "hospital"
                          ? "হাসপাতালে রোগীর দেখাশোনা"
                          : "বাসায় রোগীর দেখাশোনা"
                      );
                    }}
                    className={cn(
                      "rounded-xl border py-2 text-[13px] font-bold transition-colors",
                      carePlace === cp.id
                        ? "border-brick bg-brick text-white"
                        : "border-line bg-card text-ink"
                    )}
                  >
                    {isEn ? cp.en : cp.bn}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                    {isEn ? "Duty Shift" : "ডিউটি শিফট"}
                  </label>
                  <select
                    value={careShift}
                    onChange={(e) =>
                      setCareShift(e.target.value as "day" | "night" | "24h")
                    }
                    className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-pine"
                  >
                    <option value="day">{isEn ? "Day Shift (8am–6pm)" : "ডে শিফট (সকাল–সন্ধ্যা)"}</option>
                    <option value="night">{isEn ? "Night Shift (8pm–8am)" : "নাইট শিফট (রাত ৮টা–সকাল ৮টা)"}</option>
                    <option value="24h">{isEn ? "24-Hour Full Support" : "২৪ ঘণ্টা সার্বক্ষণিক"}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                    {isEn ? "Caregiver Preference" : "কেয়ারগিভার প্রিফারেন্স"}
                  </label>
                  <select
                    value={careGenderPref}
                    onChange={(e) =>
                      setCareGenderPref(
                        e.target.value as "any" | "female" | "male"
                      )
                    }
                    className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-pine"
                  >
                    <option value="female">{isEn ? "Female Caregiver" : "মহিলা কেয়ারগিভার"}</option>
                    <option value="male">{isEn ? "Male Caregiver" : "পুরুষ কেয়ারগিভার"}</option>
                    <option value="any">{isEn ? "No Preference" : "যেকোনো অভিজ্ঞ কর্মী"}</option>
                  </select>
                </div>
              </div>
              <input
                value={patientCondition}
                onChange={(e) => setPatientCondition(e.target.value)}
                placeholder={
                  isEn
                    ? "Patient age / hospital cabin / mobility notes (optional)"
                    : "রোগীর বয়স, হাসপাতালের নাম/কেবিন বা শারীরিক অবস্থা (ঐচ্ছিক)"
                }
                className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-pine"
              />
            </div>
          )}

          {activeTab === "pet-caretaker" && (
            <div className="space-y-3.5 rounded-2xl border border-pine/25 bg-tint/55 p-4">
              <p className="flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.06em] text-pine">
                <PawPrint size={14} />
                {isEn
                  ? "Your Pet Profile & Care Routine"
                  : "আপনার পোষা প্রাণীর তথ্য ও রুটিন"}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "cat" as const, bn: "🐱 বিড়াল", en: "🐱 Cat" },
                  { id: "dog" as const, bn: "🐶 কুকুর", en: "🐶 Dog" },
                  { id: "bird" as const, bn: "🦜 পাখি", en: "🦜 Bird" },
                  { id: "other" as const, bn: "🐰 অন্যান্য", en: "🐰 Other" },
                ].map((pet) => (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => setPetSpecies(pet.id)}
                    className={cn(
                      "rounded-xl border py-2 text-[12.5px] font-bold transition-colors",
                      petSpecies === pet.id
                        ? "border-pine bg-pine text-paper shadow-sm"
                        : "border-line bg-card text-ink hover:border-pine/40"
                    )}
                  >
                    {isEn ? pet.en : pet.bn}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                    {isEn ? "Number of Pets" : "পোষা প্রাণীর সংখ্যা"}
                  </label>
                  <select
                    value={petCount}
                    onChange={(e) => setPetCount(e.target.value)}
                    className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-pine"
                  >
                    <option value="1">{isEn ? "1 Pet" : "১টি"}</option>
                    <option value="2">{isEn ? "2 Pets" : "২টি"}</option>
                    <option value="3+">{isEn ? "3 or more Pets" : "৩টি বা তার বেশি"}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                    {isEn ? "Vaccination Status" : "ভ্যাকসিন দেওয়া আছে কি?"}
                  </label>
                  <select
                    value={petVaccinated}
                    onChange={(e) =>
                      setPetVaccinated(e.target.value as "yes" | "no")
                    }
                    className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-pine"
                  >
                    <option value="yes">{isEn ? "Yes, Vaccinated" : "হ্যাঁ, ভ্যাকসিন দেওয়া"}</option>
                    <option value="no">{isEn ? "Not yet / Puppy-Kitten" : "এখনো দেওয়া হয়নি / ছোট বাচ্চা"}</option>
                  </select>
                </div>
              </div>
              <input
                value={petTemperament}
                onChange={(e) => setPetTemperament(e.target.value)}
                placeholder={
                  isEn
                    ? "Breed, food schedule, litter cleaning or special instructions…"
                    : "জাত (যেমন Persian/Deshi), খাবারের সময়, লিটার পরিষ্কার বা বিশেষ অভ্যাস…"
                }
                className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-pine"
              />
            </div>
          )}

          {activeTab === "any-work" && (
            <div className="space-y-3 rounded-2xl border border-pine/20 bg-paper/80 p-4">
              <p className="flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.06em] text-pine">
                <Briefcase size={14} />
                {isEn ? "Custom Task Setup" : "কাস্টম কাজের সেটআপ"}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                    {isEn ? "How many helpers needed?" : "কতজন লোক লাগবে?"}
                  </label>
                  <select
                    value={helpersCount}
                    onChange={(e) => setHelpersCount(e.target.value)}
                    className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-pine"
                  >
                    <option value="1">{isEn ? "1 Person" : "১ জন"}</option>
                    <option value="2">{isEn ? "2 People" : "২ জন"}</option>
                    <option value="3-5">{isEn ? "3–5 People" : "৩–৫ জন"}</option>
                    <option value="5+">{isEn ? "More than 5" : "৫ জনের বেশি"}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-ink">
                    {isEn ? "Preferred Date / Time" : "কখন কাজ করাতে চান?"}
                  </label>
                  <input
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    placeholder={
                      isEn ? "e.g. Today 4 PM / Tomorrow morning" : "যেমন: আজ বিকাল ৪টা / আগামীকাল সকাল"
                    }
                    className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-pine"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Employer Contact & OTP Verification */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
                {pt.nameLabel}
              </label>
              <input
                name="employerName"
                required
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                placeholder={pt.namePlaceholder}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
                {pt.phoneLabel}
              </label>
              <div className="flex gap-2">
                <input
                  name="phone"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setVerified(false);
                  }}
                  placeholder={pt.phonePlaceholder}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={requestOtp}
                  disabled={otpLoading}
                  className="shrink-0 rounded-xl border border-line bg-paper px-3.5 py-3 text-[13px] font-semibold text-pine transition-colors hover:bg-tint disabled:opacity-60"
                >
                  {otpLoading ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    pt.sendOtp
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Location Suggestions + Input */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
                {activeTab === "transportation"
                  ? isEn
                    ? "Pickup Location (Your Area)"
                    : "পিকআপ লোকেশন (আপনার এলাকা)"
                  : pt.locationLabel}
              </label>
              <input
                name="location"
                required
                list="wc-area-suggestions"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={pt.locationPlaceholder}
                className={inputCls}
              />
              <datalist id="wc-area-suggestions">
                <option value={isEn ? "Dhanmondi, Dhaka" : "ধানমন্ডি, ঢাকা"} />
                <option value={isEn ? "Mirpur, Dhaka" : "মিরপুর, ঢাকা"} />
                <option value={isEn ? "Uttara, Dhaka" : "উত্তরা, ঢাকা"} />
                <option value={isEn ? "Agrabad, Chattogram" : "আগ্রাবাদ, চট্টগ্রাম"} />
                <option value={isEn ? "Rajshahi Sadar" : "রাজশাহী সদর"} />
                <option value={isEn ? "Zindabazar, Sylhet" : "জিন্দাবাজার, সিলেট"} />
                <option value={isEn ? "Khulna Sadar" : "খুলনা সদর"} />
                <option value={isEn ? "Bogura Sadar" : "বগুড়া সদর"} />
                <option value={isEn ? "Rangpur Sadar" : "রংপুর সদর"} />
              </datalist>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
                <ShieldCheck size={14} className="text-pine" />
                {pt.otpLabel}
              </label>
              <div className="flex gap-2">
                <input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder={pt.otpPlaceholder}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={verifyLoading}
                  className="shrink-0 rounded-xl bg-pine px-3.5 py-3 text-[13px] font-semibold text-paper transition-colors hover:bg-pine-dark disabled:opacity-60"
                >
                  {verifyLoading ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    pt.verifyBtn
                  )}
                </button>
              </div>
            </div>
          </div>

          {(otpNote || demoCode || verified) && (
            <div
              className={`rounded-2xl border px-4 py-3 text-[13px] ${
                verified
                  ? "border-pine/20 bg-tint text-pine"
                  : "border-ochre/20 bg-ochre-soft text-ink"
              }`}
            >
              <p className="flex items-center gap-2 font-medium">
                {verified ? <ShieldCheck size={15} /> : <Smartphone size={15} />}
                {otpNote || (verified ? pt.verifiedText : "OTP")}
              </p>
              {demoCode && !verified ? (
                <p className="mt-1 font-semibold">
                  {pt.demoOtpPrefix} {demoCode}
                </p>
              ) : null}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
              {pt.titleLabel}
            </label>
            <input
              name="title"
              required
              minLength={4}
              placeholder={
                activeTab
                  ? isEn
                    ? theme.titlePlaceholderEn
                    : theme.titlePlaceholderBn
                  : pt.titlePlaceholder
              }
              className={inputCls}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
                {pt.categoryLabel}
              </label>
              <select
                name="category"
                required
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={inputCls}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {isEn ? opt.en : opt.bn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
                {pt.jobTypeLabel}
              </label>
              <select name="jobType" required className={inputCls}>
                {JOB_TYPE_OPTIONS.map((jt) => (
                  <option key={jt.value} value={jt.value}>
                    {isEn ? jt.en : jt.bn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
                {pt.budgetLabel}
              </label>
              <input
                name="budget"
                required
                value={budgetVal}
                onChange={(e) => setBudgetVal(e.target.value)}
                inputMode="numeric"
                pattern="[0-9,০-৯]+"
                placeholder={pt.budgetPlaceholder}
                className={inputCls}
              />
              {activeTab && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {theme.budgetPresets.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBudgetVal(amt)}
                      className="rounded-lg border border-line bg-paper px-2 py-0.5 text-[11px] font-semibold text-mist transition-colors hover:border-pine hover:text-pine"
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
                {pt.durationLabel}
              </label>
              <input
                name="durationText"
                required
                value={durationVal}
                onChange={(e) => setDurationVal(e.target.value)}
                placeholder={pt.durationPlaceholder}
                className={inputCls}
              />
              {activeTab && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {durationPresets.map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDurationVal(dur)}
                      className="rounded-lg border border-line bg-paper px-2 py-0.5 text-[11px] font-semibold text-mist transition-colors hover:border-pine hover:text-pine"
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
              {pt.descLabel}
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder={pt.descPlaceholder}
              className="w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-line bg-paper/50 px-4 py-3 text-[13.5px] font-medium text-ink">
            <input
              type="checkbox"
              name="urgent"
              className="size-4 rounded border-line text-pine"
            />
            {pt.urgentLabel}
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-line bg-paper/50 px-4 py-3 text-[13.5px] font-medium text-ink">
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

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ochre py-3.5 text-[15.5px] font-semibold text-ink shadow-[0_10px_26px_-8px_rgba(245,158,11,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
          >
            {state === "loading" ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <>
                <Send size={16} /> {pt.submitBtn}
              </>
            )}
          </button>

          {!verified && (
            <p className="text-center text-[12px] text-faint">{pt.verifyHint}</p>
          )}

          <AnimatePresence>
            {state === "done" && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-tint px-4 py-3 text-center text-[13.5px] font-semibold text-pine"
              >
                <Check size={15} className="shrink-0" /> {pt.successMsg}
              </motion.p>
            )}
            {state === "error" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl bg-brick-soft px-4 py-3 text-center text-[13.5px] font-medium text-brick"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Clean Terms Modal */}
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
    </div>
  );
}
