"use client";

import { CircleUserRound, Megaphone, Handshake } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion-primitives";
import { localizeDigits } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

const STEP_ICONS = [CircleUserRound, Megaphone, Handshake];

export function How() {
  const { locale, t } = useLanguage();
  const h = t.how;

  return (
    <section
      id="how"
      className="scroll-mt-24 border-y border-line bg-linen/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={h.eyebrow}
          title={
            <>
              {h.titlePrefix}{" "}
              <span className="font-serif text-pine">{h.titleHighlight}</span>{" "}
              {h.titleSuffix}
            </>
          }
          copy={h.copy}
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
          {h.steps.map((s, i) => {
            const Icon = STEP_ICONS[i] ?? CircleUserRound;
            const num = localizeDigits(i + 1, locale);
            return (
              <Reveal key={s.title} delay={0.08 + i * 0.1}>
                <div className="shadow-card group relative h-full overflow-hidden rounded-3xl border border-line bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-pine/30">
                  <span className="pointer-events-none absolute -right-3 -top-7 select-none font-serif text-[130px] italic leading-none text-pine/[0.06] transition-colors duration-500 group-hover:text-pine/10">
                    {num}
                  </span>
                  <span className="relative grid size-12 place-items-center rounded-2xl bg-pine text-paper shadow-[0_10px_24px_-8px_rgba(12,91,78,0.5)]">
                    <Icon size={21} />
                  </span>
                  <h3 className="relative mt-6 text-xl font-bold text-ink">
                    {s.title}
                  </h3>
                  <p className="relative mt-2.5 text-[14.5px] leading-[1.8] text-mist">
                    {s.copy}
                  </p>
                  <p className="relative mt-5 text-[13px] font-semibold text-ochre-deep">
                    {h.stepLabel} {num}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
