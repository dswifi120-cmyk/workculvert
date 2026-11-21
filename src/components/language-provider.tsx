"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/categories";
import { getDictionary, type Dictionary } from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  initialLocale = "bn",
  children,
}: {
  initialLocale?: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      document.documentElement.lang = next;
      router.refresh();
    },
    [router]
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === "bn" ? "en" : "bn");
  }, [locale, setLocale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      t: getDictionary(locale),
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      locale: "bn",
      t: getDictionary("bn"),
      setLocale: () => undefined,
      toggleLocale: () => undefined,
    };
  }
  return ctx;
}
