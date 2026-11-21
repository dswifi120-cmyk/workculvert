"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Car,
  CheckCircle2,
  HeartHandshake,
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
  const title = locale === "en" ? tabMeta.en : tabMeta.bn;
  const subtitle = locale === "en" ? tabMeta.subtitleEn : tabMeta.subtitleBn;
  const description =
    locale === "en" ? tabMeta.descriptionEn : tabMeta.descriptionBn;

  return (
    <main className="min-h-screen bg-paper">
      <Nav />

      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-line bg-linen/50 pb-12 pt-36 sm:pt-40">
        <div className="dots-bg absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-mist transition-colors hover:text-pine"
          >
            <ArrowLeft size={15} /> {wp.backHome}
          </Link>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>
                <TabIcon size={13} className="text-pine" />
                {subtitle}
              </Eyebrow>
              <h1 className="mt-4 text-[clamp(2rem,4.8vw,3.3rem)] font-bold leading-[1.18] text-ink">
                {title}
              </h1>
              <p className="mt-3 text-[15.5px] leading-[1.8] text-mist sm:text-[16.5px]">
                {description}
              </p>
            </div>

            <a
              href="#post-form"
              className="inline-flex items-center gap-2 rounded-full bg-ochre px-6 py-3.5 text-[15px] font-semibold text-ink shadow-[0_10px_26px_-8px_rgba(245,158,11,0.5)] transition-all hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-white"
            >
              <SquarePen size={16} />
              {wp.postNowBtn}
            </a>
          </div>

          {/* Switch between the 4 Category Tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[12.5px] font-semibold text-faint">
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
                    "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors",
                    active
                      ? "border-pine bg-pine text-paper shadow-sm"
                      : "border-line bg-card text-ink hover:border-pine/40 hover:text-pine"
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

      {/* Main Split Grid: Subcategories + Verified Jobs on Left | Preselected Post Form on Right */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
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
                            ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        }}
                        className={cn(
                          "group flex flex-col items-start rounded-2xl border p-4 text-left transition-all",
                          isSelected
                            ? "border-pine bg-tint/70 shadow-sm"
                            : "border-line bg-card hover:border-pine/35"
                        )}
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-[15px] font-bold text-ink group-hover:text-pine">
                            {locale === "en" ? sub.en : sub.bn}
                          </span>
                          {isSelected && (
                            <CheckCircle2
                              size={17}
                              className="shrink-0 text-pine"
                            />
                          )}
                        </div>
                        <span className="mt-1 text-[12.5px] leading-relaxed text-mist">
                          {locale === "en" ? sub.descEn : sub.descBn}
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

            {/* Sticky Post Work Form with Preselected Category */}
            <div>
              <div className="lg:sticky lg:top-28">
                <PostJobForm
                  activeTab={tabSlug}
                  initialCategory={pickedCategory}
                  sectionLabel={locale === "en" ? tabMeta.en : tabMeta.bn}
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
