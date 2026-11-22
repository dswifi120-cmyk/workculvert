"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Car,
  CheckCircle2,
  HeartHandshake,
  PawPrint,
  Sparkles,
  SquarePen,
  Wrench,
} from "lucide-react";
import type { Job } from "@/db/schema";
import {
  CATEGORY_TABS,
  getCategoriesForTab,
  type CategoryTabSlug,
} from "@/lib/categories";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { PostJobForm } from "@/components/landing/post-job";
import { JobCard } from "@/components/landing/jobs-client";
import { Eyebrow, Reveal } from "@/components/motion-primitives";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

const TAB_ICONS: Record<CategoryTabSlug, typeof Briefcase> = {
  "any-work": Briefcase,
  transportation: Car,
  skilled: Wrench,
  caregiver: HeartHandshake,
  "pet-caretaker": PawPrint,
};

const TAB_GRADIENTS: Record<CategoryTabSlug, string> = {
  "any-work": "from-pine-deep via-pine-dark to-pine",
  transportation: "from-[#062b3d] via-[#0c4f6e] to-river",
  skilled: "from-[#2c1c06] via-[#4a300a] to-pine-deep",
  caregiver: "from-[#351318] via-[#5a2027] to-pine-deep",
  "pet-caretaker": "from-[#07362b] via-[#0c5b4e] to-[#117462]",
};

