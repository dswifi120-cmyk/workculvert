export type Locale = "bn" | "en";

export const LOCALE_COOKIE = "wc_lang";

export type CategoryTabSlug =
  | "any-work"
  | "transportation"
  | "skilled"
  | "caregiver";

export type CategoryOption = {
  /** Stored canonical value in PostgreSQL (compatible with existing BN categories + new ones) */
  value: string;
  tab: CategoryTabSlug;
  bn: string;
  en: string;
  descBn: string;
  descEn: string;
};

export const CATEGORY_TABS: {
  slug: CategoryTabSlug;
  href: string;
  bn: string;
  en: string;
  subtitleBn: string;
  subtitleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  defaultCategory: string;
}[] = [
  {
    slug: "any-work",
    href: "/work/any-work",
    bn: "যেকোনো কাজ",
    en: "Any Work",
    subtitleBn: "যেকোনো ধরনের কাজ পোস্ট ও যাচাইকৃত কর্মী সংযোগ",
    subtitleEn: "Post any type of work & connect with verified local workers",
    descriptionBn:
      "বাসা, দোকান, অফিস বা ব্যক্তিগত প্রয়োজনে যেকোনো বৈধ কাজ পোস্ট করুন। নির্দিষ্ট ক্যাটাগরি না মিললেও Any Work থেকে সহজে পোস্ট করতে পারবেন।",
    descriptionEn:
      "Post any legitimate task for your home, shop, office, or personal needs. Even if your task doesn't fit a fixed trade, submit it directly here.",
    defaultCategory: "যেকোনো কাজ (Any Work)",
  },
  {
    slug: "transportation",
    href: "/work/transportation",
    bn: "পরিবহন (Transportation)",
    en: "Transportation",
    subtitleBn: "Bike, CNG, Truck, Van ও ডেলিভারি/শিফটিং সার্ভিস",
    subtitleEn: "Bike, CNG, Truck, Van, Pickup & shifting transport",
    descriptionBn:
      "যাত্রী পরিবহন, মালামাল পরিবহন, বাসা বদল বা জরুরি ডেলিভারির জন্য Bike, CNG, Truck, Van বা ব্যক্তিগত ড্রাইভার পোস্ট করুন।",
    descriptionEn:
      "Book or post transport work for passenger rides, goods shifting, house moving, or urgent delivery with Bike, CNG, Truck, Van, or Driver.",
    defaultCategory: "Bike",
  },
  {
    slug: "skilled",
    href: "/work/skilled",
    bn: "দক্ষ কর্মী (Skilled)",
    en: "Skilled",
    subtitleBn: "Electrician, Plumber, Cleaner Team, AC, Carpenter ইত্যাদি",
    subtitleEn: "Electrician, Plumber, Cleaner Team, AC, Painter, Carpenter & more",
    descriptionBn:
      "বাসা বা প্রতিষ্ঠানের কারিগরি ও দক্ষ কাজের জন্য যাচাইকৃত Electrician, Plumber, Cleaner Team, AC Technician, Carpenter ও রংমিস্ত্রি খুঁজুন।",
    descriptionEn:
      "Hire verified skilled professionals including Electricians, Plumbers, Cleaner Teams, AC Technicians, Carpenters, and Painters.",
    defaultCategory: "ইলেকট্রিশিয়ান",
  },
  {
    slug: "caregiver",
    href: "/work/caregiver",
    bn: "কেয়ারগিভার (Caregiver)",
    en: "Caregiver",
    subtitleBn: "হাসপাতালে ও বাসায় রোগী/বয়স্কদের যত্ন ও সহায়তা",
    subtitleEn: "Hospital patient attendant, home patient care & elderly support",
    descriptionBn:
      "হাসপাতালে রোগীর দেখাশোনা, বাসায় রোগীর সেবা, বয়স্কদের দৈনন্দিন যত্ন কিংবা শিশু দেখাশোনার জন্য নির্ভরযোগ্য ও যাচাইকৃত কেয়ারগিভার।",
    descriptionEn:
      "Trusted caregivers for hospital patient attendance, home nursing/patient care, elderly companionship, and post-surgery recovery support.",
    defaultCategory: "হাসপাতালে রোগীর দেখাশোনা",
  },
];

