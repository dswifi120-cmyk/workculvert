"use client";

import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import type { Job } from "@/db/schema";
import { Eyebrow, Reveal } from "@/components/motion-primitives";
import { ApplyButton } from "@/components/apply-button";
import { PostJobForm } from "@/components/landing/post-job";
import { formatNumber, timeAgo } from "@/lib/utils";
import { translateCategory, translateJobType } from "@/lib/categories";
import { useLanguage } from "@/components/language-provider";

export function JobCard({ job }: { job: Job }) {
  const { locale, t } = useLanguage();
  const jt = t.jobs;

  return (
    <article className="shadow-card group rounded-3xl border border-line bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-pine/30 hover:shadow-lift">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-tint px-3 py-1 text-[12px] font-semibold text-pine">
          {translateCategory(job.category, locale)}
        </span>
        <span className="flex items-center gap-4 text-[12px] text-faint">
          {job.urgent && (
            <span className="flex items-center gap-1.5 font-semibold text-brick">
              <span className="size-1.5 animate-pulse rounded-full bg-brick" />{" "}
              {jt.urgent}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={12} /> {timeAgo(job.createdAt, locale)}
          </span>
        </span>
      </div>
      <h3 className="mt-3.5 text-[17px] font-semibold leading-snug text-ink transition-colors group-hover:text-pine">
        {job.title}
      </h3>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mist">
        <span className="flex items-center gap-1">
          <MapPin size={13} className="text-river" /> {job.location},{" "}
          {jt.citySuffix}
        </span>
        <span className="rounded-full bg-paper px-2 py-0.5 text-[12px] font-medium text-mist">
          {translateJobType(job.jobType, locale)}
        </span>
        <span className="rounded-full bg-paper px-2 py-0.5 text-[12px] font-medium text-mist">
          {job.durationText}
        </span>
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-mist">
        {job.description || jt.defaultDesc}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <p className="text-xl font-bold text-ink">
          ৳{formatNumber(job.budget, 0, locale === "bn")}{" "}
          <span className="ml-1 text-[12px] font-normal text-faint">
            {jt.budgetLabel}
          </span>
        </p>
        <ApplyButton jobId={job.id} jobTitle={job.title} variant="landing" />
      </div>
    </article>
  );
}

export function JobsFeedClient({ jobs }: { jobs: Job[] }) {
  const { t } = useLanguage();
  const jt = t.jobs;

  return (
    <section id="jobs" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
          <div>
            <Reveal>
              <Eyebrow>{jt.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[1.2] text-ink">
                {jt.titlePrefix}{" "}
                <span className="font-serif text-pine">{jt.titleHighlight}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8] text-mist">
                {jt.copy}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {jobs.map((job, i) => (
                <Reveal key={job.id} delay={0.05 + (i % 2) * 0.08}>
                  <JobCard job={job} />
                </Reveal>
              ))}
              {jobs.length === 0 && (
                <p className="rounded-2xl border border-dashed border-line bg-card p-8 text-center text-mist sm:col-span-2">
                  {jt.empty}
                </p>
              )}
            </div>

            <Reveal delay={0.2} className="mt-8">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 text-[15px] font-semibold text-pine"
              >
                {jt.workerPortalLink}{" "}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>

          <div id="post-job" className="scroll-mt-28">
            <Reveal delay={0.15} className="lg:sticky lg:top-28">
              <PostJobForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
