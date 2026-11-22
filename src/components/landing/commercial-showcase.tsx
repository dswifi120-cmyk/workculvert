"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Car,
  HeartHandshake,
  PawPrint,
  Wrench,
} from "lucide-react";
import { CATEGORY_TABS, type CategoryTabSlug } from "@/lib/categories";
import { Reveal, SectionHeading } from "@/components/motion-primitives";
import { useLanguage } from "@/components/language-provider";

const TAB_ICON: Record<CategoryTabSlug, typeof Briefcase> = {
  "any-work": Briefcase,
  transportation: Car,
  skilled: Wrench,
  caregiver: HeartHandshake,
  "pet-caretaker": PawPrint,
};

export function CommercialShowcase() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  return (
    <section className="relative overflow-hidden border-y border-line bg-card/55 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={isEn ? "5 Specialized Portals" : "৫টি বিশেষায়িত বিভাগ"}
          title={
            isEn ? (
              <>
                Post work on a{" "}
                <span className="font-serif text-pine">custom-built</span> page
                for every need
              </>
            ) : (
              <>
                প্রতিটি কাজের জন্য{" "}
                <span className="font-serif text-pine">আলাদা ও কাস্টমাইজড</span>{" "}
                ওয়ার্ক পেজ
              </>
            )
          }
          copy={
            isEn
              ? "From Bike Parcel & Shifting to Skilled Technicians, Hospital Caregivers, and Pet Caretakers — click any portal below to post with custom options."
              : "বাইক পার্সেল ও শিফটিং থেকে শুরু করে দক্ষ টেকনিশিয়ান, হাসপাতাল কেয়ারগিভার এবং পেট কেয়ারটেকার — যেকোনো বিভাগে ক্লিক করে কাস্টম ফর্মে কাজ পোস্ট করুন।"
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {CATEGORY_TABS.map((tab, idx) => {
            const Icon = TAB_ICON[tab.slug];
            // First 2 cards span 6 cols on lg, bottom 3 span 4 cols on lg for a balanced 2+3 magazine bento
            const colSpan =
              idx < 2 ? "lg:col-span-6" : "lg:col-span-4";

            return (
              <Reveal
                key={tab.slug}
                delay={0.05 + idx * 0.06}
                className={colSpan}
              >
                <Link
                  href={tab.href}
                  className="group relative flex h-[300px] flex-col justify-end overflow-hidden rounded-3xl border border-line bg-ink p-6 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift sm:h-[330px]"
                >
                  <Image
                    src={tab.heroImage}
                    alt={isEn ? tab.en : tab.bn}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/45 to-ink/10" />

                  <div className="relative z-10 flex items-center justify-between gap-2 mb-auto">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-ink/55 px-3 py-1 text-[11.5px] font-semibold text-mint backdrop-blur-md">
                      <Icon size={13} />
                      {isEn ? tab.accentBadgeEn : tab.accentBadgeBn}
                    </span>
                    <span className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-transform duration-300 group-hover:bg-ochre group-hover:text-ink">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold text-white">
                        {isEn ? tab.en : tab.bn}
                      </h3>
                      {tab.slug === "pet-caretaker" && (
                        <span className="rounded-full bg-ochre px-2 py-0.5 text-[10px] font-bold uppercase text-ink">
                          {isEn ? "New" : "নতুন"}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-white/80">
                      {isEn ? tab.subtitleEn : tab.subtitleBn}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-ochre">
                      {isEn ? "Open Custom Work Page →" : "কাস্টম পেজে যান →"}
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
