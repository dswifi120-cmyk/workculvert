"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Ban,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Eye,
  FileCheck2,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  PhoneCall,
  PlusCircle,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type { Application, Employer, Job, Worker } from "@/db/schema";
import { BrandLogo } from "@/components/brand-logo";
import { LogoutButton } from "@/components/logout-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import {
  CATEGORY_OPTIONS,
  JOB_TYPE_OPTIONS,
  translateCategory,
  translateJobType,
} from "@/lib/categories";
import { cn, formatNumber, localizeDigits, timeAgo } from "@/lib/utils";

type SubscriberRow = {
  id: number;
  email: string;
  createdAt: string | Date;
};

type LegalLogRow = {
  id: number;
  userType: string;
  userPhone: string;
  documentType: string;
  ipAddress: string;
  acceptedAt: string | Date;
};

type AdminTab =
  | "overview"
  | "jobs"
  | "workers"
  | "applications"
  | "employers"
  | "subscribers";

export function AdminConsoleClient({
  adminEmail,
  workersList,
  jobsList,
  applicationsList,
  employersList,
  subscribersList,
  legalLogsList,
}: {
  adminEmail: string;
  workersList: Worker[];
  jobsList: Job[];
  applicationsList: Application[];
  employersList: Employer[];
  subscribersList: SubscriberRow[];
  legalLogsList: LegalLogRow[];
}) {
  const router = useRouter();
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [tab, setTab] = useState<AdminTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [workerFilter, setWorkerFilter] = useState<string>("all");
  const [busyKey, setBusyKey] = useState<string>("");
  const [toast, setToast] = useState<string>("");

  // Modals
  const [nidPreview, setNidPreview] = useState<{
    workerName: string;
    nidNumber: string;
    front: string;
    back: string;
    permanentAddr: string;
  } | null>(null);

  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [createJobOpen, setCreateJobOpen] = useState(false);

  const pendingWorkers = useMemo(
    () => workersList.filter((w) => w.status === "pending" || !w.isApproved),
    [workersList]
  );
  const approvedWorkers = useMemo(
    () => workersList.filter((w) => w.isApproved),
    [workersList]
  );
  const pendingJobs = useMemo(
    () => jobsList.filter((j) => !j.verifiedByAdmin && j.status !== "rejected"),
    [jobsList]
  );

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  }

  async function runAction(
    key: string,
    url: string,
    payload: Record<string, unknown>,
    successMsg: string
  ) {
    if (busyKey) return;
    setBusyKey(key);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        notify(json.error ?? (isEn ? "Action failed" : "অ্যাকশন সম্পন্ন হয়নি"));
        return;
      }
      notify(successMsg);
      router.refresh();
    } catch {
      notify(isEn ? "Network error" : "নেটওয়ার্ক সমস্যা");
    } finally {
      setBusyKey("");
    }
  }

  async function handleSaveJobEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingJob) return;
    const fd = new FormData(e.currentTarget);
    await runAction(
      `edit-job-${editingJob.id}`,
      `/api/admin/jobs/${editingJob.id}/manage`,
      {
        action: "edit",
        title: fd.get("title"),
        location: fd.get("location"),
        budget: fd.get("budget"),
        description: fd.get("description"),
      },
      isEn ? "Job updated!" : "কাজের তথ্য আপডেট হয়েছে!"
    );
    setEditingJob(null);
  }

  async function handleCreateAdminJob(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    await runAction(
      "create-admin-job",
      "/api/admin/jobs/create",
      {
        title: fd.get("title"),
        category: fd.get("category"),
        location: fd.get("location"),
        budget: fd.get("budget"),
        durationText: fd.get("durationText"),
        jobType: fd.get("jobType"),
        postedBy: fd.get("postedBy"),
        contactPhone: fd.get("contactPhone"),
        description: fd.get("description"),
        urgent: fd.get("urgent") === "on",
      },
      isEn
        ? "Verified job published live!"
        : "নতুন কাজ সরাসরি পাবলিক ফিডে প্রকাশিত হয়েছে!"
    );
    form.reset();
    setCreateJobOpen(false);
  }

  const filteredJobs = useMemo(() => {
    return jobsList.filter((j) => {
      if (jobFilter === "pending" && j.verifiedByAdmin) return false;
      if (jobFilter === "verified" && !j.verifiedByAdmin) return false;
      if (jobFilter === "assigned" && !j.assignedWorkerId) return false;
      if (jobFilter === "urgent" && !j.urgent) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          j.title.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.contactPhone.toLowerCase().includes(q) ||
          j.postedBy.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [jobsList, jobFilter, searchQuery]);

  const filteredWorkers = useMemo(() => {
    return workersList.filter((w) => {
      if (workerFilter === "pending" && w.isApproved) return false;
      if (workerFilter === "approved" && !w.isApproved) return false;
      if (workerFilter === "active" && !w.isActive) return false;
      if (workerFilter === "fresher" && !w.isFresher) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          w.fullName.toLowerCase().includes(q) ||
          w.phone.toLowerCase().includes(q) ||
          w.currentLocation.toLowerCase().includes(q) ||
          w.baseLocation.toLowerCase().includes(q) ||
          w.nidNumber.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [workersList, workerFilter, searchQuery]);

  const navTabs: { id: AdminTab; bn: string; en: string; badge?: number }[] = [
    { id: "overview", bn: "ওভারভিউ", en: "Overview" },
    {
      id: "jobs",
      bn: "কাজের পোস্ট (Jobs)",
      en: "Job Orders",
      badge: pendingJobs.length || undefined,
    },
    {
      id: "workers",
      bn: "কর্মী ও NID যাচাই",
      en: "Workers & NID",
      badge: pendingWorkers.length || undefined,
    },
    {
      id: "applications",
      bn: "কর্মীর আবেদন",
      en: "Applications",
      badge: applicationsList.length || undefined,
    },
    {
      id: "employers",
      bn: "নিয়োগদাতা (Employers)",
      en: "Employers",
    },
    {
      id: "subscribers",
      bn: "সাবস্ক্রাইবার ও আইনি লগ",
      en: "Leads & Audit Logs",
    },
  ];

  return (
    <main className="min-h-screen bg-paper pb-16">
      {/* Top Admin Command Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-paper shadow-lg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3.5">
            <Link href="/">
              <BrandLogo
                theme="dark"
                size="sm"
                subtitle={
                  isEn ? "Central Admin Control" : "সেন্ট্রাল অ্যাডমিন কন্ট্রোল"
                }
              />
            </Link>
            <span className="hidden rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-[11.5px] font-semibold text-mint md:inline-flex">
              {adminEmail}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCreateJobOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-pine px-4 py-2 text-xs font-bold text-paper transition-colors hover:bg-pine-dark sm:text-sm"
            >
              <PlusCircle size={15} />
              {isEn ? "Post Verified Job" : "সরাসরি কাজ পোস্ট"}
            </button>
            <LanguageSwitcher />
            <Link
              href="/"
              className="rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-paper/85 transition-colors hover:bg-white/10 sm:text-sm"
            >
              {isEn ? "Live Website ↗" : "ওয়েবসাইট দেখুন ↗"}
            </Link>
            <LogoutButton
              kind="admin"
              label={isEn ? "Logout" : "লগআউট"}
              className="inline-flex items-center gap-1.5 rounded-full bg-ochre px-4 py-2 text-xs font-bold text-ink transition-colors hover:bg-ochre-deep hover:text-white sm:text-sm"
            />
          </div>
        </div>

        {/* Section Tabs Bar */}
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 pb-2.5 pt-1">
            {navTabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-colors",
                  tab === item.id
                    ? "bg-ochre text-ink shadow"
                    : "text-paper/75 hover:bg-white/10 hover:text-paper"
                )}
              >
                <span>{isEn ? item.en : item.bn}</span>
                {item.badge ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10.5px] font-extrabold leading-none",
                      tab === item.id
                        ? "bg-ink text-ochre"
                        : "bg-brick text-white"
                    )}
                  >
                    {localizeDigits(item.badge, locale)}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Floating Feedback Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl border border-pine/30 bg-pine-deep px-5 py-3.5 text-sm font-bold text-mint shadow-2xl">
          <CheckCircle2 size={17} />
          <span>{toast}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6">
        {/* Global Search Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-3.5 shadow-sm">
          <div className="relative min-w-[240px] flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? "Search by name, phone, NID number, job title, or city..."
                  : "নাম, ফোন নম্বর, NID নম্বর, কাজের নাম বা এলাকা লিখে খুঁজুন..."
              }
              className="w-full rounded-xl border border-line bg-paper/70 py-2.5 pl-10 pr-4 text-[14px] text-ink outline-none focus:border-pine"
            />
          </div>
          <p className="text-[12.5px] font-medium text-mist">
            {isEn
              ? "100% Connected to Live Website Database"
              : "লাইভ ওয়েবসাইটের সকল ফর্মের সাথে সরাসরি সংযুক্ত"}
          </p>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              icon: Briefcase,
              label: isEn ? "Total Jobs" : "মোট কাজ",
              val: jobsList.length,
              sub: `${pendingJobs.length} pending`,
              onClick: () => setTab("jobs"),
            },
            {
              icon: Users,
              label: isEn ? "Total Workers" : "মোট কর্মী",
              val: workersList.length,
              sub: `${pendingWorkers.length} pending NID`,
              onClick: () => setTab("workers"),
            },
            {
              icon: UserCheck,
              label: isEn ? "Active Workers" : "সক্রিয় কর্মী",
              val: workersList.filter((w) => w.isActive).length,
              sub: `${approvedWorkers.length} approved`,
              onClick: () => {
                setWorkerFilter("active");
                setTab("workers");
              },
            },
            {
              icon: ClipboardCheck,
              label: isEn ? "Job Applications" : "কর্মীর আবেদন",
              val: applicationsList.length,
              sub: isEn ? "1-click assign" : "ওয়ান-ক্লিক অ্যাসাইন",
              onClick: () => setTab("applications"),
            },
            {
              icon: UserRound,
              label: isEn ? "OTP Employers" : "নিয়োগদাতা",
              val: employersList.length,
              sub: isEn ? "Phone verified" : "OTP যাচাইকৃত",
              onClick: () => setTab("employers"),
            },
            {
              icon: Mail,
              label: isEn ? "Leads & Consent" : "ইমেইল ও আইনি লগ",
              val: subscribersList.length + legalLogsList.length,
              sub: `${subscribersList.length} emails`,
              onClick: () => setTab("subscribers"),
            },
          ].map((k) => (
            <button
              key={k.label}
              type="button"
              onClick={k.onClick}
              className="shadow-card flex flex-col items-start rounded-2xl border border-line bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-pine/40"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-tint text-pine">
                <k.icon size={18} />
              </span>
              <p className="mt-3 text-2xl font-bold text-ink">
                {localizeDigits(k.val, locale)}
              </p>
              <p className="text-[12.5px] font-semibold text-ink">{k.label}</p>
              <p className="text-[11px] text-faint">{k.sub}</p>
            </button>
          ))}
        </div>

        {/* ================= OVERVIEW TAB ================= */}
        {tab === "overview" && (
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {/* Pending Worker Approvals Quick Queue */}
            <section className="shadow-card rounded-3xl border border-line bg-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-pine">
                    {isEn ? "Action Needed" : "দ্রুত অনুমোদন কিউ"}
                  </p>
                  <h2 className="text-lg font-bold text-ink">
                    {isEn
                      ? "Pending Worker & NID Verifications"
                      : "নতুন কর্মী ও NID যাচাই কিউ"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("workers")}
                  className="text-xs font-bold text-pine hover:underline"
                >
                  {isEn ? "View all →" : "সব দেখুন →"}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {pendingWorkers.slice(0, 5).map((w) => (
                  <div
                    key={w.id}
                    className="rounded-2xl border border-line bg-paper/65 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="font-bold text-ink">{w.fullName}</p>
                          {w.isFresher && (
                            <span className="rounded-full bg-ochre-soft px-2 py-0.5 text-[10px] font-bold text-ochre-deep">
                              Fresher
                            </span>
                          )}
                          {w.nidNumber && (
                            <span className="rounded-full bg-tint px-2 py-0.5 text-[10px] font-bold text-pine">
                              NID: {w.nidNumber}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[12.5px] text-mist">
                          {translateCategory(w.category, locale)} •{" "}
                          {w.currentLocation} • {w.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(w.nidFrontImage || w.nidBackImage) && (
                          <button
                            type="button"
                            onClick={() =>
                              setNidPreview({
                                workerName: w.fullName,
                                nidNumber: w.nidNumber,
                                front: w.nidFrontImage,
                                back: w.nidBackImage,
                                permanentAddr: w.permanentAddress,
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-bold text-ink hover:border-pine"
                          >
                            <Eye size={13} /> NID
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busyKey === `w-app-${w.id}`}
                          onClick={() =>
                            void runAction(
                              `w-app-${w.id}`,
                              `/api/admin/workers/${w.id}/manage`,
                              { action: "approve" },
                              isEn ? "Worker approved!" : "কর্মী অনুমোদিত হয়েছে!"
                            )
                          }
                          className="rounded-full bg-pine px-3.5 py-1.5 text-xs font-bold text-paper hover:bg-pine-dark"
                        >
                          {isEn ? "Approve" : "অনুমোদন"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingWorkers.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-line py-8 text-center text-sm text-mist">
                    {isEn
                      ? "All worker signups are reviewed!"
                      : "কোনো পেন্ডিং কর্মী সাইনআপ নেই।"}
                  </p>
                )}
              </div>
            </section>

            {/* Pending Jobs Quick Queue */}
            <section className="shadow-card rounded-3xl border border-line bg-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ochre-deep">
                    {isEn ? "New Work Orders" : "নতুন কাজের অর্ডার"}
                  </p>
                  <h2 className="text-lg font-bold text-ink">
                    {isEn
                      ? "Jobs Waiting for Admin Verification"
                      : "ভেরিফিকেশনের অপেক্ষায় থাকা কাজ"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("jobs")}
                  className="text-xs font-bold text-pine hover:underline"
                >
                  {isEn ? "Manage all jobs →" : "সব কাজ ম্যানেজ করুন →"}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {pendingJobs.slice(0, 5).map((j) => (
                  <div
                    key={j.id}
                    className="rounded-2xl border border-line bg-paper/65 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-ink">{j.title}</p>
                          {j.urgent && (
                            <span className="rounded-full bg-brick-soft px-2 py-0.5 text-[10px] font-bold text-brick">
                              URGENT
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[12.5px] text-mist">
                          {translateCategory(j.category, locale)} • {j.location}{" "}
                          • ৳{formatNumber(j.budget, 0, !isEn)} •{" "}
                          {j.contactPhone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            void runAction(
                              `j-ver-${j.id}`,
                              `/api/admin/jobs/${j.id}/manage`,
                              { action: "verify" },
                              isEn
                                ? "Job verified & published!"
                                : "কাজটি ভেরিফাই হয়ে লাইভ ফিডে গেছে!"
                            )
                          }
                          className="rounded-full bg-pine px-3.5 py-1.5 text-xs font-bold text-paper hover:bg-pine-dark"
                        >
                          {isEn ? "Verify & Publish" : "পাবলিশ করুন"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void runAction(
                              `j-rej-${j.id}`,
                              `/api/admin/jobs/${j.id}/manage`,
                              { action: "reject" },
                              isEn ? "Job rejected" : "কাজটি বাতিল করা হয়েছে"
                            )
                          }
                          className="rounded-full border border-brick/25 bg-brick-soft px-3 py-1.5 text-xs font-bold text-brick"
                        >
                          {isEn ? "Reject" : "বাতিল"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingJobs.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-line py-8 text-center text-sm text-mist">
                    {isEn
                      ? "No unverified job posts waiting right now."
                      : "এখন কোনো আন-ভেরিফায়েড কাজের পোস্ট অপেক্ষায় নেই।"}
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ================= JOBS MANAGEMENT TAB ================= */}
        {tab === "jobs" && (
          <section className="mt-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", bn: "সব কাজ", en: "All Jobs" },
                  { id: "pending", bn: "পেন্ডিং রিভিউ", en: "Pending Review" },
                  { id: "verified", bn: "লাইভ / ভেরিফায়েড", en: "Verified Live" },
                  { id: "assigned", bn: "অ্যাসাইনড", en: "Assigned" },
                  { id: "urgent", bn: "জরুরি (Urgent)", en: "Urgent" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setJobFilter(f.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
                      jobFilter === f.id
                        ? "border-pine bg-pine text-paper"
                        : "border-line bg-card text-mist hover:text-ink"
                    )}
                  >
                    {isEn ? f.en : f.bn}
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-mist">
                {filteredJobs.length} {isEn ? "orders shown" : "টি কাজ দেখানো হচ্ছে"}
              </span>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const assignedWorker = workersList.find(
                  (w) => w.id === job.assignedWorkerId
                );
                return (
                  <article
                    key={job.id}
                    className="shadow-card rounded-3xl border border-line bg-card p-5"
                  >
                    <div className="grid gap-5 lg:grid-cols-[1.45fr_0.9fr]">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-latin text-xs font-bold text-faint">
                            #{job.id}
                          </span>
                          <h3 className="text-[17px] font-bold text-ink">
                            {job.title}
                          </h3>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                              job.status === "rejected"
                                ? "bg-brick-soft text-brick"
                                : job.status === "completed"
                                  ? "bg-pine text-paper"
                                  : job.verifiedByAdmin
                                    ? "bg-tint text-pine"
                                    : "bg-ochre-soft text-ochre-deep"
                            )}
                          >
                            {job.status}
                          </span>
                          {job.urgent && (
                            <span className="rounded-full bg-brick px-2 py-0.5 text-[10px] font-bold text-white">
                              URGENT
                            </span>
                          )}
                        </div>

                        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mist">
                          <span className="font-semibold text-pine">
                            {translateCategory(job.category, locale)}
                          </span>
                          <span>• {translateJobType(job.jobType, locale)}</span>
                          <span>• {job.durationText}</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-river" />{" "}
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <PhoneCall size={13} className="text-pine" />{" "}
                            {job.contactPhone || "—"} ({job.postedBy})
                          </span>
                        </p>

                        <p className="mt-2.5 rounded-xl border border-line bg-paper/60 p-3 text-[13px] leading-relaxed text-ink">
                          {job.description ||
                            (isEn
                              ? "No extra description."
                              : "অতিরিক্ত কোনো বিবরণ দেওয়া হয়নি।")}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-4">
                          <p className="text-xl font-bold text-ink">
                            ৳{formatNumber(job.budget, 0, !isEn)}
                          </p>
                          <span className="text-xs text-faint">
                            {timeAgo(job.createdAt, locale)}
                          </span>
                          {job.contactPhone && (
                            <a
                              href={`tel:${job.contactPhone}`}
                              className="text-xs font-bold text-pine hover:underline"
                            >
                              📞 {isEn ? "Call Employer" : "নিয়োগদাতাকে কল"}
                            </a>
                          )}
                        </div>

                        {assignedWorker && (
                          <div className="mt-3 rounded-2xl border border-river/25 bg-rivertint/50 px-3.5 py-2.5 text-[12.5px]">
                            <span className="font-bold text-river">
                              {isEn ? "Assigned Worker:" : "অ্যাসাইন করা কর্মী:"}{" "}
                              {assignedWorker.fullName} ({assignedWorker.phone})
                            </span>{" "}
                            • Response:{" "}
                            <strong className="uppercase">
                              {job.workerResponse}
                            </strong>
                          </div>
                        )}
                      </div>

                      {/* Right Controls Column */}
                      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-paper/55 p-4">
                        <div className="flex flex-wrap gap-2">
                          {!job.verifiedByAdmin ? (
                            <button
                              type="button"
                              onClick={() =>
                                void runAction(
                                  `ver-${job.id}`,
                                  `/api/admin/jobs/${job.id}/manage`,
                                  { action: "verify" },
                                  isEn
                                    ? "Published to live site!"
                                    : "পাবলিক ফিডে প্রকাশিত হয়েছে!"
                                )
                              }
                              className="flex-1 rounded-xl bg-pine py-2 text-xs font-bold text-paper hover:bg-pine-dark"
                            >
                              ✓ {isEn ? "Verify & Publish" : "ভেরিফাই ও পাবলিশ"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                void runAction(
                                  `unpub-${job.id}`,
                                  `/api/admin/jobs/${job.id}/manage`,
                                  { action: "unpublish" },
                                  isEn
                                    ? "Moved back to draft"
                                    : "লাইভ ফিড থেকে সরানো হয়েছে"
                                )
                              }
                              className="flex-1 rounded-xl border border-line bg-card py-2 text-xs font-bold text-mist hover:text-ink"
                            >
                              {isEn ? "Hide from Feed" : "ফিড থেকে লুকান"}
                            </button>
                          )}

                          {job.status !== "completed" && (
                            <button
                              type="button"
                              onClick={() =>
                                void runAction(
                                  `comp-${job.id}`,
                                  `/api/admin/jobs/${job.id}/manage`,
                                  { action: "complete" },
                                  isEn
                                    ? "Marked as completed!"
                                    : "কাজটি সম্পন্ন হিসেবে মার্ক করা হয়েছে!"
                                )
                              }
                              className="rounded-xl border border-pine/30 bg-tint px-3 py-2 text-xs font-bold text-pine"
                            >
                              {isEn ? "Mark Completed" : "সম্পন্ন"}
                            </button>
                          )}
                        </div>

                        {/* Assign Worker Selector */}
                        <div className="space-y-1.5">
                          <label className="block text-[11.5px] font-bold text-mist">
                            {isEn
                              ? "Assign / Dispatch Approved Worker:"
                              : "অনুমোদিত কর্মী অ্যাসাইন করুন:"}
                          </label>
                          <div className="flex gap-1.5">
                            <select
                              id={`assign-select-${job.id}`}
                              defaultValue={job.assignedWorkerId ?? ""}
                              className="min-w-0 flex-1 rounded-xl border border-line bg-card px-2.5 py-2 text-xs text-ink outline-none focus:border-pine"
                            >
                              <option value="">
                                {isEn
                                  ? "— Unassigned —"
                                  : "— কর্মী নির্বাচন করুন —"}
                              </option>
                              {approvedWorkers.map((w) => (
                                <option key={w.id} value={w.id}>
                                  {w.fullName} · {w.currentLocation}{" "}
                                  {w.isActive ? "🟢" : "⚪"}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                const sel = document.getElementById(
                                  `assign-select-${job.id}`
                                ) as HTMLSelectElement | null;
                                void runAction(
                                  `asg-${job.id}`,
                                  `/api/admin/jobs/${job.id}/manage`,
                                  {
                                    action: "assign",
                                    workerId: sel?.value ?? "",
                                  },
                                  isEn
                                    ? "Worker assignment updated!"
                                    : "কর্মী অ্যাসাইনমেন্ট আপডেট হয়েছে!"
                                );
                              }}
                              className="shrink-0 rounded-xl bg-ink px-3 py-2 text-xs font-bold text-paper hover:bg-pine"
                            >
                              <Send size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Edit & Delete Row */}
                        <div className="flex items-center justify-end gap-2 border-t border-line pt-2.5">
                          <button
                            type="button"
                            onClick={() => setEditingJob(job)}
                            className="inline-flex items-center gap-1 rounded-lg border border-line bg-card px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-pine"
                          >
                            <Pencil size={12} /> {isEn ? "Edit" : "এডিট"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  isEn
                                    ? "Delete this job order permanently?"
                                    : "এই কাজের অর্ডারটি স্থায়ীভাবে ডিলিট করতে চান?"
                                )
                              ) {
                                void runAction(
                                  `del-job-${job.id}`,
                                  `/api/admin/jobs/${job.id}/manage`,
                                  { action: "delete" },
                                  isEn ? "Job deleted" : "ডিলিট হয়েছে"
                                );
                              }
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-brick/25 bg-brick-soft px-2.5 py-1.5 text-xs font-semibold text-brick hover:bg-brick hover:text-white"
                          >
                            <Trash2 size={12} /> {isEn ? "Delete" : "ডিলিট"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= WORKERS & NID VERIFICATION TAB ================= */}
        {tab === "workers" && (
          <section className="mt-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", bn: "সব কর্মী", en: "All Workers" },
                  {
                    id: "pending",
                    bn: "পেন্ডিং NID অনুমোদন",
                    en: "Pending Approval",
                  },
                  { id: "approved", bn: "অনুমোদিত", en: "Approved" },
                  { id: "active", bn: "সক্রিয় (Active)", en: "Active Now" },
                  { id: "fresher", bn: "ফ্রেশার কর্মী", en: "Freshers" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setWorkerFilter(f.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
                      workerFilter === f.id
                        ? "border-pine bg-pine text-paper"
                        : "border-line bg-card text-mist hover:text-ink"
                    )}
                  >
                    {isEn ? f.en : f.bn}
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-mist">
                {filteredWorkers.length}{" "}
                {isEn ? "workers shown" : "জন কর্মী দেখানো হচ্ছে"}
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {filteredWorkers.map((w) => {
                let skills: string[] = [w.category];
                try {
                  const parsed = JSON.parse(w.skillsList || "[]");
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    skills = Array.from(new Set([w.category, ...parsed]));
                  }
                } catch {
                  skills = [w.category];
                }

                return (
                  <article
                    key={w.id}
                    className="shadow-card flex flex-col justify-between rounded-3xl border border-line bg-card p-5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-[17px] font-bold text-ink">
                              {w.fullName}
                            </h3>
                            {w.isFresher && (
                              <span className="rounded-full bg-ochre-soft px-2 py-0.5 text-[10.5px] font-bold text-ochre-deep">
                                🌱 Fresher
                              </span>
                            )}
                            {w.nidNameMatch && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-tint px-2 py-0.5 text-[10.5px] font-bold text-pine">
                                <BadgeCheck size={11} /> NID Matched
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[13px] font-semibold text-pine">
                            📞 {w.phone} ·{" "}
                            {w.isFresher
                              ? isEn
                                ? "Fresher (0 yrs)"
                                : "ফ্রেশার"
                              : `${localizeDigits(w.experienceYears, locale)} ${
                                  isEn ? "yrs exp" : "বছর অভিজ্ঞতা"
                                }`}
                          </p>
                        </div>

                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-bold",
                            w.isApproved
                              ? w.isActive
                                ? "bg-pine text-paper"
                                : "bg-tint text-pine"
                              : w.status === "rejected" ||
                                  w.status === "suspended"
                                ? "bg-brick-soft text-brick"
                                : "bg-ochre-soft text-ochre-deep"
                          )}
                        >
                          {w.isApproved
                            ? w.isActive
                              ? "Approved · Active"
                              : "Approved · Offline"
                            : w.status}
                        </span>
                      </div>

                      {/* Multi-skills chips */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {skills.map((sk) => (
                          <span
                            key={sk}
                            className="rounded-full border border-line bg-paper px-2.5 py-0.5 text-[11.5px] font-semibold text-ink"
                          >
                            {translateCategory(sk, locale)}
                          </span>
                        ))}
                      </div>

                      {/* NID & Address Details Box */}
                      <div className="mt-3 space-y-1 rounded-2xl border border-line bg-paper/65 p-3 text-[12.5px] text-mist">
                        <p>
                          <strong className="text-ink">
                            <CreditCard size={12} className="mr-1 inline" />
                            NID No:
                          </strong>{" "}
                          {w.nidNumber || "—"} ·{" "}
                          <strong className="text-ink">NID District:</strong>{" "}
                          {w.baseLocation}
                        </p>
                        <p>
                          <strong className="text-ink">
                            Current Living City:
                          </strong>{" "}
                          {w.currentLocation} ·{" "}
                          <strong className="text-ink">Preferred Areas:</strong>{" "}
                          {w.preferredAreas || w.currentLocation}
                        </p>
                        {w.permanentAddress && (
                          <p>
                            <strong className="text-ink">
                              Permanent Addr:
                            </strong>{" "}
                            {w.permanentAddress}
                          </p>
                        )}
                        {w.presentAddress && (
                          <p>
                            <strong className="text-ink">Present Addr:</strong>{" "}
                            {w.presentAddress}
                          </p>
                        )}
                      </div>

                      {/* NID Front & Back Thumbnails */}
                      {(w.nidFrontImage || w.nidBackImage) && (
                        <div className="mt-3 flex items-center gap-3">
                          {w.nidFrontImage && (
                            <button
                              type="button"
                              onClick={() =>
                                setNidPreview({
                                  workerName: w.fullName,
                                  nidNumber: w.nidNumber,
                                  front: w.nidFrontImage,
                                  back: w.nidBackImage,
                                  permanentAddr: w.permanentAddress,
                                })
                              }
                              className="group relative h-16 w-28 overflow-hidden rounded-xl border border-line bg-paper"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={w.nidFrontImage}
                                alt="NID Front"
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                              <span className="absolute inset-x-0 bottom-0 bg-ink/75 py-0.5 text-[9.5px] font-bold text-white">
                                🔍 NID Front
                              </span>
                            </button>
                          )}
                          {w.nidBackImage && (
                            <button
                              type="button"
                              onClick={() =>
                                setNidPreview({
                                  workerName: w.fullName,
                                  nidNumber: w.nidNumber,
                                  front: w.nidFrontImage,
                                  back: w.nidBackImage,
                                  permanentAddr: w.permanentAddress,
                                })
                              }
                              className="group relative h-16 w-28 overflow-hidden rounded-xl border border-line bg-paper"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={w.nidBackImage}
                                alt="NID Back"
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                              <span className="absolute inset-x-0 bottom-0 bg-ink/75 py-0.5 text-[9.5px] font-bold text-white">
                                🔍 NID Back
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Worker Action Buttons */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3.5">
                      {!w.isApproved ? (
                        <button
                          type="button"
                          onClick={() =>
                            void runAction(
                              `app-${w.id}`,
                              `/api/admin/workers/${w.id}/manage`,
                              { action: "approve" },
                              isEn
                                ? "Worker approved & activated!"
                                : "কর্মী অনুমোদিত ও সক্রিয় হয়েছেন!"
                            )
                          }
                          className="rounded-full bg-pine px-4 py-2 text-xs font-bold text-paper hover:bg-pine-dark"
                        >
                          ✓ {isEn ? "Approve Worker" : "অনুমোদন দিন"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            void runAction(
                              `act-${w.id}`,
                              `/api/admin/workers/${w.id}/manage`,
                              {
                                action: w.isActive ? "deactivate" : "activate",
                              },
                              isEn ? "Status updated!" : "স্ট্যাটাস আপডেট হয়েছে!"
                            )
                          }
                          className="rounded-full border border-pine/30 bg-tint px-3.5 py-1.5 text-xs font-bold text-pine"
                        >
                          {w.isActive
                            ? isEn
                              ? "Set Offline"
                              : "অফলাইন করুন"
                            : isEn
                              ? "Set Active"
                              : "অ্যাক্টিভ করুন"}
                        </button>
                      )}

                      {w.status !== "suspended" && (
                        <button
                          type="button"
                          onClick={() =>
                            void runAction(
                              `susp-${w.id}`,
                              `/api/admin/workers/${w.id}/manage`,
                              { action: "suspend" },
                              isEn
                                ? "Worker suspended"
                                : "কর্মীর অ্যাকাউন্ট স্থগিত করা হয়েছে"
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-full border border-brick/25 bg-brick-soft px-3 py-1.5 text-xs font-bold text-brick"
                        >
                          <Ban size={12} />{" "}
                          {isEn ? "Suspend / Reject" : "স্থগিত/বাতিল"}
                        </button>
                      )}

                      <a
                        href={`tel:${w.phone}`}
                        className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink hover:border-pine"
                      >
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${w.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-pine hover:border-pine"
                      >
                        WhatsApp
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              isEn
                                ? "Delete this worker profile permanently?"
                                : "এই কর্মী প্রোফাইল স্থায়ীভাবে মুছে ফেলতে চান?"
                            )
                          ) {
                            void runAction(
                              `del-w-${w.id}`,
                              `/api/admin/workers/${w.id}/manage`,
                              { action: "delete" },
                              isEn ? "Worker deleted" : "প্রোফাইল ডিলিট হয়েছে"
                            );
                          }
                        }}
                        className="ml-auto rounded-lg p-1.5 text-mist hover:bg-brick-soft hover:text-brick"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= WORKER JOB APPLICATIONS TAB (NEWLY WIRED) ================= */}
        {tab === "applications" && (
          <section className="shadow-card mt-7 rounded-3xl border border-line bg-card p-6">
            <h2 className="text-xl font-bold text-ink">
              {isEn
                ? "Worker Job Applications (1-Click Accept & Assign)"
                : "লাইভ ফিডের কাজে কর্মীদের আবেদনসমূহ"}
            </h2>
            <p className="mt-1 text-sm text-mist">
              {isEn
                ? "Whenever an approved worker clicks 'Apply' on any job card on the website, it appears here so you can assign them immediately."
                : "ওয়েবসাইটের কাজের কার্ডে কোনো কর্মী 'আবেদন করুন' বাটনে ক্লিক করলে সেই আবেদন সরাসরি এখানে চলে আসে।"}
            </p>

            <div className="mt-5 space-y-3">
              {applicationsList.length > 0 ? (
                applicationsList.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-paper/65 p-4"
                  >
                    <div>
                      <p className="text-[15.5px] font-bold text-ink">
                        {app.jobTitle}{" "}
                        <span className="text-xs font-normal text-faint">
                          (Job #{app.jobId})
                        </span>
                      </p>
                      <p className="mt-1 text-[13px] text-mist">
                        <strong>
                          {isEn ? "Applicant:" : "আবেদনকারী কর্মী:"}
                        </strong>{" "}
                        {app.applicantName} • 📞 {app.applicantEmail} •{" "}
                        {timeAgo(app.createdAt, locale)}
                      </p>
                      <span className="mt-1.5 inline-block rounded-full bg-tint px-2.5 py-0.5 text-[11px] font-bold text-pine">
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          void runAction(
                            `app-acc-${app.id}`,
                            `/api/admin/applications/${app.id}/manage`,
                            { action: "accept_and_assign" },
                            isEn
                              ? "Application accepted & job assigned to worker!"
                              : "আবেদন গৃহীত হয়েছে এবং কাজটি ঐ কর্মীকে অ্যাসাইন করা হয়েছে!"
                          )
                        }
                        className="rounded-full bg-pine px-4 py-2 text-xs font-bold text-paper hover:bg-pine-dark"
                      >
                        ✓ {isEn ? "Accept & Assign Job" : "গ্রহণ ও কাজ অ্যাসাইন"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void runAction(
                            `app-rej-${app.id}`,
                            `/api/admin/applications/${app.id}/manage`,
                            { action: "reject" },
                            isEn ? "Application rejected" : "আবেদন বাতিল হয়েছে"
                          )
                        }
                        className="rounded-full border border-brick/25 bg-brick-soft px-3.5 py-2 text-xs font-bold text-brick"
                      >
                        {isEn ? "Decline" : "বাতিল"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-line py-12 text-center text-sm text-mist">
                  {isEn
                    ? "No worker job applications submitted yet."
                    : "এখনো কোনো কর্মী কাজের কার্ডে আবেদন করেননি।"}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ================= EMPLOYERS DIRECTORY TAB ================= */}
        {tab === "employers" && (
          <section className="shadow-card mt-7 rounded-3xl border border-line bg-card p-6">
            <h2 className="text-xl font-bold text-ink">
              {isEn
                ? "OTP-Verified Employers Directory"
                : "OTP যাচাইকৃত নিয়োগদাতা তালিকা"}
            </h2>
            <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {employersList.map((e) => (
                <div
                  key={e.id}
                  className="rounded-2xl border border-line bg-paper/65 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-ink">{e.fullName}</p>
                    <span className="rounded-full bg-tint px-2 py-0.5 text-[10.5px] font-bold text-pine">
                      {e.isPhoneVerified ? "OTP Verified" : "Unverified"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] text-mist">📞 {e.phone}</p>
                  <p className="text-[12.5px] text-mist">📍 {e.location}</p>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={`tel:${e.phone}`}
                      className="rounded-full border border-line bg-card px-3 py-1 text-xs font-semibold text-pine"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${e.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-line bg-card px-3 py-1 text-xs font-semibold text-ink"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= SUBSCRIBERS & LEGAL AUDIT LOGS TAB ================= */}
        {tab === "subscribers" && (
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <section className="shadow-card rounded-3xl border border-line bg-card p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <Mail size={18} className="text-pine" />
                {isEn
                  ? "Landing Page Email Subscribers"
                  : "ল্যান্ডিং পেজ ইমেইল সাবস্ক্রাইবার"}
              </h2>
              <div className="mt-4 space-y-2">
                {subscribersList.length > 0 ? (
                  subscribersList.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-xl border border-line bg-paper/65 px-3.5 py-2.5 text-sm"
                    >
                      <span className="font-medium text-ink">{s.email}</span>
                      <span className="text-xs text-faint">
                        {timeAgo(new Date(s.createdAt), locale)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-line py-8 text-center text-sm text-mist">
                    {isEn ? "No email subscribers yet." : "এখনো কোনো ইমেইল জমা পড়েনি।"}
                  </p>
                )}
              </div>
            </section>

            <section className="shadow-card rounded-3xl border border-line bg-card p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <FileCheck2 size={18} className="text-pine" />
                {isEn
                  ? "Terms & Legal Consent Audit Logs"
                  : "শর্তাবলী সম্মতি ও আইনি অডিট লগ"}
              </h2>
              <div className="mt-4 space-y-2">
                {legalLogsList.length > 0 ? (
                  legalLogsList.map((l) => (
                    <div
                      key={l.id}
                      className="rounded-xl border border-line bg-paper/65 px-3.5 py-2.5 text-xs text-mist"
                    >
                      <div className="flex items-center justify-between font-bold text-ink">
                        <span className="uppercase">{l.userType}</span>
                        <span>{l.userPhone}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-faint">
                        IP: {l.ipAddress} ·{" "}
                        {timeAgo(new Date(l.acceptedAt), locale)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-line py-8 text-center text-sm text-mist">
                    {isEn ? "No legal consent logs yet." : "এখনো কোনো লগ নেই।"}
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* ================= NID FULL-SCREEN ZOOM MODAL ================= */}
      {nidPreview && (
        <div
          onClick={() => setNidPreview(null)}
          className="fixed inset-0 z-[90] grid place-items-center bg-ink/75 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="shadow-lift max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-line bg-card p-6"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                  <ShieldCheck size={19} className="text-pine" />
                  {nidPreview.workerName} — NID Verification
                </h3>
                <p className="text-xs text-mist">
                  NID No: <strong>{nidPreview.nidNumber || "—"}</strong>{" "}
                  {nidPreview.permanentAddr &&
                    `· Address: ${nidPreview.permanentAddr}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNidPreview(null)}
                className="grid size-8 place-items-center rounded-full border border-line text-mist hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-pine">
                  NID Front Side
                </p>
                {nidPreview.front ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={nidPreview.front}
                    alt="NID Front"
                    className="w-full rounded-2xl border border-line object-contain"
                  />
                ) : (
                  <p className="text-sm text-mist">Not uploaded</p>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-pine">
                  NID Back Side
                </p>
                {nidPreview.back ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={nidPreview.back}
                    alt="NID Back"
                    className="w-full rounded-2xl border border-line object-contain"
                  />
                ) : (
                  <p className="text-sm text-mist">Not uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT JOB MODAL ================= */}
      {editingJob && (
        <div
          onClick={() => setEditingJob(null)}
          className="fixed inset-0 z-[90] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm"
        >
          <form
            onSubmit={handleSaveJobEdit}
            onClick={(e) => e.stopPropagation()}
            className="shadow-lift w-full max-w-lg space-y-4 rounded-3xl border border-line bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">
                {isEn ? "Edit Job Order" : "কাজের তথ্য এডিট করুন"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="grid size-8 place-items-center rounded-full border border-line"
              >
                <X size={15} />
              </button>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-mist">
                Title
              </label>
              <input
                name="title"
                required
                defaultValue={editingJob.title}
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-mist">
                  Location
                </label>
                <input
                  name="location"
                  required
                  defaultValue={editingJob.location}
                  className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-mist">
                  Budget (৳)
                </label>
                <input
                  name="budget"
                  type="number"
                  required
                  defaultValue={editingJob.budget}
                  className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-mist">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={editingJob.description}
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-pine py-3 text-sm font-bold text-paper hover:bg-pine-dark"
            >
              {isEn ? "Save Changes" : "আপডেট সেভ করুন"}
            </button>
          </form>
        </div>
      )}

      {/* ================= DIRECT ADMIN JOB POST MODAL ================= */}
      {createJobOpen && (
        <div
          onClick={() => setCreateJobOpen(false)}
          className="fixed inset-0 z-[90] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm"
        >
          <form
            onSubmit={handleCreateAdminJob}
            onClick={(e) => e.stopPropagation()}
            className="shadow-lift max-h-[90vh] w-full max-w-xl space-y-3.5 overflow-y-auto rounded-3xl border border-line bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">
                {isEn
                  ? "Publish Verified Job Directly to Website"
                  : "ফোনে পাওয়া অর্ডার সরাসরি ওয়েবসাইটে প্রকাশ করুন"}
              </h3>
              <button
                type="button"
                onClick={() => setCreateJobOpen(false)}
                className="grid size-8 place-items-center rounded-full border border-line"
              >
                <X size={15} />
              </button>
            </div>

            <input
              name="title"
              required
              placeholder={
                isEn
                  ? "Work Title (e.g. AC Servicing in Uttara)"
                  : "কাজের শিরোনাম (যেমন: উত্তরায় এসি সার্ভিসিং)"
              }
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                name="category"
                required
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {isEn ? c.en : c.bn}
                  </option>
                ))}
              </select>
              <select
                name="jobType"
                required
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
              >
                {JOB_TYPE_OPTIONS.map((jt) => (
                  <option key={jt.value} value={jt.value}>
                    {isEn ? jt.en : jt.bn}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <input
                name="location"
                required
                placeholder={isEn ? "Location / Area" : "এলাকা / শহর"}
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
              />
              <input
                name="budget"
                type="number"
                required
                placeholder={isEn ? "Budget (৳)" : "বাজেট (৳)"}
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
              />
              <input
                name="durationText"
                placeholder={isEn ? "Duration (e.g. 1 day)" : "মেয়াদ (যেমন: ১ দিন)"}
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="postedBy"
                placeholder={isEn ? "Client Name" : "ক্লায়েন্টের নাম"}
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
              />
              <input
                name="contactPhone"
                placeholder={isEn ? "Client Phone" : "ক্লায়েন্টের ফোন নম্বর"}
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
              />
            </div>

            <textarea
              name="description"
              rows={3}
              placeholder={isEn ? "Job details..." : "কাজের বিস্তারিত বিবরণ..."}
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
            />

            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              <input type="checkbox" name="urgent" className="size-4" />
              {isEn ? "Mark as Urgent" : "জরুরি কাজ (Urgent ব্যাজ)"}
            </label>

            <button
              type="submit"
              disabled={busyKey === "create-admin-job"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-pine py-3 text-sm font-bold text-paper hover:bg-pine-dark"
            >
              {busyKey === "create-admin-job" ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <>
                  <PlusCircle size={16} />
                  {isEn ? "Publish Live Now" : "এখনই লাইভ প্রকাশ করুন"}
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