export function CategoryWorkView({
  tabSlug,
  initialCategoryQuery,
  jobs,
}: {
  tabSlug: CategoryTabSlug;
  initialCategoryQuery?: string;
  jobs: Job[];
}) {
  const { locale, t } = useLanguage();
  const isEn = locale === "en";
  const wp = t.pages.workPage;

  const tabMeta =
    CATEGORY_TABS.find((item) => item.slug === tabSlug) ?? CATEGORY_TABS[0];
  const subcategories = getCategoriesForTab(tabSlug);

  const validInitial =
    initialCategoryQuery &&
    subcategories.some((s) => s.value === initialCategoryQuery)
      ? initialCategoryQuery
      : tabMeta.defaultCategory;

  const [pickedCategory, setPickedCategory] = useState(validInitial);
  const [prevInitial, setPrevInitial] = useState(validInitial);
  if (validInitial !== prevInitial) {
    setPrevInitial(validInitial);
    setPickedCategory(validInitial);
  }

  const TabIcon = TAB_ICONS[tabSlug];
  const title = isEn ? tabMeta.en : tabMeta.bn;
  const subtitle = isEn ? tabMeta.subtitleEn : tabMeta.subtitleBn;
  const description = isEn ? tabMeta.descriptionEn : tabMeta.descriptionBn;
  const heroCaption = isEn ? tabMeta.heroCaptionEn : tabMeta.heroCaptionBn;
  const accentBadge = isEn ? tabMeta.accentBadgeEn : tabMeta.accentBadgeBn;
  const trustPoints = isEn ? tabMeta.trustPointsEn : tabMeta.trustPointsBn;

  return (
    <main className="min-h-screen bg-paper">
      <Nav />

      {/* Category-Specific Commercial Hero Banner with Contextual Photography */}
      <section
        className={cn(
          "relative overflow-hidden border-b border-line bg-gradient-to-br pb-14 pt-36 text-paper sm:pt-40",
          TAB_GRADIENTS[tabSlug]
        )}
      >
        <div className="dots-bg-light absolute inset-0 opacity-35" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-mint/15 blur-[110px]" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-ochre/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-paper/75 transition-colors hover:text-mint"
          >
            <ArrowLeft size={15} /> {wp.backHome}
          </Link>

          <div className="mt-5 grid items-center gap-8 lg:grid-cols-[1.2fr_0.85fr] lg:gap-12">
            {/* Left Copy & TrustChecklist */}
            <div>
              <Eyebrow dark>
                <TabIcon size={13} className="text-mint" />
                {accentBadge}
              </Eyebrow>

              <h1 className="mt-4 text-[clamp(2.1rem,4.8vw,3.4rem)] font-bold leading-[1.16] text-paper">
                {title}
              </h1>
              <p className="mt-2 text-[16px] font-medium text-mint">
                {subtitle}
              </p>
              <p className="mt-3 max-w-xl text-[15px] leading-[1.8] text-paper/80 sm:text-[16px]">
                {description}
              </p>

              <ul className="mt-6 space-y-2">
                {trustPoints.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-center gap-2.5 text-[13.5px] text-paper/90"
                  >
                    <BadgeCheck size={16} className="shrink-0 text-mint" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#post-form"
                  className="inline-flex items-center gap-2 rounded-full bg-ochre px-6 py-3.5 text-[15px] font-semibold text-ink shadow-[0_12px_28px_-8px_rgba(245,158,11,0.55)] transition-all hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-white"
                >
                  <SquarePen size={16} />
                  {wp.postNowBtn}
                </a>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-5 py-3.5 text-[14px] font-semibold text-paper transition-colors hover:bg-white/15"
                >
                  {isEn ? "Join as a Pro in this Category" : "এই বিভাগে কর্মী হিসেবে যুক্ত হোন"}
                </Link>
              </div>
            </div>

            {/* Right Contextual Visual Showcase Card */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
                <Image
                  src={tabMeta.heroImage}
                  alt={title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 95vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-ink/60 px-4 py-3 backdrop-blur-md">
                  <div>
                    <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-mint">
                      <Sparkles size={12} />
                      {isEn ? "Verified Service" : "যাচাইকৃত সার্ভিস"}
                    </p>
                    <p className="mt-0.5 text-[13.5px] font-semibold text-white">
                      {heroCaption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Switch between all 5 Category Tabs */}
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-white/12 pt-6">
            <span className="mr-1 text-[12.5px] font-semibold text-paper/65">
              {wp.switchCategoryLabel}
            </span>
            {CATEGORY_TABS.map((item) => {
              const Icon = TAB_ICONS[item.slug];
              const active = item.slug === tabSlug;
              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
                    active
                      ? "border-ochre bg-ochre text-ink shadow-sm"
                      : "border-white/15 bg-white/[0.07] text-paper hover:bg-white/15"
                  )}
                >
                  <Icon size={14} />
                  {item.en}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Split Grid: Subcategories + Verified Jobs on Left | Customized Post Form on Right */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1.05fr] lg:gap-12">
            <div className="space-y-12">
              {/* Subcategory Interactive Cards */}
              <div>
                <h2 className="text-xl font-bold text-ink sm:text-2xl">
                  {wp.subcategoriesTitle}
                </h2>
                <p className="mt-1.5 text-[13.5px] text-mist">
                  {wp.subcategoriesHint}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {subcategories.map((sub) => {
                    const isSelected = pickedCategory === sub.value;
                    return (
                      <button
                        key={sub.value}
                        type="button"
                        onClick={() => {
                          setPickedCategory(sub.value);
                          document
                            .getElementById("post-form")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "nearest",
                            });
                        }}
                        className={cn(
                          "group flex flex-col items-start rounded-2xl border p-4 text-left transition-all",
                          isSelected
                            ? "border-pine bg-tint/70 shadow-sm"
                            : "border-line bg-card hover:border-pine/35 hover:shadow-card"
                        )}
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-[15px] font-bold text-ink group-hover:text-pine">
                            {isEn ? sub.en : sub.bn}
                          </span>
                          {isSelected && (
                            <CheckCircle2
                              size={17}
                              className="shrink-0 text-pine"
                            />
                          )}
                        </div>
                        <span className="mt-1 text-[12.5px] leading-relaxed text-mist">
                          {isEn ? sub.descEn : sub.descBn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verified Jobs in this Category */}
              <div>
                <h2 className="text-xl font-bold text-ink sm:text-2xl">
                  {wp.liveJobsTitle}
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {jobs.map((job, i) => (
                    <Reveal key={job.id} delay={0.04 + (i % 2) * 0.06}>
                      <JobCard job={job} />
                    </Reveal>
                  ))}
                  {jobs.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-line bg-card p-8 text-center text-sm text-mist sm:col-span-2">
                      {wp.noJobsInTab}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Tailored Post Work Form */}
            <div>
              <div className="lg:sticky lg:top-28">
                <PostJobForm
                  activeTab={tabSlug}
                  initialCategory={pickedCategory}
                  sectionLabel={isEn ? tabMeta.en : tabMeta.bn}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
