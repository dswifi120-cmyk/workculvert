"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  MapPin,
  Sparkles,
  SquarePen,
  Star,
  Timer,
  Wallet,
  Wrench,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const wordContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const word: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.7, ease: EASE }}
      className="relative mx-auto mt-14 h-[540px] w-full max-w-md lg:mt-0 lg:h-[560px]"
    >
      {/* glow blobs */}
      <div className="absolute -right-10 top-6 h-64 w-64 rounded-full bg-tint blur-[80px]" />
      <div className="absolute -left-8 bottom-8 h-56 w-56 rounded-full bg-ochre-soft blur-[70px]" />

      {/* job card */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="shadow-lift absolute left-0 top-4 w-[290px] rotate-[-3deg] rounded-3xl border border-line bg-card p-5"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brick-soft px-2.5 py-1 text-[11px] font-semibold text-brick">
            <span className="size-1.5 rounded-full bg-brick" /> জরুরি
          </span>
          <span className="text-[11px] text-faint">২০ মিনিট আগে</span>
        </div>
        <p className="mt-3.5 text-[17px] font-semibold leading-snug text-ink">
          কিচেন সিংক পাইপ লিকেজ মেরামত
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-[13px] text-mist">
          <MapPin size={13} className="text-river" /> সাতমাথা, বগুড়া
          <span className="rounded-full bg-tint px-2 py-0.5 text-[11px] font-medium text-pine">
            প্লাম্বার
          </span>
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <p className="font-latin text-xl font-bold text-ink">
            ৳১,৮০০
            <span className="ml-1 text-[11px] font-normal text-faint">ফিক্সড</span>
          </p>
          <span className="rounded-full bg-pine px-3.5 py-2 text-[12px] font-semibold text-paper">
            আবেদন করুন
          </span>
        </div>
      </motion.div>

      {/* worker card */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="shadow-lift absolute bottom-16 right-0 w-[290px] rotate-[2.5deg] rounded-3xl border border-line bg-card p-5"
      >
        <div className="flex items-center gap-3.5">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pine to-river text-lg font-bold text-paper">
            রউ
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-[16px] font-semibold text-ink">
              রহিম উদ্দিন
              <BadgeCheck size={16} className="shrink-0 text-river" />
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-mist">
              <Wrench size={12} className="text-ochre-deep" />
              ইলেকট্রিশিয়ান · ৮ বছর
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-paper px-3.5 py-3">
          <span className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={13} className="fill-ochre text-ochre" />
            ))}
          </span>
          <span className="text-[13px] font-semibold text-ink">৪.৯</span>
          <span className="text-[12px] text-faint">(১২৪ রিভিউ)</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-pine">
            <span className="relative flex size-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-pine opacity-50" />
              <span className="relative size-2 rounded-full bg-pine" />
            </span>
            এখন ফ্রি
          </span>
          <span className="text-[13px] font-semibold text-river">
            প্রোফাইল দেখুন →
          </span>
        </div>
      </motion.div>

      {/* notification chip */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="shadow-card absolute left-6 top-[300px] w-[230px] rounded-2xl border border-line bg-card/95 p-3.5 backdrop-blur sm:left-10 lg:top-[310px]"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ochre-soft text-ochre-deep">
            <Bell size={16} />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-ink">নতুন আবেদন এসেছে!</p>
            <p className="text-[11.5px] text-faint">কিচেন সিংক মেরামত · ২ মিনিট আগে</p>
          </div>
        </div>
      </motion.div>

      {/* match chip */}
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="shadow-card absolute right-2 top-[120px] rounded-2xl border border-line bg-pine px-4 py-3 text-paper"
      >
        <p className="flex items-center gap-1.5 text-[11px] text-paper/70">
          <Sparkles size={11} className="text-mint" /> স্কিল ম্যাচ
        </p>
        <p className="font-latin text-xl font-bold text-mint">৯৮%</p>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 sm:pt-44 lg:pb-24">
      <div className="dots-bg absolute inset-0 [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-32 right-[-10%] h-[420px] w-[520px] rounded-full bg-tint/70 blur-[100px]" />
      <div className="absolute left-[-8%] top-40 h-[360px] w-[360px] rounded-full bg-ochre-soft/80 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-pine/20 bg-card/80 py-1.5 pl-2 pr-4 text-[13px] font-medium text-pine shadow-card">
              <span className="flex items-center gap-1 rounded-full bg-pine px-2.5 py-0.5 text-[11px] font-semibold text-paper">
                <span className="size-1.5 animate-pulse rounded-full bg-mint" />
                লাইভ
              </span>
              বগুড়াকেন্দ্রিক কর্মী ও কাজের মার্কেটপ্লেস
            </span>
          </motion.div>

          <motion.h1
            variants={wordContainer}
            initial="hidden"
            animate="show"
            className="mt-7 text-[clamp(2.3rem,6.2vw,4.4rem)] font-bold leading-[1.18] tracking-[-0.01em] text-ink"
          >
            {["কাজ খুঁজছেন?"].map((line) => (
              <span key={line} className="-mb-2 block overflow-hidden pb-2">
                <motion.span variants={word} className="block">
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="-mb-2 block overflow-hidden pb-2">
              <motion.span variants={word} className="block">
                নাকি{" "}
                <span className="relative inline-block font-serif text-[1.08em] leading-none text-pine">
                  কর্মী
                  <svg
                    viewBox="0 0 120 14"
                    className="absolute -bottom-1.5 left-0 w-full"
                    fill="none"
                  >
                    <motion.path
                      d="M3 10.5 C 30 3, 70 3, 117 9.5"
                      stroke="#f59e0b"
                      strokeWidth="5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.3, duration: 0.7, ease: "easeOut" }}
                    />
                  </svg>
                </span>{" "}
                খুঁজছেন?
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.65, ease: EASE }}
            className="mt-6 max-w-xl text-[15.5px] leading-[1.85] text-mist sm:text-[17px]"
          >
            ইলেকট্রিশিয়ান, প্লাম্বার, ক্লিনার থেকে কেয়ারগিভার — বগুড়ার
            যাচাইকৃত দক্ষ কর্মীদের সাথে মিনিটেই সংযোগ করুন, অথবা আপনার দক্ষতা
            অনুযায়ী পছন্দের কাজ খুঁজে নিন।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.8, ease: EASE }}
            className="mt-9 flex flex-col gap-3.5 sm:flex-row"
          >
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-pine px-7 py-4 text-[16px] font-semibold text-paper shadow-[0_14px_34px_-10px_rgba(12,91,78,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-pine-dark"
            >
              Worker হিসেবে join করুন
              <ChevronRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <a
              href="#post-job"
              className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink/12 bg-card px-7 py-4 text-[16px] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-pine/40 hover:text-pine"
            >
              <SquarePen size={17} className="text-ochre-deep" />
              কাজ পোস্ট করুন
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2"
          >
            {[
              { icon: BadgeCheck, text: "যাচাইকৃত প্রোফাইল" },
              { icon: Timer, text: "গড়ে ৩ ঘণ্টায় ম্যাচিং" },
              { icon: Wallet, text: "স্বচ্ছ মূল্য, লুকানো চার্জ নেই" },
            ].map((c) => (
              <li
                key={c.text}
                className="flex items-center gap-1.5 text-[13.5px] font-medium text-mist"
              >
                <c.icon size={15} className="text-pine" />
                {c.text}
              </li>
            ))}
          </motion.ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
