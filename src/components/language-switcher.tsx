"use client";

import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-card p-0.5 text-[12px] font-bold",
        className
      )}
      role="group"
      aria-label="Language toggle"
    >
      <button
        type="button"
        onClick={() => setLocale("bn")}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "bn" ? "bg-pine text-paper" : "text-mist hover:text-ink"
        )}
      >
        বাংলা
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-full px-2.5 py-1 font-latin transition-colors",
          locale === "en" ? "bg-pine text-paper" : "text-mist hover:text-ink"
        )}
      >
        EN
      </button>
    </div>
  );
}
