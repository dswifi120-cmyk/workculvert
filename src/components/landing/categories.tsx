"use client";

import Link from "next/link";
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
import { useLanguage } from "@/components/language-provider";

const CARD_META = [
  { icon: Zap, tint: "bg-ochre-soft text-ochre-deep" },
  { icon: Wrench, tint: "bg-rivertint text-river" },
  { icon: Sparkles, tint: "bg-tint text-pine" },
  { icon: HeartHandshake, tint: "bg-brick-soft text-brick" },
  { icon: Paintbrush, tint: "bg-tint text-pine" },
  { icon: Hammer, tint: "bg-ochre-soft text-ochre-deep" },
  { icon: Car, tint: "bg-rivertint text-river" },
  { icon: ShieldCheck, tint: "bg-tint text-pine" },
  { icon: AirVent, tint: "bg-rivertint text-river" },
];

export function Categories() {
  const { t } = useLanguage();
  const c = t.categories;

  return (
    <section id="services" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={c.eyebrow}
          title={
            <>
              {c.titlePrefix}{" "}
              <span className="font-serif text-pine">{c.titleHighlight}</span>{" "}
              {c.titleSuffix}
            </>
          }
          copy={c.copy}
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.cards.map((card, i) => {
            const meta = CARD_META[i] ?? CARD_META[0];
            const Icon = meta.icon;
            return (
              <Reveal key={card.name} delay={0.04 + (i % 3) * 0.07}>
                <Link
                  href={card.href}
                  className="shadow-card group flex h-full flex-col rounded-3xl border border-line bg-card p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-pine/30 hover:shadow-lift sm:p-6"
                >
                  <span
                    className={`grid size-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${meta.tint}`}
                  >
                    <Icon size={22} />
                  </span>
                  <p className="mt-4 text-[16px] font-semibold text-ink sm:text-[17px]">
                    {card.name}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-mist">
                    {card.desc}
                  </p>
                  <p className="mt-3 text-[12px] font-semibold text-pine">
                    {card.count}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
