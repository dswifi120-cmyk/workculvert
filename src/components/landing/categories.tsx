import {
  AirVent,
  Car,
  Hammer,
  HeartHandshake,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion-primitives";

const CATS = [
  { icon: Zap, name: "ইলেকট্রিশিয়ান", desc: "ওয়্যারিং ও মেরামত", count: "৩২০+ কর্মী", tint: "bg-ochre-soft text-ochre-deep" },
  { icon: Wrench, name: "প্লাম্বার", desc: "পাইপ ও পানির লাইন", count: "২১০+ কর্মী", tint: "bg-rivertint text-river" },
  { icon: Sparkles, name: "ক্লিনার", desc: "বাসা ও অফিস পরিষ্কার", count: "২৪৫+ কর্মী", tint: "bg-tint text-pine" },
  { icon: HeartHandshake, name: "কেয়ারগিভার", desc: "রোগী ও বয়স্ক সেবা", count: "১৩০+ কর্মী", tint: "bg-brick-soft text-brick" },
  { icon: Paintbrush, name: "রংমিস্ত্রি", desc: "দেয়াল ও ফার্নিচার", count: "১৫০+ কর্মী", tint: "bg-tint text-pine" },
  { icon: Hammer, name: "কারপেন্টার", desc: "কাঠ ও ফার্নিচার কাজ", count: "১৪০+ কর্মী", tint: "bg-ochre-soft text-ochre-deep" },
  { icon: Car, name: "ড্রাইভার", desc: "দৈনিক ও মাসিক বেসিস", count: "৯৫+ কর্মী", tint: "bg-rivertint text-river" },
  { icon: ShieldCheck, name: "নিরাপত্তাকর্মী", desc: "ডে-নাইট শিফট", count: "৮০+ কর্মী", tint: "bg-tint text-pine" },
  { icon: AirVent, name: "এসি মিস্ত্রি", desc: "সার্ভিসিং ও সেটআপ", count: "৬০+ কর্মী", tint: "bg-rivertint text-river" },
];

export function Categories() {
  return (
    <section id="services" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="সার্ভিসসমূহ"
          title={
            <>
              আপনার প্রয়োজন অনুযায়ী{" "}
              <span className="font-serif text-pine">কাজের ধরন</span> বেছে নিন
            </>
          }
          copy="নয়টি জনপ্রিয় ক্যাটাগরিতে শত শত যাচাইকৃত কর্মী — প্রতিটি প্রোফাইলে রেটিং, অভিজ্ঞতা ও আগের কাজের রেকর্ড।"
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CATS.map((c, i) => (
            <Reveal key={c.name} delay={0.04 + (i % 3) * 0.07}>
              <a
                href="#jobs"
                className="shadow-card group flex h-full flex-col rounded-3xl border border-line bg-card p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-pine/30 hover:shadow-lift sm:p-6"
              >
                <span
                  className={`grid size-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${c.tint}`}
                >
                  <c.icon size={22} />
                </span>
                <p className="mt-4 text-[16px] font-semibold text-ink sm:text-[17px]">
                  {c.name}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-mist">
                  {c.desc}
                </p>
                <p className="mt-3 text-[12px] font-semibold text-pine">
                  {c.count}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
