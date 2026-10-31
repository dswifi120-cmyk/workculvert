import { db } from "@/db";
import { jobs, type Job } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/motion-primitives";
import { ApplyButton } from "@/components/apply-button";
import { PostJobForm } from "@/components/landing/post-job";
import { formatNumber, timeAgoBn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function JobCard({ job }: { job: Job }) {
  return (
    <article className="shadow-card group rounded-3xl border border-line bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-pine/30 hover:shadow-lift">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-tint px-3 py-1 text-[12px] font-semibold text-pine">{job.category}</span>
        <span className="flex items-center gap-4 text-[12px] text-faint">
          {job.urgent && <span className="flex items-center gap-1.5 font-semibold text-brick"><span className="size-1.5 animate-pulse rounded-full bg-brick" /> জরুরি</span>}
          <span className="flex items-center gap-1"><Clock size={12} /> {timeAgoBn(job.createdAt)}</span>
        </span>
      </div>
      <h3 className="mt-3.5 text-[17px] font-semibold leading-snug text-ink transition-colors group-hover:text-pine">{job.title}</h3>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mist">
        <span className="flex items-center gap-1"><MapPin size={13} className="text-river" /> {job.location}, বগুড়া</span>
        <span className="rounded-full bg-paper px-2 py-0.5 text-[12px] font-medium text-mist">{job.jobType}</span>
        <span className="rounded-full bg-paper px-2 py-0.5 text-[12px] font-medium text-mist">{job.durationText}</span>
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-mist">{job.description || "Admin-verified কাজ — worker matching এর জন্য প্রস্তুত।"}</p>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <p className="text-xl font-bold text-ink">৳{formatNumber(job.budget)} <span className="ml-1 text-[12px] font-normal text-faint">বাজেট</span></p>
        <ApplyButton jobId={job.id} jobTitle={job.title} variant="landing" />
      </div>
    </article>
  );
}

export async function JobsSection() {
  let list: Job[] = [];
  try {
    list = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.verifiedByAdmin, true), eq(jobs.status, "verified")))
      .orderBy(desc(jobs.createdAt))
      .limit(6);
  } catch {
    list = [];
  }

  return (
    <section id="jobs" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div>
            <Reveal><Eyebrow>admin-verified লাইভ ফিড</Eyebrow></Reveal>
            <Reveal delay={0.08}><h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[1.2] text-ink">সাম্প্রতিক <span className="font-serif text-pine">যাচাইকৃত কাজের পোস্ট</span></h2></Reveal>
            <Reveal delay={0.14}><p className="mt-4 max-w-lg text-[15px] leading-[1.8] text-mist">শুধু admin-verified কাজগুলোই এখানে দেখা যায়। fake post, incomplete info বা unverified ফোন নম্বরের কাজ public feed-এ আসে না।</p></Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {list.map((job, i) => (
                <Reveal key={job.id} delay={0.05 + (i % 2) * 0.08}><JobCard job={job} /></Reveal>
              ))}
              {list.length === 0 && <p className="rounded-2xl border border-dashed border-line bg-card p-8 text-center text-mist sm:col-span-2">এখনো কোনো verified job public feed-এ যায়নি।</p>}
            </div>

            <Reveal delay={0.2} className="mt-8">
              <a href="/login" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-pine">worker portal-এ login করুন <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" /></a>
            </Reveal>
          </div>

          <div id="post-job" className="scroll-mt-28">
            <Reveal delay={0.15} className="lg:sticky lg:top-28"><PostJobForm /></Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
