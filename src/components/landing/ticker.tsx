"use client";

import { useLanguage } from "@/components/language-provider";

export function Ticker() {
  const { t } = useLanguage();
  const items = t.ticker;

  return (
    <section className="border-y border-pine/15 bg-tint/60 py-4">
      <div className="mask-x overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-8 pr-8 hover:[animation-play-state:paused]">
          {[...items, ...items].map((item, i) => (
            <span
              key={`${item}-${i}`}
              aria-hidden={i >= items.length}
              className="flex items-center gap-8 whitespace-nowrap text-[15px] font-semibold text-pine/80"
            >
              {item}
              <span className="size-1.5 rounded-full bg-ochre" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
