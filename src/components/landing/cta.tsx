"use client";

import { Reveal } from "@/components/motion-primitives";
import { EmailCapture } from "@/components/landing/email-capture";
import { useLanguage } from "@/components/language-provider";

export function CTA() {
  const { t } = useLanguage();
  const c = t.cta;

  return (
    <section className="relative overflow-hidden bg-pine-deep py-24 text-paper sm:py-36">
      <div className="dots-bg-light absolute inset-0 opacity-40" />
      <div className="absolute -bottom-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-mint/15 blur-[120px]" />
      <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-ochre/15 blur-[110px]" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="font-serif text-xl italic text-paper/60 sm:text-2xl">
            {c.preTitle}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 text-[clamp(2.1rem,6vw,4.2rem)] font-bold leading-[1.25] tracking-[-0.01em] text-paper">
            {c.line1Prefix}{" "}
            <span className="font-serif text-mint">{c.line1Highlight}</span>{" "}
            {c.line1Suffix}
            <br />
            {c.line2}
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.85] text-paper/65 sm:text-base">
            {c.copy}
          </p>
        </Reveal>
        <Reveal delay={0.26}>
          <EmailCapture />
          <p className="mt-5 text-[12.5px] text-paper/45">{c.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
