"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileCheck2,
  HardHat,
  Mail,
  MapPin,
  PhoneCall,
  Route,
  ShieldAlert,
  ShieldCheck,
  SquarePen,
  UserPlus,
} from "lucide-react";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { FAQ } from "@/components/landing/faq";
import { Eyebrow, Reveal } from "@/components/motion-primitives";
import { useLanguage } from "@/components/language-provider";

export function HowWeWorkContent() {
  const { t } = useLanguage();
  const hw = t.pages.howWeWork;
  const wp = t.pages.workPage;

  return (
    <main className="min-h-screen bg-paper">
      <Nav />

      <section className="relative overflow-hidden border-b border-line bg-linen/50 pb-14 pt-36 sm:pt-40">
        <div className="dots-bg absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-mist transition-colors hover:text-pine"
          >
            <ArrowLeft size={15} /> {wp.backHome}
          </Link>
          <div className="mt-5">
            <Eyebrow>
              <Route size={13} className="text-pine" /> {hw.eyebrow}
            </Eyebrow>
            <h1 className="mt-4 text-[clamp(2rem,4.8vw,3.3rem)] font-bold leading-[1.18] text-ink">
              {hw.title}
            </h1>
            <p className="mt-3 max-w-2xl text-[16px] leading-[1.8] text-mist">
              {hw.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-14 px-4 sm:px-6">
          <div>
            <h2 className="text-2xl font-bold text-ink">{hw.employerTitle}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {hw.employerSteps.map((s, idx) => (
                <Reveal key={s.step} delay={idx * 0.08}>
                  <div className="shadow-card h-full rounded-3xl border border-line bg-card p-6">
                    <span className="inline-flex rounded-xl bg-ochre-soft px-3 py-1 font-latin text-sm font-bold text-ochre-deep">
                      {s.step}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-mist">
                      {s.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink">{hw.workerTitle}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {hw.workerSteps.map((s, idx) => (
                <Reveal key={s.step} delay={idx * 0.08}>
                  <div className="shadow-card h-full rounded-3xl border border-line bg-card p-6">
                    <span className="inline-flex rounded-xl bg-tint px-3 py-1 font-latin text-sm font-bold text-pine">
                      {s.step}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-mist">
                      {s.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 rounded-3xl border border-line bg-pine-deep p-8 text-center text-paper">
            <Link
              href="/work/any-work#post-form"
              className="inline-flex items-center gap-2 rounded-full bg-ochre px-6 py-3.5 text-[15px] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-white"
            >
              <SquarePen size={16} />
              {hw.postCta}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-white/10"
            >
              <UserPlus size={16} />
              {hw.joinCta}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export function WhoWeAreContent() {
  const { locale, t } = useLanguage();
  const isEn = locale === "en";
  const ww = t.pages.whoWeAre;
  const wp = t.pages.workPage;

  return (
    <main className="min-h-screen bg-paper">
      <Nav />

      <section className="relative overflow-hidden border-b border-line bg-linen/50 pb-14 pt-36 sm:pt-40">
        <div className="dots-bg absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-mist transition-colors hover:text-pine"
          >
            <ArrowLeft size={15} /> {wp.backHome}
          </Link>
          <div className="mt-5">
            <Eyebrow>
              <HardHat size={13} className="text-pine" /> {ww.eyebrow}
            </Eyebrow>
            <h1 className="mt-4 text-[clamp(2rem,4.8vw,3.3rem)] font-bold leading-[1.18] text-ink">
              {ww.title}
            </h1>
            <p className="mt-3 max-w-2xl text-[16px] leading-[1.8] text-mist">
              {ww.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6">
          {/* About */}
          <div className="shadow-card rounded-3xl border border-line bg-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-ink">{ww.aboutTitle}</h2>
            <p className="mt-3 text-[15.5px] leading-[1.85] text-mist">
              {ww.aboutBody}
            </p>

            {/* Official WC Brand Kit for Banners, Festoons & Trade Dress */}
            <div className="mt-6 rounded-2xl border border-line bg-paper/75 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-pine">
                    {isEn
                      ? "Official WC Corporate Trademark & Print Kit"
                      : "অফিশিয়াল WC কর্পোরেট লোগো ও ব্যানার/ফেস্টুন কিট"}
                  </p>
                  <p className="mt-1 text-[13.5px] text-mist">
                    {isEn
                      ? "Ready-to-print vector SVG & high-res PNG assets for company banners, festoons, ID cards, and trademark filing."
                      : "কোম্পানির ব্যানার, ফেস্টুন, আইডি কার্ড এবং ট্রেডমার্ক রেজিস্ট্রেশনে ব্যবহারের জন্য ভেক্টর SVG ও হাই-রেজোলিউশন PNG লোগো।"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/brand/wc-logo-mark.svg"
                    download="WC-Emblem-Mark.svg"
                    className="inline-flex items-center gap-1.5 rounded-full border border-pine/30 bg-card px-3.5 py-2 text-xs font-bold text-pine hover:bg-tint"
                  >
                    <Download size={13} /> WC Icon (SVG)
                  </a>
                  <a
                    href="/brand/wc-logo-banner.svg"
                    download="WorkCulvert-Banner-Logo.svg"
                    className="inline-flex items-center gap-1.5 rounded-full bg-pine px-4 py-2 text-xs font-bold text-paper hover:bg-pine-dark"
                  >
                    <Download size={13} />{" "}
                    {isEn ? "Banner Lockup (SVG)" : "ব্যানার লোগো (SVG)"}
                  </a>
                  <a
                    href="/brand/wc-logo-banner.png"
                    download="WorkCulvert-Banner-2400px.png"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-2 text-xs font-bold text-ink hover:border-pine"
                  >
                    <Download size={13} /> HD PNG
                  </a>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white p-4">
                <Image
                  src="/brand/wc-logo-banner.png"
                  alt="WorkCulvert Official WC Banner Logo"
                  width={900}
                  height={270}
                  className="mx-auto h-auto max-h-28 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* License & Legal */}
          <div
            id="license"
            className="shadow-card scroll-mt-28 rounded-3xl border border-line bg-card p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-tint text-pine">
                <ShieldCheck size={21} />
              </span>
              <h2 className="text-2xl font-bold text-ink">{ww.licenseTitle}</h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {ww.licenseItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-line bg-paper/70 p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-pine">
                    {item.label}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contract & Terms */}
          <div
            id="contracts"
            className="shadow-card scroll-mt-28 rounded-3xl border border-line bg-card p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-ochre-soft text-ochre-deep">
                <FileCheck2 size={21} />
              </span>
              <h2 className="text-2xl font-bold text-ink">
                {ww.contractTitle}
              </h2>
            </div>

            <ul className="mt-6 space-y-3.5">
              {ww.contractPoints.map((pt) => (
                <li
                  key={pt}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-paper/50 p-4 text-[14.5px] leading-relaxed text-mist"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-pine"
                  />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export function HelpPageContent() {
  const { t } = useLanguage();
  const hp = t.pages.help;
  const wp = t.pages.workPage;

  const icons = [PhoneCall, Mail, MapPin];

  return (
    <main className="min-h-screen bg-paper">
      <Nav />

      <section className="relative overflow-hidden border-b border-line bg-linen/50 pb-14 pt-36 sm:pt-40">
        <div className="dots-bg absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-mist transition-colors hover:text-pine"
          >
            <ArrowLeft size={15} /> {wp.backHome}
          </Link>
          <div className="mt-5">
            <Eyebrow>{hp.eyebrow}</Eyebrow>
            <h1 className="mt-4 text-[clamp(2rem,4.8vw,3.3rem)] font-bold leading-[1.18] text-ink">
              {hp.title}
            </h1>
            <p className="mt-3 max-w-2xl text-[16px] leading-[1.8] text-mist">
              {hp.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {hp.cards.map((card, i) => {
              const Icon = icons[i] ?? PhoneCall;
              const isExternal =
                card.href.startsWith("tel:") || card.href.startsWith("mailto:");
              return (
                <div
                  key={card.title}
                  className="shadow-card flex flex-col justify-between rounded-3xl border border-line bg-card p-6"
                >
                  <div>
                    <span className="grid size-11 place-items-center rounded-2xl bg-tint text-pine">
                      <Icon size={20} />
                    </span>
                    <h2 className="mt-4 text-[16px] font-bold text-ink">
                      {card.title}
                    </h2>
                    <p className="mt-1 font-latin text-lg font-bold text-pine">
                      {card.value}
                    </p>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-mist">
                      {card.sub}
                    </p>
                  </div>
                  {isExternal ? (
                    <a
                      href={card.href}
                      className="mt-5 inline-flex items-center justify-center rounded-full border border-pine/30 px-4 py-2.5 text-[13.5px] font-semibold text-pine transition-colors hover:bg-pine hover:text-paper"
                    >
                      {card.actionLabel}
                    </a>
                  ) : (
                    <Link
                      href={card.href}
                      className="mt-5 inline-flex items-center justify-center rounded-full border border-pine/30 px-4 py-2.5 text-[13.5px] font-semibold text-pine transition-colors hover:bg-pine hover:text-paper"
                    >
                      {card.actionLabel}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div
            id="safety"
            className="shadow-card scroll-mt-28 rounded-3xl border border-line bg-card p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-ochre-soft text-ochre-deep">
                <ShieldAlert size={20} />
              </span>
              <h2 className="text-xl font-bold text-ink">{hp.safetyTitle}</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {hp.safetyPoints.map((pt) => (
                <li
                  key={pt}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-paper/60 p-4 text-[14px] leading-relaxed text-mist"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-pine"
                  />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FAQ />
      <Footer />
    </main>
  );
}
