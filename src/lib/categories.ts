export type Locale = "bn" | "en";

export const LOCALE_COOKIE = "wc_lang";

export type CategoryTabSlug =
  | "any-work"
  | "transportation"
  | "skilled"
  | "caregiver"
  | "pet-caretaker";

export type CategoryOption = {
  /** Stored canonical value in PostgreSQL (compatible with existing BN categories + new ones) */
  value: string;
  tab: CategoryTabSlug;
  bn: string;
  en: string;
  descBn: string;
  descEn: string;
};

export type CategoryTabMeta = {
  slug: CategoryTabSlug;
  href: string;
  bn: string;
  en: string;
  subtitleBn: string;
  subtitleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  defaultCategory: string;
  heroImage: string;
  heroCaptionBn: string;
  heroCaptionEn: string;
  accentBadgeBn: string;
  accentBadgeEn: string;
  trustPointsBn: string[];
  trustPointsEn: string[];
};

export const CATEGORY_TABS: CategoryTabMeta[] = [
  {
    slug: "any-work",
    href: "/work/any-work",
    bn: "যেকোনো কাজ",
    en: "Any Work",
    subtitleBn: "কাস্টম টাস্ক, বাজার, ইভেন্ট হেল্পার ও দৈনন্দিন যেকোনো কাজ",
    subtitleEn: "Custom errands, event helpers, market runs & everyday tasks",
    descriptionBn:
      "বাসা, দোকান, অফিস বা ব্যক্তিগত প্রয়োজনে যেকোনো বৈধ কাজ পোস্ট করুন। নির্দিষ্ট ক্যাটাগরি না মিললেও এখানে আপনার প্রয়োজনমতো বাজেট ও সময় দিয়ে পোস্ট করতে পারবেন।",
    descriptionEn:
      "Post any legitimate task for your home, shop, office, or personal needs. Even if your task doesn't fit a fixed trade, customize it freely right here.",
    defaultCategory: "যেকোনো কাজ (Any Work)",
    heroImage: "/images/work-any.jpg",
    heroCaptionBn: "ইভেন্ট সেটআপ, বাজার/এন্ড্রান্ড, লোডিং ও যেকোনো দৈনন্দিন সহায়তা",
    heroCaptionEn: "Event setup, errands, loading helpers & flexible daily support",
    accentBadgeBn: "কাস্টম ও ফ্লেক্সিবল কাজ",
    accentBadgeEn: "Flexible Custom Tasks",
    trustPointsBn: [
      "১ ঘণ্টা থেকে মাসব্যাপী যেকোনো কাজের সুবিধা",
      "কতজন সহকারী লাগবে তা উল্লেখ করার অপশন",
      "অ্যাডমিন ফোন ভেরিফিকেশনের মাধ্যমে নিরাপদ ম্যাচিং",
    ],
    trustPointsEn: [
      "Book from 1-hour quick errands to monthly tasks",
      "Specify exact number of helpers & preferred time",
      "Admin-screened local helpers for peace of mind",
    ],
  },
  {
    slug: "transportation",
    href: "/work/transportation",
    bn: "পরিবহন ও পার্সেল",
    en: "Transportation",
    subtitleBn: "Bike Ride, Parcel Delivery, CNG, Truck ও Van শিফটিং",
    subtitleEn: "Bike Ride, Parcel Delivery, CNG Reserve, Truck & Van Shifting",
    descriptionBn:
      "জরুরি পার্সেল ডেলিভারি, বাইক রাইড, সিএনজি রিজার্ভ কিংবা বাসা বদলের ট্রাক/ভ্যান—পিকআপ ও ড্রপ লোকেশন উল্লেখ করে মুহূর্তেই পরিবহন কাজ পোস্ট করুন।",
    descriptionEn:
      "From urgent Bike parcel delivery and passenger rides to reserved CNGs and house-shifting Trucks/Vans — enter pickup & drop-off points and get matched fast.",
    defaultCategory: "Bike",
    heroImage: "/images/work-transport.jpg",
    heroCaptionBn: "দ্রুত বাইক পার্সেল, সিএনজি রিজার্ভ ও নিরাপদ বাসা বদল ট্রাক",
    heroCaptionEn: "Express bike parcels, reserved CNG rides & safe shifting trucks",
    accentBadgeBn: "রাইড · পার্সেল · শিফটিং",
    accentBadgeEn: "Ride · Parcel · Shifting",
    trustPointsBn: [
      "পিকআপ ও ড্রপ-অফ লোকেশনসহ স্পষ্ট রুট নির্দেশনা",
      "পার্সেল ডেলিভারি, যাত্রী রাইড বা মালামাল শিফটিং আলাদা ফর্ম",
      "লাইসেন্স ও পরিচয় যাচাইকৃত স্থানীয় চালক",
    ],
    trustPointsEn: [
      "Dedicated Pickup & Drop-off route fields",
      "Tailored options for Ride, Parcel, or Heavy Cargo",
      "Verified local riders and commercial drivers",
    ],
  },
  {
    slug: "skilled",
    href: "/work/skilled",
    bn: "দক্ষ কারিগর",
    en: "Skilled",
    subtitleBn: "Electrician, Plumber, Cleaner Team, AC, Painter ও Carpenter",
    subtitleEn: "Electrician, Plumber, Cleaner Team, AC, Painter & Carpenter",
    descriptionBn:
      "বাসা বা অফিসের বৈদ্যুতিক কাজ, পাইপ লিকেজ, এসি সার্ভিসিং, ডিপ ক্লিনিং টিম বা কাঠের কাজের জন্য অভিজ্ঞ ও যাচাইকৃত টেকনিশিয়ান বুক করুন।",
    descriptionEn:
      "Hire verified technical pros for electrical faults, plumbing leaks, full-home deep cleaning teams, AC servicing, carpentry, and painting.",
    defaultCategory: "ইলেকট্রিশিয়ান",
    heroImage: "/images/work-skilled.jpg",
    heroCaptionBn: "দক্ষ ইলেকট্রিশিয়ান, প্লাম্বার, এসি টেকনিশিয়ান ও ক্লিনার টিম",
    heroCaptionEn: "Trusted electricians, plumbers, AC technicians & cleaner teams",
    accentBadgeBn: "যাচাইকৃত টেকনিশিয়ান ও টিম",
    accentBadgeEn: "Verified Pros & Teams",
    trustPointsBn: [
      "যন্ত্রপাতি/টুলস ও স্পেয়ার পার্টস কার—আগেই উল্লেখ করুন",
      "সিঙ্গেল মিস্ত্রি অথবা পুরো ক্লিনিং/কাজের টিম বুকিং",
      "পূর্ব অভিজ্ঞতা ও রেটিং দেখে অ্যাডমিন অ্যাসাইনমেন্ট",
    ],
    trustPointsEn: [
      "Specify tool & spare-parts requirements upfront",
      "Hire an individual technician or a full cleaning crew",
      "Skill-vetted local tradespeople near your location",
    ],
  },
  {
    slug: "caregiver",
    href: "/work/caregiver",
    bn: "কেয়ারগিভার",
    en: "Caregiver",
    subtitleBn: "হাসপাতালে ও বাসায় রোগী/বয়স্কদের যত্ন ও অ্যাটেনডেন্ট সেবা",
    subtitleEn: "Hospital patient attendant, home nursing & elderly care",
    descriptionBn:
      "হাসপাতালে ডে/নাইট শিফটে রোগীর পাশে থাকা, বাসায় অসুস্থ বা বয়স্ক বাবা-মায়ের সেবা এবং অপারেশন-পরবর্তী যত্নের জন্য মানবিক ও যাচাইকৃত কেয়ারগিভার।",
    descriptionEn:
      "Compassionate, background-checked caregivers for hospital bedside shifts, post-surgery recovery at home, and daily senior care.",
    defaultCategory: "হাসপাতালে রোগীর দেখাশোনা",
    heroImage: "/images/work-caregiver.jpg",
    heroCaptionBn: "হাসপাতাল ও বাসায় পরম যত্নে রোগী ও প্রবীণ সেবা",
    heroCaptionEn: "Compassionate hospital bedside & home care for loved ones",
    accentBadgeBn: "নিরাপদ ও মানবিক সেবা",
    accentBadgeEn: "Safe & Compassionate Care",
    trustPointsBn: [
      "ডে শিফট, নাইট শিফট বা ২৪ ঘণ্টা সার্বক্ষণিক অপশন",
      "পুরুষ বা নারী কেয়ারগিভার প্রিফারেন্স দেওয়ার সুবিধা",
      "NID ও পারিবারিক রেফারেন্স যাচাইকৃত কেয়ারগিভার",
    ],
    trustPointsEn: [
      "Day shift, night shift, or 24-hour live-in care options",
      "Choose preferred caregiver gender & mobility support level",
      "Strict NID and reference screening for family safety",
    ],
  },
  {
    slug: "pet-caretaker",
    href: "/work/pet-caretaker",
    bn: "পেট কেয়ারটেকার",
    en: "Pet Caretaker",
    subtitleBn: "বিড়াল, কুকুর ও পোষা প্রাণীর দেখাশোনা, হাঁটানো, গ্রুমিং ও ভেট ভিজিট",
    subtitleEn: "Cat & dog sitting, daily walking, feeding, grooming & vet visits",
    descriptionBn:
      "আপনি বাইরে বা ভ্রমণে থাকলে আপনার আদরের বিড়াল, কুকুর বা পাখির খাবার দেওয়া, হাঁটানো, লিটার/খাঁচা পরিষ্কার এবং ভেট চেকআপের জন্য বিশ্বস্ত পেট কেয়ারটেকার খুঁজুন।",
    descriptionEn:
      "Going out of town or busy at work? Book loving, verified pet caretakers for cat/dog sitting, daily walks, feeding, litter cleaning, grooming, or vet visits.",
    defaultCategory: "পেট সিটিং ও হোম কেয়ার (Pet Sitting)",
    heroImage: "/images/work-pet.jpg",
    heroCaptionBn: "আপনার আদরের বিড়াল, কুকুর ও পোষা প্রাণীর নিরাপদ ও যত্নশীল সঙ্গী",
    heroCaptionEn: "Loving, gentle care for your cats, dogs, birds & furry companions",
    accentBadgeBn: "নতুন · Pet Lover Network",
    accentBadgeEn: "New · Trusted Pet Care",
    trustPointsBn: [
      "বিড়াল, কুকুর, পাখি বা খরগোশের ধরন ও খাবার রুটিন উল্লেখ করুন",
      "বাসায় এসে দেখাশোনা, ডগ ওয়াকিং বা ভেট ক্লিনিকে নিয়ে যাওয়া",
      "প্রাণীবান্ধব ও অভিজ্ঞ পেট কেয়ারটেকারদের বিশেষ পুল",
    ],
    trustPointsEn: [
      "Specify pet type, temperament, feeding & litter schedule",
      "In-home sitting, daily dog walks, or vet clinic escort",
      "Dedicated pool of gentle, experienced animal lovers",
    ],
  },
];

