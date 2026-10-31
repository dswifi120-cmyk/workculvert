"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export type AuthState = {
  user: User | null;
  loading: boolean;
  configured: boolean;
};

/**
 * Firebase auth state hook.
 * Firebase কনফিগ না থাকলে configured=false (ডেমো মোড) রিটার্স করে।
 */
export function useAuthUser(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading, configured: isFirebaseConfigured };
}

/** ডেমো মোডে আবেদনের জন্য ব্যবহৃত অতিথি পরিচয়। */
export const GUEST_IDENTITY = {
  uid: "demo-guest",
  name: "গেস্ট কর্মী",
  email: "guest@workculvert.com",
};