export const CATEGORY_OPTIONS: CategoryOption[] = [
  // Transportation
  {
    value: "Bike",
    tab: "transportation",
    bn: "বাইক (Bike)",
    en: "Bike",
    descBn: "দ্রুত রাইড, পার্সেল বা জরুরি যাতায়াত",
    descEn: "Quick rides, parcel drop, or urgent errands",
  },
  {
    value: "CNG",
    tab: "transportation",
    bn: "সিএনজি (CNG)",
    en: "CNG",
    descBn: "শহর ও আশেপাশের এলাকায় রিজার্ভ যাতায়াত",
    descEn: "Reserved local & inter-area CNG trips",
  },
  {
    value: "Truck",
    tab: "transportation",
    bn: "ট্রাক / পিকআপ (Truck)",
    en: "Truck / Pickup",
    descBn: "বাসা বদল ও ভারী মালামাল পরিবহন",
    descEn: "House shifting & heavy goods transport",
  },
  {
    value: "Van",
    tab: "transportation",
    bn: "ভ্যান (Van)",
    en: "Van",
    descBn: "স্বল্প দূরত্বে মালপত্র ও আসবাব পরিবহন",
    descEn: "Short-distance cargo, furniture & market loads",
  },
  {
    value: "ড্রাইভার",
    tab: "transportation",
    bn: "ড্রাইভার (Driver)",
    en: "Private / Commercial Driver",
    descBn: "দৈনিক, সাপ্তাহিক বা মাসিক ভিত্তিতে অভিজ্ঞ চালক",
    descEn: "Experienced driver on daily, weekly, or monthly basis",
  },

  // Skilled
  {
    value: "ইলেকট্রিশিয়ান",
    tab: "skilled",
    bn: "ইলেকট্রিশিয়ান (Electrician)",
    en: "Electrician",
    descBn: "ওয়্যারিং, ফ্যান/লাইট, মোটর ও শর্ট সার্কিট মেরামত",
    descEn: "Wiring, switchboards, fans, lights & fault repair",
  },
  {
    value: "প্লাম্বার",
    tab: "skilled",
    bn: "প্লাম্বার (Plumber)",
    en: "Plumber",
    descBn: "পাইপ লিকেজ, ট্যাপ, মোটর ও স্যানিটারি ফিটিংস",
    descEn: "Pipe leaks, taps, water tanks & sanitary fittings",
  },
  {
    value: "ক্লিনার টিম",
    tab: "skilled",
    bn: "ক্লিনার টিম (Cleaner Team)",
    en: "Cleaner Team",
    descBn: "বাসা, ফ্ল্যাট ও অফিস ডিপ ক্লিনিং টিম",
    descEn: "Full home, apartment & office deep-cleaning team",
  },
  {
    value: "ক্লিনার",
    tab: "skilled",
    bn: "ক্লিনার (Single Cleaner)",
    en: "Cleaner (Individual)",
    descBn: "দৈনিক বা নির্দিষ্ট সময়ের পরিষ্কার কর্মী",
    descEn: "Single cleaner for regular or one-off cleaning",
  },
  {
    value: "এসি মিস্ত্রি",
    tab: "skilled",
    bn: "এসি ও ফ্রিজ মিস্ত্রি (AC Technician)",
    en: "AC & Fridge Technician",
    descBn: "এসি সার্ভিসিং, গ্যাস রিফিল ও ইনস্টলেশন",
    descEn: "AC servicing, gas refill, installation & repair",
  },
  {
    value: "কারপেন্টার",
    tab: "skilled",
    bn: "কারপেন্টার (Carpenter)",
    en: "Carpenter",
    descBn: "কাঠের আসবাব তৈরি, দরজা-জানালা মেরামত",
    descEn: "Furniture making, doors, cabinets & woodwork",
  },
  {
    value: "রংমিস্ত্রি",
    tab: "skilled",
    bn: "রংমিস্ত্রি (Painter)",
    en: "Painter",
    descBn: "বাসা, দোকান ও ফার্নিচার রং ও পলিশ",
    descEn: "Interior/exterior wall painting & furniture polish",
  },

  // Caregiver
  {
    value: "হাসপাতালে রোগীর দেখাশোনা",
    tab: "caregiver",
    bn: "হাসপাতালে রোগীর দেখাশোনা",
    en: "Hospital Patient Care",
    descBn: "হাসপাতালে ডে/নাইট শিফটে রোগীর পাশে থেকে সেবা",
    descEn: "Day/night bedside attendant support at hospitals",
  },
  {
    value: "বাসায় রোগীর দেখাশোনা",
    tab: "caregiver",
    bn: "বাসায় রোগীর দেখাশোনা",
    en: "Home Patient Care",
    descBn: "অসুস্থ বা অপারেশন-পরবর্তী রোগীর বাসায় সেবা",
    descEn: "Post-hospitalization & daily patient care at home",
  },
  {
    value: "বয়স্ক সেবা (Elderly Care)",
    tab: "caregiver",
    bn: "বয়স্কদের দেখাশোনা",
    en: "Elderly Care",
    descBn: "প্রবীণ মা-বাবা বা পরিবারের সদস্যের দৈনন্দিন যত্ন",
    descEn: "Compassionate daily assistance for senior family members",
  },
  {
    value: "কেয়ারগিভার",
    tab: "caregiver",
    bn: "সাধারণ কেয়ারগিভার / বেবিসিটার",
    en: "General Caregiver / Companion",
    descBn: "শিশু ও পরিবারের সদস্যদের সার্বিক দেখাশোনা",
    descEn: "Childcare, companionship & general family care",
  },

  // Any Work / General
  {
    value: "যেকোনো কাজ (Any Work)",
    tab: "any-work",
    bn: "যেকোনো কাজ (Any Work)",
    en: "Any Work (Custom Task)",
    descBn: "যেকোনো বৈধ দৈনিক, ব্যক্তিগত বা কাস্টম কাজ",
    descEn: "Any custom errand, helper, event, or general work",
  },
  {
    value: "নিরাপত্তাকর্মী",
    tab: "any-work",
    bn: "নিরাপত্তাকর্মী (Security Guard)",
    en: "Security Guard",
    descBn: "বাসা, দোকান বা অফিসের ডে/নাইট গার্ড",
    descEn: "Day or night shift security guard for home/shop/office",
  },
  {
    value: "ইভেন্ট / ডেলিভারি হেল্পার",
    tab: "any-work",
    bn: "ইভেন্ট / লোডিং / হেল্পার",
    en: "Event / Loading / Helper",
    descBn: "অনুষ্ঠান, দোকান, গুদাম বা বাসার কাজে সহায়ক কর্মী",
    descEn: "Helper for events, loading/unloading, or general labor",
  },
  {
    value: "অন্যান্য",
    tab: "any-work",
    bn: "অন্যান্য (Other)",
    en: "Other",
    descBn: "অন্য যেকোনো বিশেষায়িত বা সাধারণ কাজ",
    descEn: "Other specialized or general tasks",
  },
];

