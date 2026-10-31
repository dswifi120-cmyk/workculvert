"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "firebase/auth";
import {
  BadgeCheck,
  Bell,
  Briefcase,
  ChevronDown,
  CircleUserRound,
  Gauge,
  HardHat,
  LogOut,
  MessageSquare,
  Menu,
  Search,
  Send,
  Settings,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuthUser } from "@/lib/use-auth";
import { cn } from "@/lib/utils";

function useIdentity() {
  const { user, configured, loading } = useAuthUser();
  const isReal = Boolean(configured && user);
  const name = isReal
    ? user?.displayName || user?.email?.split("@")[0] || "ব্যবহারকারী"
    : "রহিম উদ্দিন";
  const sub = isReal ? user?.email ?? "" : "ইলেকট্রিশিয়ান · প্রো";
  const initials = /^[A-Za-z]/.test(name)
    ? name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : name.trim().slice(0, 2);
  return { name, sub, initials, isReal, loading };
}

const NAV = [
  {
    section: "মূল মেনু",
    items: [
      { icon: Gauge, label: "ওভারভিউ", active: true },
      { icon: Briefcase, label: "নতুন কাজ", badge: "৬" },
      { icon: Send, label: "আমার আবেদন" },
      { icon: MessageSquare, label: "বার্তা", badge: "২" },
    ],
  },
  {
    section: "অ্যাকাউন্ট",
    items: [
      { icon: Wallet, label: "আয় ও পেমেন্ট" },
      { icon: TrendingUp, label: "পারফরম্যান্স" },
      { icon: CircleUserRound, label: "প্রোফাইল" },
      { icon: Settings, label: "সেটিংস" },
    ],
  },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const identity = useIdentity();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-5 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-pine text-paper">
            <HardHat size={16} strokeWidth={2.2} />
          </span>
          <span className="font-latin text-[17px] font-bold tracking-[-0.02em] text-ink">
            Work<span className="text-pine">Culvert</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg border border-line text-mist lg:hidden"
            aria-label="মেনু বন্ধ করুন"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-faint">
              {group.section}
            </p>
            <ul className="mt-2.5 space-y-1">
              {group.items.map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] transition-colors",
                      item.active
                        ? "bg-tint font-semibold text-pine"
                        : "text-mist hover:bg-pine/[0.05] hover:text-ink"
                    )}
                  >
                    <item.icon
                      size={17}
                      className={cn(
                        item.active
                          ? "text-pine"
                          : "text-faint transition-colors group-hover:text-pine"
                      )}
                    />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-ochre px-2 py-0.5 text-[10.5px] font-bold text-ink">
                        {item.badge}
                      </span>
                    )}
                    {item.active && !item.badge && (
                      <span className="ml-auto size-1.5 rounded-full bg-pine" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-4">
        <div className="rounded-2xl border border-pine/20 bg-tint p-4">
          <p className="flex items-center gap-1.5 text-[13px] font-bold text-pine">
            <BadgeCheck size={15} /> প্ল্যাটিনাম ব্যাজ
          </p>
          <p className="mt-1.5 text-[12px] leading-snug text-mist">
            আর ৩টি ৫★ কাজ সম্পন্ন করে প্ল্যাটিনাম খ্যাতি অর্জন করুন।
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full w-[86%] rounded-full bg-pine" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-pine to-river text-[12px] font-bold text-paper">
            {identity.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold text-ink">
              {identity.name}
            </p>
            <p className="truncate text-[11px] text-faint">{identity.sub}</p>
          </div>
          <ChevronDown size={15} className="text-faint" />
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const identity = useIdentity();
  const router = useRouter();

  async function handleSignOut() {
    setMenuOpen(false);
    if (identity.isReal) {
      await signOut(getFirebaseAuth()).catch(() => undefined);
    }
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[264px] border-r border-line bg-card lg:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[55] bg-ink/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -290 }}
              animate={{ x: 0 }}
              exit={{ x: -290 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-[60] w-[284px] border-r border-line bg-card lg:hidden"
            >
              <Sidebar onClose={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-[264px]">
        <header className="glass sticky top-0 z-40 border-b border-line">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
            <button
              onClick={() => setOpen(true)}
              className="grid size-9 place-items-center rounded-lg border border-line bg-card text-ink lg:hidden"
              aria-label="মেনু খুলুন"
            >
              <Menu size={16} />
            </button>
            <div className="relative w-full max-w-md">
              <Search
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
              />
              <input
                placeholder="কাজ, এলাকা বা নিয়োগদাতা খুঁজুন…"
                className="w-full rounded-full border border-line bg-card py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-pine"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-line bg-paper px-1.5 py-0.5 text-[10px] text-faint sm:block">
                ⌘K
              </kbd>
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <button
                className="relative grid size-9 place-items-center rounded-full border border-line bg-card text-mist transition-colors hover:text-pine"
                aria-label="নোটিফিকেশন"
              >
                <Bell size={16} />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-ochre" />
              </button>
              <span className="h-6 w-px bg-line" />
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-full border border-line bg-card py-1.5 pl-1.5 pr-3 transition-colors hover:border-pine/40"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-pine to-river text-[10px] font-bold text-paper">
                    {identity.initials}
                  </span>
                  <span className="hidden max-w-[120px] truncate text-sm font-medium text-ink sm:block">
                    {identity.name}
                  </span>
                  <ChevronDown size={14} className="text-faint" />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="shadow-lift absolute right-0 top-12 z-50 w-60 rounded-2xl border border-line bg-card p-2"
                      role="menu"
                    >
                      <div className="px-3 py-2.5">
                        <p className="truncate text-sm font-semibold text-ink">
                          {identity.name}
                        </p>
                        <p className="truncate text-xs text-faint">
                          {identity.sub || "গেস্ট মোড"}
                        </p>
                      </div>
                      <div className="h-px bg-line" />
                      <button
                        onClick={handleSignOut}
                        className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-brick transition-colors hover:bg-brick-soft"
                        role="menuitem"
                      >
                        <LogOut size={15} />
                        {identity.isReal ? "সাইন আউট" : "ডেমো থেকে বের হোন"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-7 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
