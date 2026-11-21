import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { jobs, type Job } from "@/db/schema";
import {
  getTabInfo,
  matchesTabCategory,
  type CategoryTabSlug,
} from "@/lib/categories";
import { CategoryWorkView } from "@/components/category-work-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const info = getTabInfo(slug);
  if (!info) {
    return { title: "Work Category" };
  }
  return {
    title: `${info.en} · ${info.bn}`,
    description: info.descriptionBn,
  };
}

export default async function CategoryWorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { slug } = await params;
  const { category } = await searchParams;
  const info = getTabInfo(slug);
  if (!info) {
    notFound();
  }

  let verifiedJobs: Job[] = [];
  try {
    const db = await getDb();
    const allVerified = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.verifiedByAdmin, true), eq(jobs.status, "verified")))
      .orderBy(desc(jobs.createdAt))
      .limit(30);

    verifiedJobs = allVerified
      .filter((j) => matchesTabCategory(j.category, info.slug as CategoryTabSlug))
      .slice(0, 8);
  } catch {
    verifiedJobs = [];
  }

  return (
    <CategoryWorkView
      tabSlug={info.slug as CategoryTabSlug}
      initialCategoryQuery={category}
      jobs={verifiedJobs}
    />
  );
}
