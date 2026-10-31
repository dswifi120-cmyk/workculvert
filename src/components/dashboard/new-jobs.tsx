import { db } from "@/db";
import { jobs, type Job } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import { ApplyButton } from "@/components/apply-button";
import { formatNumber, timeAgoBn } from "@/lib/utils";

export async function NewJobsList() {
  let list: Job[] = [];
  try {
    list = await db.select().from(jobs).orderBy(desc(jobs.createdAt)).limit(5);
  } catch {
    list = [];
  }

  return (
    <section className="shadow-card rounded-2xl border border-line bg-card p-5 sm:p-6 xl:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-ink">
            আপনার জন্য নতুন কাজ
            <span className="flex items-center gap-1 rounded-full bg-ochre-soft px-2.5 py-1 text-[11px] font-bold text-ochre-deep">
              <Sparkles size={11} /> লাইভ
            </span>
          </h3>
          <p className="mt-0.5 text-xs text-faint">
            আপনার স্কিল ও এলাকার সাথে মিলে এমন পোস্ট — ডাটাবেস থেকে সরাসরি
          </p>
        </div>
        <button
          type="button"
          className="group flex items-center gap-1 text-[13px] font-bold text-pine"
        >
          সবগুলো দেখুন
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {list.map((job) => (
          <li
            key={job.id}
            className="group flex flex-wrap items-center gap-4 px-1 py-4 transition-colors hover:bg-pine/[0.03]"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-tint text-[15px] font-bold text-pine">
              {job.category.slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-ink transition-colors group-hover:text-pine">
                {job.title}
              </p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12.5px] text-mist">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-river" />
                  {job.location}, বগুড়া
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {timeAgoBn(job.createdAt)}
                </span>
                <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] font-medium">
                  {job.jobType}
                </span>
              </p>
            </div>
            <p className="text-right text-[17px] font-bold text-ink">
              ৳{formatNumber(job.budget)}
            </p>
            <ApplyButton jobId={job.id} jobTitle={job.title} variant="dashboard" />
          </li>
        ))}
        {list.length === 0 && (
          <li className="py-10 text-center text-sm text-mist">
            এই মুহূর্তে ম্যাচিং কোনো কাজ নেই — নোটিফিকেশন চালু রাখুন।
          </li>
        )}
      </ul>
    </section>
  );
}
