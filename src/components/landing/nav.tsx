"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Building2,
  Car,
  CircleHelp,
  Download,
  Globe,
  HeartHandshake,
  Menu,
  PawPrint,
  Route,
  SquarePen,
  UserPlus,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";
import { useLanguage } from "@/components/language-provider";
import { usePwaInstall } from "@/components/pwa-provider";

export function Nav() {
  const pathname = usePathname();
  const { locale, t, setLocale } = useLanguage();
  const { isStandalone, triggerInstall } = usePwaInstall();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const topTabs = [
    {
      label: t.nav.anyWork,
      href: "/work/any-work",
      icon: Briefcase,
    },
    {
      label: t.nav.transportation,
      href: "/work/transportation",
      icon: Car,
    },
    {
      label: t.nav.skilled,
      href: "/work/skilled",
      icon: Wrench,
    },
    {
      label: t.nav.caregiver,
      href: "/work/caregiver",
      icon: HeartHandshake,
    },
    {
      label: t.nav.petCaretaker,
      href: "/work/pet-caretaker",
      icon: PawPrint,
      isNew: true,
    },
  ];

  const menuLinks = [
    {
      label: t.nav.menuItemsShort.howWeWork,
      desc: t.nav.menuDescriptions.howWeWork,
      href: "/how-we-work",
      icon: Route,
    },
    {
      label: t.nav.menuItemsShort.whoWeAre,
      desc: t.nav.menuDescriptions.whoWeAre,
      href: "/who-we-are",
      icon: Building2,
    },
    {
      label: t.nav.menuItemsShort.joinWorker,
      desc: t.nav.menuDescriptions.joinWorker,
      href: "/login",
      icon: UserPlus,
    },
    {
      label: t.nav.menuItemsShort.postWork,
      desc: t.nav.menuDescriptions.postWork,
      href: "/work/any-work#post-form",
      icon: SquarePen,
    },
    {
      label: t.nav.menuItemsShort.help,
      desc: t.nav.menuDescriptions.help,
      href: "/help",
      icon: CircleHelp,
    },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <nav
          className={cn(
            "mt-3 flex items-center justify-between gap-2 rounded-2xl border px-3.5 transition-all duration-500 sm:px-4",
            scrolled || pathname !== "/"
              ? "glass shadow-card border-line py-2.5"
              : "border-transparent bg-paper/85 py-3.5 backdrop-blur-sm"
          )}
        >
          {/* Corporate WC Brand Logo */}
          <Link href="/" className="shrink-0">
            <BrandLogo size="sm" subtitle={t.meta.brandLocation} />
          </Link>

          {/* 5 Main Category Navigation Tabs (Desktop) */}
          <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {topTabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13.5px] font-semibold transition-colors xl:px-3.5 xl:text-[14px]",
                      active
                        ? "bg-pine text-paper shadow-sm"
                        : "text-mist hover:bg-pine/[0.08] hover:text-pine"
                    )}
                  >
                    <tab.icon size={14} />
                    <span>{tab.label}</span>
                    {tab.isNew && !active && (
                      <span className="rounded-full bg-ochre-soft px-1.5 py-0.5 text-[9.5px] font-bold uppercase leading-none text-ochre-deep">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Controls: Install App + Language Toggle + Post CTA + Single Unified Menu Button (No duplicate 3-dot) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {!isStandalone && (
              <button
                type="button"
                onClick={() => void triggerInstall()}
                className="hidden items-center gap-1.5 rounded-full border border-pine/25 bg-tint/75 px-3 py-1.5 text-[12.5px] font-bold text-pine transition-colors hover:border-pine hover:bg-pine hover:text-paper xl:inline-flex"
              >
                <Download size={13} />
                {t.nav.installAppBtn}
              </button>
            )}

            {/* BN / EN Language Switcher */}
            <div
              className="inline-flex items-center rounded-full border border-line bg-card p-0.5 text-[12px] font-bold"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLocale("bn")}
                className={cn(
                  "rounded-full px-2.5 py-1 transition-colors",
                  locale === "bn"
                    ? "bg-pine text-paper"
                    : "text-mist hover:text-ink"
                )}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={cn(
                  "rounded-full px-2.5 py-1 font-latin transition-colors",
                  locale === "en"
                    ? "bg-pine text-paper"
                    : "text-mist hover:text-ink"
                )}
              >
                EN
              </button>
            </div>

            {/* Post Work Primary CTA */}
            <Link
              href="/work/any-work#post-form"
              className="group hidden items-center gap-1.5 rounded-full bg-ochre px-3.5 py-2 text-[13.5px] font-semibold text-ink shadow-[0_8px_24px_rgba(245,158,11,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-white md:inline-flex"
            >
              <SquarePen
                size={14}
                className="transition-transform duration-300 group-hover:-rotate-6"
              />
              {t.nav.postWorkBtn}
            </Link>

            {/* Single Clean Menu Button (Works on both Mobile & Desktop — replaces duplicate 3-dot) */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-card px-2.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-pine/40 hover:text-pine sm:px-3"
              aria-label={t.nav.mobileMenuAria}
            >
              <Menu size={18} />
              <span className="hidden sm:inline">
                {locale === "en" ? "Menu" : "মেনু"}
              </span>
            </button>
          </div>
        </nav>

        {/* Compact Mobile Horizontal Tab Strip */}
        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {topTabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold shadow-sm transition-colors",
                  active
                    ? "border-pine bg-pine text-paper"
                    : "border-line bg-card/90 text-ink backdrop-blur hover:border-pine/40"
                )}
              >
                <tab.icon
                  size={13}
                  className={active ? "text-mint" : "text-pine"}
                />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Unified Slide-Over Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[80] flex justify-end bg-ink/55 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-pine-deep text-paper shadow-2xl"
            >
              <div className="dots-bg-light absolute inset-0 opacity-40" />
              <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-5">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <BrandLogo
                    theme="dark"
                    size="sm"
                    subtitle={t.meta.brandLocation}
                  />
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-mint"
                  >
                    <Globe size={14} />
                    {locale === "bn" ? "EN" : "বাংলা"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="grid size-10 place-items-center rounded-xl border border-white/15 text-paper hover:bg-white/10"
                    aria-label={t.nav.closeMenuAria}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="relative flex-1 space-y-6 px-6 py-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mint/80">
                    {locale === "en" ? "Work Categories" : "কাজের বিভাগসমূহ"}
                  </p>
                  <ul className="mt-2 divide-y divide-white/10">
                    {topTabs.map((tab) => (
                      <li key={tab.href}>
                        <Link
                          href={tab.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3.5 py-3 text-[16px] font-semibold text-paper hover:text-mint"
                        >
                          <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-mint">
                            <tab.icon size={17} />
                          </span>
                          <span>{tab.label}</span>
                          {tab.isNew && (
                            <span className="rounded-full bg-ochre px-2 py-0.5 text-[10px] font-bold text-ink">
                              NEW
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mint/80">
                    {locale === "en" ? "Platform & Info" : "প্ল্যাটফর্ম মেনু ও তথ্য"}
                  </p>
                  <ul className="mt-2 divide-y divide-white/10">
                    {menuLinks.map((m) => (
                      <li key={m.href}>
                        <Link
                          href={m.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3.5 py-3 text-base font-medium text-paper/90 hover:text-mint"
                        >
                          <span className="grid size-8 place-items-center rounded-lg bg-white/10 text-ochre">
                            <m.icon size={15} />
                          </span>
                          <span>
                            <span className="block font-semibold text-paper">
                              {m.label}
                            </span>
                            <span className="block text-xs text-paper/60">
                              {m.desc}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="relative flex flex-col gap-2.5 border-t border-white/10 px-6 pb-7 pt-4">
                {!isStandalone && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      void triggerInstall();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-mint/40 bg-mint/15 py-3 text-sm font-semibold text-mint"
                  >
                    <Download size={16} />
                    {locale === "en"
                      ? "Install WorkCulvert App"
                      : "অ্যাপ হিসেবে ইনস্টল করুন"}
                  </button>
                )}
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center rounded-full border border-white/20 py-3 text-sm font-semibold text-paper hover:bg-white/10"
                  >
                    {t.nav.menuItemsShort.joinWorker}
                  </Link>
                  <Link
                    href="/work/any-work#post-form"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-ochre py-3 text-sm font-semibold text-ink hover:bg-ochre-deep hover:text-white"
                  >
                    <SquarePen size={15} /> {t.nav.postWorkBtn}
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
