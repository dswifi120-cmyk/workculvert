"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Download, Share, Smartphone, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type PwaContextValue = {
  isStandalone: boolean;
  canPromptInstall: boolean;
  triggerInstall: () => Promise<void>;
};

const PwaContext = createContext<PwaContextValue>({
  isStandalone: false,
  canPromptInstall: false,
  triggerInstall: async () => undefined,
});

export function usePwaInstall() {
  return useContext(PwaContext);
}

export function PwaProvider({ children }: { children: ReactNode }) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true
    );
  });
  const [guideOpen, setGuideOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [installedJustNow, setInstalledJustNow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    function onAppInstalled() {
      setDeferredPrompt(null);
      setInstalledJustNow(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
        setInstalledJustNow(true);
      }
      return;
    }
    setGuideOpen(true);
  }, [deferredPrompt]);

  const isIos =
    typeof navigator !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent);

  return (
    <PwaContext.Provider
      value={{
        isStandalone: isStandalone || installedJustNow,
        canPromptInstall: Boolean(deferredPrompt),
        triggerInstall,
      }}
    >
      {children}

      {/* Floating Bottom Install Pill on Mobile/Web when not yet installed */}
      {!isStandalone && !installedJustNow && !bannerDismissed && (
        <div className="fixed bottom-4 left-3 right-3 z-[65] mx-auto max-w-md sm:left-auto sm:right-5 sm:w-[370px]">
          <div className="shadow-lift flex items-center justify-between gap-3 rounded-2xl border border-pine/25 bg-pine-deep/95 px-4 py-3 text-paper backdrop-blur-md">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint text-pine-deep">
                <Smartphone size={19} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-bold text-paper">
                  {isEn ? "Install WorkCulvert App" : "WorkCulvert অ্যাপ ইনস্টল করুন"}
                </p>
                <p className="truncate text-[11.5px] text-paper/70">
                  {isEn
                    ? "Fast 1-tap booking right from your home screen"
                    : "ফোন বা পিসিতে অ্যাপ হিসেবে ১-ট্যাপে ব্যবহার করুন"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={triggerInstall}
                className="inline-flex items-center gap-1 rounded-full bg-ochre px-3.5 py-2 text-[12px] font-bold text-ink transition-colors hover:bg-ochre-deep hover:text-white"
              >
                <Download size={13} />
                {isEn ? "Install" : "ইনস্টল"}
              </button>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                aria-label="Dismiss install banner"
                className="grid size-7 place-items-center rounded-full text-paper/60 hover:bg-white/10 hover:text-paper"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Install Instructions Modal (when browser blocks direct prompt, e.g. iOS Safari or embedded preview iframe) */}
      {guideOpen && (
        <div
          onClick={() => setGuideOpen(false)}
          className="fixed inset-0 z-[95] grid place-items-center bg-ink/55 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="shadow-lift w-full max-w-md rounded-3xl border border-line bg-card p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-10 place-items-center rounded-2xl bg-tint text-pine">
                  <Smartphone size={20} />
                </span>
                <div>
                  <h4 className="text-lg font-bold text-ink">
                    {isEn
                      ? "Install WorkCulvert as an App"
                      : "অ্যাপ হিসেবে ইনস্টল করুন"}
                  </h4>
                  <p className="text-xs text-mist">
                    {isEn
                      ? "Works fullscreen on Android, iOS & Desktop"
                      : "Android, iPhone এবং কম্পিউটারে অ্যাপের মতো চলবে"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                className="grid size-8 place-items-center rounded-full border border-line text-mist hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-[13.5px] leading-relaxed text-mist">
              {isIos ? (
                <div className="rounded-2xl border border-line bg-paper/70 p-4">
                  <p className="flex items-center gap-2 font-bold text-ink">
                    <Share size={15} className="text-pine" />
                    {isEn ? "On iPhone / iPad (Safari):" : "iPhone / iPad (Safari ব্রাউজারে):"}
                  </p>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5">
                    <li>
                      {isEn
                        ? "Tap the Share button at the bottom of Safari."
                        : "নিচের Share (শেয়ার) আইকনে ট্যাপ করুন।"}
                    </li>
                    <li>
                      {isEn
                        ? 'Select "Add to Home Screen" and tap Add.'
                        : '"Add to Home Screen" সিলেক্ট করে Add চাপুন।'}
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="rounded-2xl border border-line bg-paper/70 p-4">
                  <p className="flex items-center gap-2 font-bold text-ink">
                    <CheckCircle2 size={15} className="text-pine" />
                    {isEn
                      ? "On Android Chrome / Desktop Browser:"
                      : "Android Chrome বা কম্পিউটার ব্রাউজারে:"}
                  </p>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5">
                    <li>
                      {isEn
                        ? "Open the site in its own browser tab (not inside an embedded preview frame)."
                        : "সাইটটি সরাসরি নতুন ব্রাউজার ট্যাবে খুলুন (প্রিভিউ ফ্রেমের বাইরে)।"}
                    </li>
                    <li>
                      {isEn
                        ? 'Click the Install icon in the address bar or browser menu (⋮) → "Install app / Add to Home screen".'
                        : 'ব্রাউজারের অ্যাড্রেস বারের Install আইকনে অথবা (⋮) মেনু থেকে "Install App / Add to Home screen"-এ ক্লিক করুন।'}
                    </li>
                  </ol>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setGuideOpen(false)}
              className="mt-5 w-full rounded-full bg-pine py-3 text-sm font-semibold text-paper hover:bg-pine-dark"
            >
              {isEn ? "Got it" : "বুঝেছি"}
            </button>
          </div>
        </div>
      )}
    </PwaContext.Provider>
  );
}
