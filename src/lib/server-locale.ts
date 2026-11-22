import { cookies } from "next/headers";
import { LOCALE_COOKIE, type Locale } from "@/lib/categories";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  return raw === "en" ? "en" : "bn";
}
