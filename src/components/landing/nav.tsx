"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Building2,
  Car,
  CircleHelp,
  EllipsisVertical,
  Globe,
  HardHat,
  HeartHandshake,
  Menu,
  Route,
  SquarePen,
  UserPlus,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

export function Nav() {
  const pathname = usePathname();
  const { locale, t, setLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dotsOpen, setDotsOpen] = useState(false);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dotsRef.current && !dotsRef.current.contains(e.target as Node)) {
        setDotsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDotsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
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
            "mt-3 flex items-center justify-between gap-2 rounded-2xl border px-3.5 transition-all duration-500 sm:px-5",
            scrolled || pathname !== "/"
              ? "glass shadow-card border-line py-2.5"
              : "border-transparent bg-paper/75 py-3.5 backdrop-blur-sm"
          )}
        >
          {/* Brand */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-pine text-paper shadow-[0_6px_20px_rgba(12,91,78,0.35)]">
              <HardHat size={18} strokeWidth={2.2} />
            </span>
            <span className="leading-none">
              <span className="font-latin text-[18px] font-bold tracking-[-0.02em] text-ink sm:text-[19px]">
                Work<span className="text-pine">Culvert</span>
              </span>
              <span className="mt-0.5 block text-[10px] font-medium text-faint">
                {t.meta.brandLocation}
              </span>
            </span>
          </Link>

          {/* 4 Main Category Navigation Tabs (Desktop) */}
          <ul className="hidden items-center gap-1 lg:flex">
            {topTabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14.5px] font-semibold transition-colors xl:px-4",
                      active
                        ? "bg-pine text-paper shadow-sm"
                        : "text-mist hover:bg-pine/[0.08] hover:text-pine"
                    )}
                  >
                    <tab.icon size={15} />
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Controls: Language Toggle + Post CTA + 3-Dot Menu + Mobile Drawer */}
          <div className="flex items-center gap-1.5 sm:gap-2">
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

            {/* Post Work Primary CTA (Desktop) */}
            <Link
              href="/work/any-work#post-form"
              className="group hidden items-center gap-1.5 rounded-full bg-ochre px-4 py-2 text-[14px] font-semibold text-ink shadow-[0_8px_24px_rgba(245,158,11,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-white md:inline-flex"
            >
              <SquarePen
                size={15}
                className="transition-transform duration-300 group-hover:-rotate-6"
              />
              {t.nav.postWorkBtn}
            </Link>

            {/* 3-Dot Menu (Visible on both Desktop & Mobile) */}
            <div ref={dotsRef} className="relative">
              <button
                type="button"
                onClick={() => setDotsOpen((prev) => !prev)}
                aria-expanded={dotsOpen}
                aria-haspopup="menu"
                aria-label={t.nav.moreMenuAria}
                className={cn(
                  "grid size-10 place-items-center rounded-xl border transition-colors",
                  dotsOpen
                    ? "border-pine bg-pine text-paper"
                    : "border-line bg-card text-ink hover:border-pine/40 hover:text-pine"
                )}
              >
                <EllipsisVertical size={18} />
              </button>

              <AnimatePresence>
                {dotsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    role="menu"
                    className="shadow-lift absolute right-0 top-12 z-[75] w-72 rounded-2xl border border-line bg-card p-2 sm:w-80"
                  >
                    {menuLinks.map((item) => {
                      const active = pathname === item.href.split("#")[0];
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setDotsOpen(false)}
                          className={cn(
                            "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                            active
                              ? "bg-tint text-pine"
                              : "hover:bg-paper text-ink"
                          )}
                        >
                          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-tint text-pine">
                            <item.icon size={16} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14px] font-semibold leading-tight">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-[11.5px] leading-snug text-mist">
                              {item.desc}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger for Main Category Tabs */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid size-10 place-items-center rounded-xl border border-line bg-card text-ink lg:hidden"
              aria-label={t.nav.mobileMenuAria}
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>

        {/* Compact Mobile Horizontal Tab Strip so tabs are 1-tap on phones too */}
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
                <tab.icon size={13} className={active ? "text-mint" : "text-pine"} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-pine-deep text-paper lg:hidden"
          >
            <div className="dots-bg-light absolute inset-0 opacity-40" />
            <div className="relative flex items-center justify-between px-5 py-5">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-mint text-pine-deep">
                  <HardHat size={18} strokeWidth={2.2} />
                </span>
                <span className="font-latin text-lg font-bold">
                  Work<span className="text-mint">Culvert</span>
                </span>
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
                  onClick={() => setMobileOpen(false)}
                  className="grid size-10 place-items-center rounded-xl border border-white/15 text-paper"
                  aria-label={t.nav.closeMenuAria}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="relative flex-1 space-y-6 px-6 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mint/80">
                  {locale === "en" ? "Work Categories" : "কাজের বিভাগসমূহ"}
                </p>
                <ul className="mt-2 divide-y divide-white/10">
                  {topTabs.map((tab) => (
                    <li key={tab.href}>
                      <Link
                        href={tab.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3.5 py-3.5 text-lg font-semibold text-paper"
                      >
                        <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-mint">
                          <tab.icon size={17} />
                        </span>
                        {tab.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mint/80">
                  {locale === "en" ? "Menu & Info" : "মেনু ও তথ্য"}
                </p>
                <ul className="mt-2 divide-y divide-white/10">
                  {menuLinks.map((m) => (
                    <li key={m.href}>
                      <Link
                        href={m.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3.5 py-3 text-base font-medium text-paper/90"
                      >
                        <span className="grid size-8 place-items-center rounded-lg bg-white/10 text-ochre">
                          <m.icon size={15} />
                        </span>
                        <span>
                          <span className="block font-semibold text-paper">{m.label}</span>
                          <span className="block text-xs text-paper/60">{m.desc}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative flex flex-col gap-3 px-6 pb-8 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-3.5 text-base font-semibold text-paper"
              >
                {t.nav.menuItemsShort.joinWorker}
              </Link>
              <Link
                href="/work/any-work#post-form"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ochre py-3.5 text-base font-semibold text-ink"
              >
                <SquarePen size={17} /> {t.nav.menuItemsShort.postWork}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
