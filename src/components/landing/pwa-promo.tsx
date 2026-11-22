"use client";

import Image from "next/image";
import {
  CheckCircle2,
  Download,
  ShieldCheck,
  Smartphone,
  Sparkles,
  WifiOff,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { useLanguage } from "@/components/language-provider";
import { usePwaInstall } from "@/components/pwa-provider";

export function PwaPromo() {
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const { isStandalone, triggerInstall } = usePwaInstall();

  const features = isEn
    ? [
        {
          icon: Zap,
          text: "1-Tap Home Screen Launch — No Play Store / App Store wait",
        },
        {
          icon: Smartphone,
          text: "Full-Screen Native App Experience on Android, iOS & Desktop",
        },
        {
          icon: WifiOff,
          text: "Fast Cached Loading & Low Mobile Data Consumption",
        },
      ]
    : [
        {
          icon: Zap,
          text: "হোম-স্ক্রিন থেকে ১ ক্লিকেই চালু — আলাদা স্টোর ডাউনলোডের ঝামেলা নেই",
        },
        {
          icon: Smartphone,
          text: "Android, iPhone ও কম্পিউটারে ফুল-স্ক্রিন অ্যাপ হিসেবে ব্যবহারযোগ্য",
        },
        {
          icon: WifiOff,
          text: "কম ডাটা খরচ ও সুপার-ফাস্ট লোডিং পারফরম্যান্স",
        },
      ];

  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-pine/20 bg-gradient-to-br from-pine-deep via-pine-dark to-[#0a4a3f] p-7 text-paper shadow-lift sm:p-12 lg:p-14">
            <div className="dots-bg-light absolute inset-0 opacity-35" />
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-mint/20 blur-[100px]" />
            <div className="absolute -bottom-24 left-12 h-72 w-72 rounded-full bg-ochre/20 blur-[100px]" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-mint">
                  <Sparkles size={13} />
                  {isEn ? "Progressive Web App (PWA)" : "মোবাইল ও ডেস্কটপ অ্যাপ (PWA)"}
                </span>

                <h2 className="mt-4 text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.18] text-white">
                  {isEn
                    ? "Install WorkCulvert on your phone & use it just like a native app"
                    : "ওয়েবসাইট থেকেই WorkCulvert অ্যাপ হিসেবে ইনস্টল করে ব্যবহার করুন"}
                </h2>

                <p className="mt-3.5 max-w-xl text-[15px] leading-[1.8] text-paper/80 sm:text-[16px]">
                  {isEn
                    ? "Post urgent tasks, book bike parcel rides, hire skilled technicians, or call a pet caretaker right from your phone's home screen."
                    : "জরুরি মিস্ত্রি ডাকা, বাইক পার্সেল পাঠানো, রোগীর সেবা বা পেট কেয়ারটেকার বুক করা—সবকিছু এখন আপনার ফোনের হোম স্ক্রিনে একটি অ্যাপের ভেতরেই।"}
                </p>

                <ul className="mt-6 space-y-3">
                  {features.map((f) => {
                    const Icon = f.icon;
                    return (
                      <li
                        key={f.text}
                        className="flex items-center gap-3 text-[14px] text-paper/90"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/10 text-mint">
                          <Icon size={16} />
                        </span>
                        <span>{f.text}</span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {isStandalone ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/15 px-6 py-3.5 text-[15px] font-bold text-mint">
                      <CheckCircle2 size={18} />
                      {isEn
                        ? "App Installed on This Device"
                        : "আপনার ডিভাইসে অ্যাপটি ইনস্টল করা আছে"}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void triggerInstall()}
                      className="inline-flex items-center gap-2.5 rounded-full bg-ochre px-7 py-4 text-[15.5px] font-bold text-ink shadow-[0_14px_34px_-8px_rgba(245,158,11,0.55)] transition-all hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-white"
                    >
                      <Download size={18} />
                      {isEn
                        ? "Install WorkCulvert App"
                        : "অ্যাপ হিসেবে ইনস্টল করুন"}
                    </button>
                  )}
                  <span className="flex items-center gap-1.5 text-[12.5px] text-paper/70">
                    <ShieldCheck size={15} className="text-mint" />
                    {isEn
                      ? "100% Free · Lightweight (< 2 MB)"
                      : "সম্পূর্ণ ফ্রি · মাত্র ২ মেগাবাইটের কম জায়গা লাগে"}
                  </span>
                </div>
              </div>

              {/* Interactive App Mockup Card */}
              <div className="mx-auto w-full max-w-[320px]">
                <div className="rounded-[2.2rem] border-4 border-white/20 bg-ink/85 p-4 shadow-2xl backdrop-blur-md">
                  <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-white/20" />
                  <div className="rounded-2xl bg-paper p-4 text-ink">
                    <div className="flex items-center gap-3 border-b border-line pb-3">
                      <Image
                        src="/icons/icon-192.png"
                        alt="WorkCulvert App Icon"
                        width={46}
                        height={46}
                        className="rounded-xl shadow-sm"
                      />
                      <div>
                        <p className="font-latin text-[15px] font-bold text-ink">
                          WorkCulvert™
                        </p>
                        <p className="text-[11.5px] font-medium text-pine">
                          {isEn
                            ? "All-Bangladesh Service App"
                            : "আপনার এলাকার সার্ভিস সুপার-অ্যাপ"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px] font-bold">
                      <div className="rounded-xl bg-tint p-2.5 text-pine">
                        🛵 {isEn ? "Ride & Parcel" : "রাইড ও পার্সেল"}
                      </div>
                      <div className="rounded-xl bg-ochre-soft p-2.5 text-ochre-deep">
                        🔧 {isEn ? "Skilled Pros" : "দক্ষ কারিগর"}
                      </div>
                      <div className="rounded-xl bg-brick-soft p-2.5 text-brick">
                        🩺 {isEn ? "Caregiver" : "কেয়ারগিভার"}
                      </div>
                      <div className="rounded-xl bg-rivertint p-2.5 text-river">
                        🐾 {isEn ? "Pet Care" : "পেট কেয়ার"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => void triggerInstall()}
                      className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-pine py-2.5 text-[12.5px] font-bold text-paper transition-colors hover:bg-pine-dark"
                    >
                      <Download size={14} />
                      {isStandalone
                        ? isEn
                          ? "Installed"
                          : "ইনস্টলড"
                        : isEn
                          ? "Add to Home Screen"
                          : "হোম স্ক্রিনে যুক্ত করুন"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
