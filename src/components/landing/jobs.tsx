import { getDb } from "@/db";
import { jobs, type Job } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { JobsFeedClient } from "@/components/landing/jobs-client";

export const dynamic = "force-dynamic";

export async function JobsSection() {
  let list: Job[] = [];
  try {
    const db = await getDb();
    list = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.verifiedByAdmin, true), eq(jobs.status, "verified")))
      .orderBy(desc(jobs.createdAt))
      .limit(6);
  } catch {
    list = [];
  }

  return <JobsFeedClient jobs={list} />;
}
