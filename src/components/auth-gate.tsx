"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useAuthUser } from "@/lib/use-auth";

/**
 * ড্যাশবোর্ড সুরক্ষা:
 * - Firebase কনফিগ থাকলে → লগইন বাধ্যতামূলক (না থাকলে /login-এ পাঠায়)
 * - কনফিগ না থাকলে → ডেমো মোড: ব্যানারসহ অ্যাক্সেস দেয়
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (configured && !loading && !user) {
      router.replace("/login");
    }
  }, [configured, loading, user, router]);

  if (configured && (loading || !user)) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <div className="flex flex-col items-center gap-3 text-mist">
          <LoaderCircle size={28} className="animate-spin text-pine" />
          <p className="text-sm">লোড হচ্ছে…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!configured && (
        <div className="sticky top-0 z-[70] flex items-center justify-center gap-2 bg-ochre px-4 py-2 text-center text-[12.5px] font-semibold text-ink">
          <AlertTriangle size={13} />
          ডেমো মোড চলছে — Firebase env সেট করলে লগইন প্রোটেকশন চালু হবে
        </div>
      )}
      {children}
    </>
  );
}
