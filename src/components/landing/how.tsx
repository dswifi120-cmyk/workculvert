import { CircleUserRound, Megaphone, Handshake } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion-primitives";
import { bn } from "@/lib/utils";

const STEPS = [
  {
    n: 1,
    icon: CircleUserRound,
    title: "প্রোফাইল তৈরি করুন",
    copy: "মাত্র দুই মিনিটে ফ্রি অ্যাকাউন্ট। কর্মী হলে আপনার দক্ষতা ও এলাকা লিখুন, নিয়োগদাতা হলে প্রয়োজনটা বলুন।",
  },
  {
    n: 2,
    icon: Megaphone,
    title: "পোস্ট বা আবেদন করুন",
    copy: "কাজ পোস্ট করলেই আশেপাশের উপযুক্ত কর্মীরা নোটিফিকেশন পান। কর্মীরা পছন্দের কাজে এক ট্যাপে আবেদন করেন।",
  },
  {
    n: 3,
    icon: Handshake,
    title: "ম্যাচ করুন, কাজ শুরু করুন",
    copy: "চ্যাটে দাম ও সময় ঠিক করে কাজ শুরু। কাজ শেষে পরস্পরকে রেটিং দিন — কমিউনিটি আরও শক্তিশালী হবে।",
  },
];

export function How() {
  return (
    <section
      id="how"
      className="scroll-mt-24 border-y border-line bg-linen/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="কিভাবে কাজ করে"
          title={
            <>
              মাত্র <span className="font-serif text-pine">তিন ধাপে</span>{" "}
              শুরু করুন
            </>
          }
          copy="কোনো অ্যাজেন্সি, কোনো মাঝখানের দালাল নেই — সরাসরি কর্মী ও নিয়োগদাতা।"
        />

        <div className="relative mt-16 grid gap-5 lg:grid-cols-3">
          <svg
            className="absolute left-0 right-0 top-12 hidden h-px w-full lg:block"
            aria-hidden="true"
          >
            <line
              x1="0"
              x2="100%"
              y1="0"
              y2="0"
              stroke="rgba(12,91,78,0.25)"
              strokeWidth="2"
              strokeDasharray="6 10"
              className="animate-dashflow"
            />
          </svg>
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={0.08 + i * 0.1}>
              <div className="shadow-card group relative h-full overflow-hidden rounded-3xl border border-line bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-pine/30">
                <span className="pointer-events-none absolute -right-3 -top-7 select-none font-serif text-[130px] italic leading-none text-pine/[0.06] transition-colors duration-500 group-hover:text-pine/10">
                  {bn(s.n)}
                </span>
                <span className="relative grid size-12 place-items-center rounded-2xl bg-pine text-paper shadow-[0_10px_24px_-8px_rgba(12,91,78,0.5)]">
                  <s.icon size={21} />
                </span>
                <h3 className="relative mt-6 text-xl font-bold text-ink">
                  {s.title}
                </h3>
                <p className="relative mt-2.5 text-[14.5px] leading-[1.8] text-mist">
                  {s.copy}
                </p>
                <p className="relative mt-5 text-[13px] font-semibold text-ochre-deep">
                  ধাপ {bn(s.n)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
