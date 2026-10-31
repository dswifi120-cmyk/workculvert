export type Kpi = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta: string;
  up: boolean;
  spark: number[];
};

export const KPIS: Kpi[] = [
  {
    label: "এই মাসের আয়",
    value: 84500,
    prefix: "৳",
    delta: "+১৮.২%",
    up: true,
    spark: [32, 40, 38, 48, 52, 47, 58, 63, 60, 72, 78, 84],
  },
  {
    label: "সম্পন্ন কাজ",
    value: 124,
    delta: "+১২%",
    up: true,
    spark: [8, 12, 10, 15, 14, 18, 17, 21, 20, 24, 26, 29],
  },
  {
    label: "গড় রেটিং",
    value: 4.9,
    suffix: "/৫",
    decimals: 1,
    delta: "+০.২",
    up: true,
    spark: [44, 45, 46, 45, 47, 47, 48, 48, 49, 49, 49, 49],
  },
  {
    label: "ভিউ হার",
    value: 62,
    suffix: "%",
    delta: "−৩%",
    up: false,
    spark: [74, 72, 73, 70, 71, 68, 69, 66, 67, 64, 63, 62],
  },
];

export const EARNINGS = [
  { m: "জানু", cur: 42, prev: 30 },
  { m: "ফেব্রু", cur: 48, prev: 34 },
  { m: "মার্চ", cur: 45, prev: 36 },
  { m: "এপ্রি", cur: 56, prev: 38 },
  { m: "মে", cur: 61, prev: 41 },
  { m: "জুন", cur: 58, prev: 44 },
  { m: "জুলা", cur: 68, prev: 46 },
  { m: "আগ", cur: 74, prev: 50 },
  { m: "সেপ্টে", cur: 71, prev: 52 },
  { m: "অক্টো", cur: 78, prev: 55 },
  { m: "নভে", cur: 81, prev: 57 },
  { m: "ডিসে", cur: 84, prev: 60 },
];

export const APPLICATION_STATUS = [
  { name: "গৃহীত", value: 55, color: "#0c5b4e" },
  { name: "বিবেচনাধীন", value: 28, color: "#f59e0b" },
  { name: "বাতিল", value: 17, color: "#e5dfcd" },
];

export const DEMAND = [
  { name: "ইলেকট্রিশিয়ান", jobs: 312, share: 92 },
  { name: "প্লাম্বার", jobs: 268, share: 79 },
  { name: "ক্লিনার", jobs: 234, share: 69 },
  { name: "কেয়ারগিভার", jobs: 167, share: 49 },
  { name: "কারপেন্টার", jobs: 128, share: 38 },
];