export const VALID_CATEGORY_VALUES = CATEGORY_OPTIONS.map((c) => c.value);

export const JOB_TYPE_OPTIONS = [
  { value: "দৈনিক", bn: "দৈনিক", en: "Daily" },
  { value: "সাপ্তাহিক", bn: "সাপ্তাহিক", en: "Weekly" },
  { value: "মাসিক", bn: "মাসিক", en: "Monthly" },
  { value: "চুক্তিভিত্তিক", bn: "চুক্তিভিত্তিক (Fixed/Contract)", en: "Fixed / Contract" },
] as const;

export const VALID_JOB_TYPES = JOB_TYPE_OPTIONS.map((t) => t.value);

export function getCategoriesForTab(tab: CategoryTabSlug): CategoryOption[] {
  if (tab === "any-work") {
    return CATEGORY_OPTIONS;
  }
  return CATEGORY_OPTIONS.filter((c) => c.tab === tab);
}

export function getTabInfo(slug: string) {
  return CATEGORY_TABS.find((t) => t.slug === slug) ?? null;
}

export function translateCategory(value: string, locale: Locale): string {
  const found = CATEGORY_OPTIONS.find((c) => c.value === value);
  if (!found) return value;
  return locale === "en" ? found.en : found.bn;
}

export function translateJobType(value: string, locale: Locale): string {
  const found = JOB_TYPE_OPTIONS.find((t) => t.value === value);
  if (!found) return value;
  return locale === "en" ? found.en : found.bn;
}

export function matchesTabCategory(category: string, tab: CategoryTabSlug): boolean {
  if (tab === "any-work") return true;
  const option = CATEGORY_OPTIONS.find((c) => c.value === category);
  return option?.tab === tab;
}
