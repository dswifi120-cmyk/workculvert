import Image from "next/image";
import {
  BadgeCheck,
  Headphones,
  Scale,
  Star,
  Zap,
} from "lucide-react";
import { Reveal, SectionHeading, Counter } from "@/components/motion-primitives";

const POINTS = [
  {
    icon: BadgeCheck,
    title: "যাচাইকৃত ও রেটেড কর্মী",
    copy: "প্রতিটি প্রোফাইলে NID ও দক্ষতা যাচাই করা হয়; কাজ শেষে প্রকৃত কাস্টমার রিভিউ দেন।",
  },
  {
    icon: Zap,
    title: "গড়ে ৩ ঘণ্টায় ম্যাচিং",
    copy: "লোকেশন ও দক্ষতা-ভিত্তিক স্মার্ট অ্যালগরিদম — জরুরি কাজে আরও দ্রুত।",
  },
  {
    icon: Scale,
    title: "স্বচ্ছ মূল্য",
    copy: "পোস্টের আগেই বাজেট জেনে নিন। কোনো লুকানো চার্জ বা কমিশনের চাপ নেই।",
  },
  {
    icon: Headphones,
    title: "বাংলায় লোকাল সাপোর্ট",
    copy: "বগুড়ার আমাদের নিজস্ব টিম — প্রতিদিন সকাল ৯টা থেকে রাত ৯টা পর্যন্ত।",
  },
];

export function Why() {
  return (
    <section
      id="why"
      className="relative scroll-mt-24 overflow-hidden bg-pine-deep py-20 text-paper sm:py-28"
    >
      <div className="dots-bg-light absolute inset-0 opacity-50" />
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-mint/10 blur-[120px]" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-ochre/10 blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            dark
            eyebrow="আমাদের বিশেষত্ব"
            title={
              <>
                কেন হাজারো মানুষ{" "}
                <span className="font-serif text-mint">WorkCulvert</span>
                -কে বিশ্বাস করে?
              </>
            }
            copy="আমরা শুধু একটা লিস্টিং সাইট না — আমরা বগুড়ার কাজের অর্থনীতির বিশ্বস্ত সেতু।"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {POINTS.map((p, i) => (
              <Reveal key={p.title} delay={0.08 + i * 0.07}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-mint/40">
                  <span className="grid size-11 place-items-center rounded-2xl bg-mint/15 text-mint">
                    <p.icon size={20} />
                  </span>
                  <h3 className="mt-4 text-[17px] font-bold text-paper">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.75] text-paper/60">
                    {p.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap items-center gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-3xl font-bold text-mint">
                  <Counter to={98} suffix="%" />
                </p>
                <p className="mt-1 text-[12.5px] text-paper/55">সন্তুষ্ট নিয়োগদাতা</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-mint">
                  <Counter to={74} suffix="%" />
                </p>
                <p className="mt-1 text-[12.5px] text-paper/55">কর্মীর পুনরায় কাজ পাওয়ার হার</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-mint">
                  <Counter to={4000000} prefix="৳" suffix="+" />
                </p>
                <p className="mt-1 text-[12.5px] text-paper/55">কর্মীদের মোট আয়</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* visual */}
        <Reveal delay={0.15}>
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/15 shadow-2xl">
              <Image
                src="/images/craftsman.jpg"
                alt="বগুড়ার একজন দক্ষ কর্মী"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/85 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                <div>
                  <p className="flex items-center gap-1.5 text-[15px] font-semibold text-white">
                    আব্দুল করিম <BadgeCheck size={15} className="text-mint" />
                  </p>
                  <p className="text-[12px] text-white/70">
                    মাস্টার ইলেকট্রিশিয়ান · সাতমাথা
                  </p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-ochre px-3 py-1.5 text-[13px] font-bold text-ink">
                  <Star size={12} fill="currentColor" /> ৪.৯
                </span>
              </div>
            </div>

            {/* floating verified card */}
            <div className="glass-dark absolute -right-3 top-8 animate-float rounded-2xl border border-white/15 p-4 shadow-2xl sm:-right-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-mint/20 text-mint">
                  <BadgeCheck size={18} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-paper">NID যাচাই সম্পন্ন</p>
                  <p className="text-[11px] text-paper/55">১২৪টি কাজ · ০ অভিযোগ</p>
                </div>
              </div>
            </div>

            <div className="glass-dark absolute -left-3 bottom-24 animate-float-slow rounded-2xl border border-white/15 p-4 shadow-2xl sm:-left-6">
              <p className="text-[11px] text-paper/60">এই সপ্তাহে প্রাপ্তির</p>
              <p className="text-[18px] font-bold text-mint">৳ ৯,৪০০</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
