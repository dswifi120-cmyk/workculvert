"use client";

import { Counter, Reveal } from "@/components/motion-primitives";
import { useLanguage } from "@/components/language-provider";

export function Stats() {
  const { t } = useLanguage();
  const stats = t.stats;

  return (
    <section id="results" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="shadow-card grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
          {stats.items.map((s, i) => (
            <div key={s.label} className="bg-card px-5 py-9 text-center sm:py-12">
              <Reveal delay={i * 0.08}>
                <p className="text-4xl font-bold tracking-tight text-pine sm:text-[44px]">
                  <Counter
                    to={s.value}
                    prefix={"prefix" in s && s.prefix ? s.prefix : ""}
                    suffix={s.suffix ?? ""}
                    decimals={"decimals" in s && s.decimals ? s.decimals : 0}
                  />
                </p>
                <p className="mt-2 text-[15px] font-semibold text-ink">{s.label}</p>
                <p className="mt-0.5 text-[12.5px] text-faint">{s.sub}</p>
              </Reveal>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-faint">
          {stats.disclaimer}
        </p>
      </div>
    </section>
  );
}
