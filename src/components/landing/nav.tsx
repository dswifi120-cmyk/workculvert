"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  BadgeCheck,
  Briefcase,
  CircleHelp,
  HardHat,
  LayoutGrid,
  Menu,
  Route,
  SquarePen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "সার্ভিসসমূহ", href: "#services", icon: LayoutGrid },
  { label: "কেন আমরা", href: "#why", icon: BadgeCheck },
  { label: "কিভাবে কাজ করে", href: "#how", icon: Route },
  { label: "সাম্প্রতিক কাজ", href: "#jobs", icon: Briefcase },
  { label: "প্রশ্নোত্তর", href: "#faq", icon: CircleHelp },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={cn(
            "mt-3 flex items-center justify-between rounded-2xl border px-4 transition-all duration-500 sm:px-5",
            scrolled
              ? "glass shadow-card border-line py-2.5"
              : "border-transparent bg-transparent py-4"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-pine text-paper shadow-[0_6px_20px_rgba(12,91,78,0.35)]">
              <HardHat size={18} strokeWidth={2.2} />
            </span>
            <span className="leading-none">
              <span className="font-latin text-[19px] font-bold tracking-[-0.02em] text-ink">
                Work<span className="text-pine">Culvert</span>
              </span>
              <span className="mt-0.5 block text-[10px] font-medium text-faint">
                বগুড়া · বাংলাদেশ
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="rounded-full px-4 py-2 text-[15px] font-medium text-mist transition-colors hover:bg-pine/[0.07] hover:text-pine"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2.5 lg:flex">
            <Link
              href="/login"
              className="rounded-full px-4 py-2.5 text-[15px] font-medium text-mist transition-colors hover:text-pine"
            >
              কর্মী লগইন
            </Link>
            <Link
              href="/#post-job"
              className="group inline-flex items-center gap-1.5 rounded-full bg-ochre px-5 py-2.5 text-[15px] font-semibold text-ink shadow-[0_8px_24px_rgba(245,158,11,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-white"
            >
              <SquarePen size={16} className="transition-transform duration-300 group-hover:-rotate-6" />
              কাজ পোস্ট করুন
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="grid size-10 place-items-center rounded-xl border border-line bg-card text-ink lg:hidden"
            aria-label="মেনু খুলুন"
          >
            <Menu size={18} />
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex flex-col bg-pine-deep text-paper lg:hidden"
          >
            <div className="dots-bg-light absolute inset-0 opacity-40" />
            <div className="relative flex items-center justify-between px-5 py-5">
              <span className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-mint text-pine-deep">
                  <HardHat size={18} strokeWidth={2.2} />
                </span>
                <span className="font-latin text-lg font-bold">
                  Work<span className="text-mint">Culvert</span>
                </span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-xl border border-white/15 text-paper"
                aria-label="মেনু বন্ধ করুন"
              >
                <X size={18} />
              </button>
            </div>
            <ul className="relative flex flex-1 flex-col justify-center gap-1 px-7">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, x: -22 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.07 + i * 0.05, duration: 0.45 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 border-b border-white/[0.07] py-4 text-2xl font-semibold text-paper"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-white/[0.07] text-mint">
                      <l.icon size={18} />
                    </span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="relative flex flex-col gap-3 px-7 pb-10">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-4 text-base font-semibold text-paper"
              >
                কর্মী লগইন
              </Link>
              <Link
                href="/#post-job"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ochre py-4 text-base font-semibold text-ink"
              >
                <SquarePen size={17} /> কাজ পোস্ট করুন
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
