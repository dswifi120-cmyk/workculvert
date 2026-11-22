"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhoneCall, Plus } from "lucide-react";
import { Reveal, Eyebrow } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

export function FAQ() {
  const { t } = useLanguage();
  const fq = t.faq;
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-line bg-linen/60 py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <Eyebrow>{fq.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[1.2] text-ink">
              {fq.titlePrefix}{" "}
              <span className="font-serif text-pine">{fq.titleHighlight}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 max-w-sm text-[15px] leading-[1.8] text-mist">
              {fq.copy}
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="shadow-card mt-8 rounded-3xl border border-line bg-card p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-tint text-pine">
                <PhoneCall size={20} />
              </span>
              <p className="mt-4 text-lg font-bold text-ink">{fq.moreQ}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist">
                {fq.moreCopy}
              </p>
              <a
                href="tel:+8801700000000"
                className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-pine/25 px-5 py-2.5 text-[14.5px] font-semibold text-pine transition-colors hover:border-pine hover:bg-tint"
              >
                <PhoneCall size={15} />
                {fq.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {fq.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
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
