"use client";

import Link from "next/link";
import { HardHat, Mail, MapPin, PhoneCall } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer className="relative overflow-hidden border-t border-line bg-paper">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-pine text-paper">
                <HardHat size={18} strokeWidth={2.2} />
              </span>
              <span className="font-latin text-lg font-bold tracking-[-0.02em] text-ink">
                Work<span className="text-pine">Culvert</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-[14px] leading-[1.8] text-mist">
              {f.tagline}
            </p>
            <ul className="mt-6 space-y-2.5 text-[13.5px] text-mist">
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="text-pine" /> {f.address}
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall size={15} className="text-pine" /> {f.phone}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-pine" /> hello@workculvert.com
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {f.cols.map((col) => (
              <div key={col.title}>
                <p className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-pine">
                  {col.title}
                </p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[14px] text-mist transition-colors hover:text-pine"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* giant wordmark */}
        <div className="mask-b-fade pointer-events-none mt-14 select-none overflow-hidden">
          <p
            className="text-center font-latin text-[13.5vw] font-bold leading-[0.85] tracking-[-0.02em] lg:text-[11rem]"
            style={{
              WebkitTextStroke: "1.5px rgba(12,91,78,0.18)",
              color: "transparent",
            }}
          >
            WorkCulvert
          </p>
        </div>

        <div className="border-t border-line py-7 text-[12.5px] text-faint">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p>{f.copyright}</p>
            <p>
              {f.madeIn}{" "}
              <span className="text-pine">{f.madeInHighlight}</span>
            </p>
          </div>
          <p className="mt-3 text-center text-[11.5px] leading-relaxed text-faint sm:text-left">
            {f.legalDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
