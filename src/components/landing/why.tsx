"use client";

import Image from "next/image";
import { BadgeCheck, Headphones, Scale, Star, Zap } from "lucide-react";
import { Reveal, SectionHeading, Counter } from "@/components/motion-primitives";
import { useLanguage } from "@/components/language-provider";

const POINT_ICONS = [BadgeCheck, Zap, Scale, Headphones];

export function Why() {
  const { t } = useLanguage();
  const w = t.why;

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
            eyebrow={w.eyebrow}
            title={
              <>
                {w.titlePrefix}{" "}
                <span className="font-serif text-mint">{w.titleHighlight}</span>
                {w.titleSuffix}
              </>
            }
            copy={w.copy}
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {w.points.map((p, i) => {
              const Icon = POINT_ICONS[i] ?? BadgeCheck;
              return (
                <Reveal key={p.title} delay={0.08 + i * 0.07}>
                  <div className="h-full rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-mint/40">
                    <span className="grid size-11 place-items-center rounded-2xl bg-mint/15 text-mint">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-4 text-[17px] font-bold text-paper">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-[1.75] text-paper/60">
                      {p.copy}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap items-center gap-8 border-t border-white/10 pt-8">
              {w.metrics.map((m) => (
                <div key={m.label}>
                  <p className="text-3xl font-bold text-mint">
                    <Counter
                      to={m.to}
                      prefix={"prefix" in m && m.prefix ? m.prefix : ""}
                      suffix={m.suffix}
                    />
                  </p>
                  <p className="mt-1 text-[12.5px] text-paper/55">{m.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* visual */}
        <Reveal delay={0.15}>
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/15 shadow-2xl">
              <Image
                src="/images/craftsman.jpg"
                alt={w.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/85 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                <div>
                  <p className="flex items-center gap-1.5 text-[15px] font-semibold text-white">
                    {w.cardWorkerName}{" "}
                    <BadgeCheck size={15} className="text-mint" />
                  </p>
                  <p className="text-[12px] text-white/70">{w.cardWorkerRole}</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-ochre px-3 py-1.5 text-[13px] font-bold text-ink">
                  <Star size={12} fill="currentColor" /> {w.cardRating}
                </span>
              </div>
            </div>

            <div className="glass-dark absolute -right-2 top-8 animate-float rounded-2xl border border-white/15 p-3.5 shadow-2xl sm:-right-6 sm:p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-mint/20 text-mint">
                  <BadgeCheck size={18} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-paper">
                    {w.nidTitle}
                  </p>
                  <p className="text-[11px] text-paper/55">{w.nidSub}</p>
                </div>
              </div>
            </div>

            <div className="glass-dark absolute -left-2 bottom-24 animate-float-slow rounded-2xl border border-white/15 p-3.5 shadow-2xl sm:-left-6 sm:p-4">
              <p className="text-[11px] text-paper/60">{w.weeklyLabel}</p>
              <p className="text-[18px] font-bold text-mint">{w.weeklyAmount}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
