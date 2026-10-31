import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert latin digits of any number/string to Bengali digits. */
export function bn(value: number | string): string {
  return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** Format a number with thousand separators, optionally in Bengali digits. */
export function formatNumber(n: number, decimals = 0, bengali = true) {
  const s = n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return bengali ? bn(s) : s;
}

/** Human friendly Bengali relative time, e.g. "৩ ঘণ্টা আগে". */
export function timeAgoBn(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "এইমাত্র";
  if (mins < 60) return `${bn(mins)} মিনিট আগে`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${bn(hours)} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "গতকাল";
  if (days < 7) return `${bn(days)} দিন আগে`;
  const weeks = Math.floor(days / 7);
  return `${bn(weeks)} সপ্তাহ আগে`;
}
