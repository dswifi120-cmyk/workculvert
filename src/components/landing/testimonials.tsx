"use client";

import { Star } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion-primitives";
import { useLanguage } from "@/components/language-provider";

function QuoteCard({
  q,
  n,
  r,
  g,
}: {
  q: string;
  n: string;
  r: string;
  g: string;
}) {
  return (
    <figure className="shadow-card w-[300px] shrink-0 rounded-3xl border border-line bg-card p-6 sm:w-[380px]">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} className="fill-ochre text-ochre" />
        ))}
      </div>
      <blockquote className="mt-4 text-[14.5px] leading-[1.8] text-ink/85">
        &ldquo;{q}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className={`grid size-10 place-items-center rounded-full bg-gradient-to-br font-semibold text-paper ${g}`}
        >
          {n.trim().split(" ").pop()?.slice(0, 2)}
        </span>
        <div>
          <p className="text-[14px] font-semibold text-ink">{n}</p>
          <p className="text-[12px] text-faint">{r}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const { t } = useLanguage();
  const tm = t.testimonials;
  const rowA = tm.quotes.slice(0, 3);
  const rowB = tm.quotes.slice(3);

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={tm.eyebrow}
          title={
            <>
              {tm.titlePrefix}{" "}
              <span className="font-serif text-pine">{tm.titleHighlight}</span>
            </>
          }
          copy={tm.copy}
        />
      </div>

      <div className="mx-auto mt-4 max-w-3xl px-4 text-center sm:px-6">
        <p className="text-[11.5px] leading-relaxed text-faint">
          {tm.disclaimer}
        </p>
      </div>

      <Reveal delay={0.1} className="mt-14 space-y-5">
        <div className="mask-x overflow-hidden">
          <div className="flex w-max animate-marquee gap-5 pr-5 hover:[animation-play-state:paused]">
            {[...rowA, ...rowA].map((item, i) => (
              <QuoteCard key={`a-${i}`} {...item} />
            ))}
          </div>
        </div>
        <div className="mask-x overflow-hidden">
          <div className="flex w-max animate-marquee-rev gap-5 pr-5 hover:[animation-play-state:paused]">
            {[...rowB, ...rowB].map((item, i) => (
              <QuoteCard key={`b-${i}`} {...item} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
