import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import {
  applications,
  employers,
  jobs,
  legalLogs,
  subscribers,
  workers,
} from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { AdminConsoleClient } from "@/components/admin-console-client";

export const metadata: Metadata = {
  title: "Admin Command Center",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const db = await getDb();

  const [
    workersList,
    jobsList,
    applicationsList,
    employersList,
    subscribersList,
    legalLogsList,
  ] = await Promise.all([
    db.select().from(workers).orderBy(desc(workers.createdAt)).limit(100),
    db.select().from(jobs).orderBy(desc(jobs.createdAt)).limit(100),
    db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt))
      .limit(100),
    db.select().from(employers).orderBy(desc(employers.createdAt)).limit(100),
    db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.createdAt))
      .limit(100),
    db
      .select()
      .from(legalLogs)
      .orderBy(desc(legalLogs.acceptedAt))
      .limit(100),
  ]);

  return (
    <AdminConsoleClient
      adminEmail={admin.email}
      workersList={workersList}
      jobsList={jobsList}
      applicationsList={applicationsList}
      employersList={employersList}
      subscribersList={subscribersList}
      legalLogsList={legalLogsList}
    />
  );
}
