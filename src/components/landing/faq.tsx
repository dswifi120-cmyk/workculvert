"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhoneCall, Plus } from "lucide-react";
import { Reveal, Eyebrow } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "কর্মী হিসেবে যোগ দিতে কি কোনো ফি লাগে?",
    a: "না, একদম ফ্রি। প্রোফাইল তৈরি, আবেদন ও ম্যাচিং — সবই ফ্রি। ভবিষ্যতে প্রিমিয়াম দৃশ্যমানতার ঐচ্ছিক প্ল্যান আসবে, তবে মূল ফিচার সবসময় ফ্রি থাকবে।",
  },
  {
    q: "কর্মীদের কীভাবে যাচাই করেন?",
    a: "প্রতিটি কর্মীর NID তথ্য, পূর্ব অভিজ্ঞতা এবং কমপক্ষে দুটি রেফারেন্স যাচাই করা হয়। কাজ শেষে নিয়োগদাতার রেটিং প্রোফাইলে স্থায়ীভাবে জমা হয় — তাই দক্ষতাই এখানে প্রমাণ।",
  },
  {
    q: "পেমেন্ট কীভাবে করবো?",
    a: "বর্তমানে কাজ শেষে সরাসরি কর্মীকে পেমেন্ট করবেন (ক্যাশ বা বিকাশ/নগদ)। প্ল্যাটফর্ম কোনো কমিশন কাটে না। শীঘ্রই এসক্রো-স্টাইল নিরাপদ পেমেন্ট আসছে।",
  },
  {
    q: "এটা কি শুধু বগুড়া শহরের জন্য?",
    a: "এই মুহূর্তে বগুড়া সদরকেন্দ্রিক — সাতমাথা, মালতিনগর, নামুজা, ঝিলেমিল, মাজহিরা ও আশেপাশের এলাকায় সবচেয়ে ভালো ম্যাচ পাবেন। ধাপে ধাপে পুরো জেলায় সম্প্রসারণ হবে।",
  },
  {
    q: "কাজ পোস্টের পর কতক্ষণে কর্মী পাবো?",
    a: "গড়ে ৩ ঘণ্টার মধ্যে প্রথম আবেদন আসে। জরুরি ট্যাগ দিলে আশেপাশে অনলাইনে থাকা কর্মীরা প্রায় তাৎক্ষণিক নোটিফিকেশন পান।",
  },
  {
    q: "কাজ নিয়ে দ্বন্দ্ব হলে কী হবে?",
    a: "আমাদের সাপোর্ট টিম মধ্যস্থতা করে — দুই পক্ষের কথা শুনে রেটিং ও রেকর্ড বিবেচনায় সিদ্ধান্ত নেওয়া হয়। বারবার অভিযোগপ্রাপ্ত অ্যাকাউন্ট স্থায়ীভাবে বন্ধ করা হয়।",
  },
];

export function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-line bg-linen/60 py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <Eyebrow>সাধারণ প্রশ্ন</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[1.2] text-ink">
              যা জানতে চান,{" "}
              <span className="font-serif text-pine">সোজাসুজি উত্তরে</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 max-w-sm text-[15px] leading-[1.8] text-mist">
              কর্মী ও নিয়োগদাতা — দুই পক্ষ থেকেই আসা সবচেয়ে কমন প্রশ্নগুলোর
              উত্তর এখানে।
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="shadow-card mt-8 rounded-3xl border border-line bg-card p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-tint text-pine">
                <PhoneCall size={20} />
              </span>
              <p className="mt-4 text-lg font-bold text-ink">আরও প্রশ্ন আছে?</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist">
                বাংলায় কথা বলুন আমাদের বগুড়া টিমের সাথে — সকাল ৯টা থেকে রাত ৯টা।
              </p>
              <a
                href="tel:+8801700000000"
                className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-pine/25 px-5 py-2.5 text-[14.5px] font-semibold text-pine transition-colors hover:border-pine hover:bg-tint"
              >
                <PhoneCall size={15} />
                ০১৭০০-০০০০০০
              </a>
            </div>
          </Reveal>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={cn(
                      "text-[17px] font-semibold leading-snug transition-colors sm:text-lg",
                      isOpen ? "text-pine" : "text-ink"
                    )}
                  >
                    {f.q}
                  </span>
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300",
                      isOpen
                        ? "rotate-45 border-pine bg-pine text-paper"
                        : "border-line bg-card text-mist"
                    )}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 text-[14.5px] leading-[1.85] text-mist">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