export const CATEGORY_OPTIONS: CategoryOption[] = [
  // Transportation
  {
    value: "Bike",
    tab: "transportation",
    bn: "বাইক রাইড (Bike Ride)",
    en: "Bike Ride",
    descBn: "দ্রুত ব্যক্তিগত রাইড বা জরুরি যাতায়াত",
    descEn: "Quick personal passenger ride across town",
  },
  {
    value: "পার্সেল ও কুরিয়ার ডেলিভারি (Parcel Delivery)",
    tab: "transportation",
    bn: "পার্সেল ও ডকুমেন্ট ডেলিভারি",
    en: "Parcel & Document Delivery",
    descBn: "বাইক/সাইকেলে খাবার, ওষুধ, পার্সেল বা ফাইল ডেলিভারি",
    descEn: "Same-day parcel, medicine, food, or document drop-off",
  },
  {
    value: "CNG",
    tab: "transportation",
    bn: "সিএনজি রিজার্ভ (CNG)",
    en: "CNG Reserve",
    descBn: "শহর ও আশেপাশের এলাকায় রিজার্ভ আপ-ডাউন ট্রিপ",
    descEn: "Reserved local & inter-area CNG auto trips",
  },
  {
    value: "Truck",
    tab: "transportation",
    bn: "ট্রাক / পিকআপ (Truck Shifting)",
    en: "Truck / Pickup Shifting",
    descBn: "বাসা বদল, অফিস শিফটিং ও ভারী মালামাল পরিবহন",
    descEn: "House shifting, office relocation & heavy cargo",
  },
  {
    value: "Van",
    tab: "transportation",
    bn: "ভ্যান / রিকশা ভ্যান (Van)",
    en: "Cargo Van",
    descBn: "স্বল্প দূরত্বে ফার্নিচার, দোকান বা বাজারের মাল পরিবহন",
    descEn: "Short-distance furniture, appliances & market loads",
  },
  {
    value: "ড্রাইভার",
    tab: "transportation",
    bn: "ব্যক্তিগত / কমার্শিয়াল ড্রাইভার",
    en: "Private / Commercial Driver",
    descBn: "আপনার গাড়ির জন্য দৈনিক বা মাসিক অভিজ্ঞ চালক",
    descEn: "Experienced driver for your car on daily/monthly basis",
  },

  // Skilled
  {
    value: "ইলেকট্রিশিয়ান",
    tab: "skilled",
    bn: "ইলেকট্রিশিয়ান (Electrician)",
    en: "Electrician",
    descBn: "ওয়্যারিং, ফ্যান/লাইট, IPS ও শর্ট সার্কিট মেরামত",
    descEn: "Wiring, switchboards, IPS, fans & fault repair",
  },
  {
    value: "প্লাম্বার",
    tab: "skilled",
    bn: "প্লাম্বার (Plumber)",
    en: "Plumber",
    descBn: "পাইপ লিকেজ, ট্যাপ, মোটর ও গিজার/স্যানিটারি ফিটিংস",
    descEn: "Pipe leaks, water pumps, taps & sanitary fittings",
  },
  {
    value: "ক্লিনার টিম",
    tab: "skilled",
    bn: "ক্লিনার টিম (Cleaner Team)",
    en: "Cleaner Team",
    descBn: "বাসা, নতুন ফ্ল্যাট, পানির ট্যাংক ও অফিস ডিপ ক্লিনিং টিম",
    descEn: "Full home, apartment, water tank & office deep-cleaning crew",
  },
  {
    value: "ক্লিনার",
    tab: "skilled",
    bn: "ক্লিনার (Single Cleaner)",
    en: "Cleaner (Individual)",
    descBn: "দৈনিক বা নির্দিষ্ট সময়ের বাসা/অফিস পরিষ্কার কর্মী",
    descEn: "Single cleaner for regular or one-off cleaning",
  },
  {
    value: "এসি মিস্ত্রি",
    tab: "skilled",
    bn: "এসি ও ফ্রিজ টেকনিশিয়ান (AC/Fridge)",
    en: "AC & Fridge Technician",
    descBn: "এসি সার্ভিসিং, গ্যাস রিফিল, মাস্টার ওয়াশ ও ইনস্টলেশন",
    descEn: "AC master wash, gas refill, installation & fridge repair",
  },
  {
    value: "কারপেন্টার",
    tab: "skilled",
    bn: "কারপেন্টার (Carpenter)",
    en: "Carpenter",
    descBn: "কাঠের আসবাব তৈরি, লক ও দরজা-জানালা মেরামত",
    descEn: "Furniture assembly, locks, doors & custom woodwork",
  },
  {
    value: "রংমিস্ত্রি",
    tab: "skilled",
    bn: "রংমিস্ত্রি (Painter)",
    en: "Painter",
    descBn: "বাসা, দোকান ও ফার্নিচার রং, পুটি ও পলিশ",
    descEn: "Interior/exterior wall painting, putty & polish",
  },

  // Caregiver
  {
    value: "হাসপাতালে রোগীর দেখাশোনা",
    tab: "caregiver",
    bn: "হাসপাতালে রোগীর দেখাশোনা",
    en: "Hospital Patient Care",
    descBn: "হাসপাতালে ডে/নাইট শিফটে রোগীর পাশে থেকে সার্বক্ষণিক সেবা",
    descEn: "Day/night bedside attendant support at hospitals",
  },
  {
    value: "বাসায় রোগীর দেখাশোনা",
    tab: "caregiver",
    bn: "বাসায় রোগীর দেখাশোনা",
    en: "Home Patient Care",
    descBn: "অসুস্থ বা অপারেশন-পরবর্তী রোগীর বাসায় নার্সিং সহায়তা",
    descEn: "Post-hospitalization & daily patient care at home",
  },
  {
    value: "বয়স্ক সেবা (Elderly Care)",
    tab: "caregiver",
    bn: "বয়স্কদের দেখাশোনা (Elderly Care)",
    en: "Elderly Companion & Care",
    descBn: "প্রবীণ মা-বাবার ওষুধ, খাবার ও হাঁটাচলায় সহায়তা",
    descEn: "Daily assistance, medication reminders & senior care",
  },
  {
    value: "কেয়ারগিভার",
    tab: "caregiver",
    bn: "শিশু দেখাশোনা / জেনারেল কেয়ারগিভার",
    en: "Childcare / General Caregiver",
    descBn: "শিশু ও পরিবারের সদস্যদের নিরাপদ দেখাশোনা",
    descEn: "Trusted childcare, nanny support & family care",
  },

  // Pet Caretaker (NEW)
  {
    value: "পেট সিটিং ও হোম কেয়ার (Pet Sitting)",
    tab: "pet-caretaker",
    bn: "পেট সিটিং ও হোম কেয়ার (Cat/Dog Sitting)",
    en: "Pet Sitting & Home Care",
    descBn: "বাসায় এসে বিড়াল/কুকুরকে খাবার, পানি ও সঙ্গ দেওয়া",
    descEn: "In-home feeding, playtime, litter box & companionship",
  },
  {
    value: "ডগ ওয়াকিং ও ব্যায়াম (Dog Walking)",
    tab: "pet-caretaker",
    bn: "ডগ ওয়াকিং ও হাঁটানো (Dog Walking)",
    en: "Dog Walking & Exercise",
    descBn: "প্রতিদিন সকাল বা বিকালে নিরাপদে কুকুর হাঁটানো",
    descEn: "Safe daily morning or evening walks & outdoor exercise",
  },
  {
    value: "পেট গ্রুমিং ও গোসল (Pet Grooming)",
    tab: "pet-caretaker",
    bn: "পেট গ্রুমিং, গোসল ও নেইল ট্রিমিং",
    en: "Pet Bathing & Grooming",
    descBn: "পোষা বিড়াল/কুকুরের গোসল, লোম আঁচড়ানো ও পরিচ্ছন্নতা",
    descEn: "Gentle bathing, brushing, nail clipping & hygiene care",
  },
  {
    value: "ভেট ভিজিট ও পেট ট্রান্সপোর্ট (Vet Escort)",
    tab: "pet-caretaker",
    bn: "ভেট ভিজিট ও ভ্যাকসিন সহায়তা",
    en: "Vet Visit & Pet Transport",
    descBn: "পোষা প্রাণীকে ভেটেরিনারি ডাক্তারের কাছে নিয়ে যাওয়া",
    descEn: "Accompanying your pet safely to vet clinics for checkups",
  },
  {
    value: "পাখি, অ্যাকোয়ারিয়াম ও অন্যান্য পেট কেয়ার",
    tab: "pet-caretaker",
    bn: "পাখি, খরগোশ ও অ্যাকোয়ারিয়াম কেয়ার",
    en: "Bird, Rabbit & Aquarium Care",
    descBn: "খাঁচা পরিষ্কার, অ্যাকোয়ারিয়াম মেইনটেন্যান্স ও খাবার দেওয়া",
    descEn: "Cage cleaning, fish tank maintenance & feeding",
  },

  // Any Work / General
  {
    value: "নতুন কর্মী / ফ্রেশার (Fresher)",
    tab: "any-work",
    bn: "নতুন কর্মী / ফ্রেশার (Fresher — অভিজ্ঞতা ছাড়া)",
    en: "Fresher / General Helper (No Experience Needed)",
    descBn: "পূর্ব অভিজ্ঞতা ছাড়াই যেকোনো সাধারণ, শেখার যোগ্য বা সহকারী কাজ",
    descEn: "Entry-level helper, errand, or general work — zero prior experience needed",
  },
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
    bn: "ইভেন্ট / লোডিং / বাজার হেল্পার",
    en: "Event / Loading / Errand Helper",
    descBn: "অনুষ্ঠান, দোকান, গুদাম বা বাসার কাজে সহায়ক কর্মী",
    descEn: "Helper for events, loading/unloading, shopping, or labor",
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
  { value: "দৈনিক", bn: "দৈনিক / সিঙ্গেল ট্রিপ", en: "Single / Daily" },
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

export function getTabInfo(slug: string): CategoryTabMeta | null {
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
