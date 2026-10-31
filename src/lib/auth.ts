import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { adminSessions, workerSessions, workers } from "@/db/schema";
import { expiresInDays, randomToken } from "@/lib/security";

export const WORKER_SESSION_COOKIE = "wc_worker_session";
export const ADMIN_SESSION_COOKIE = "wc_admin_session";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@workculvert.com";
export const ADMIN_OTP_CODE = process.env.ADMIN_OTP_CODE ?? "246810";

export async function createWorkerSession(workerId: number) {
  const token = randomToken();
  const expiresAt = expiresInDays(21);
  await db.insert(workerSessions).values({ token, workerId, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(WORKER_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearWorkerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(WORKER_SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(workerSessions).where(eq(workerSessions.token, token));
  }
  cookieStore.delete(WORKER_SESSION_COOKIE);
}

export async function getCurrentWorker() {
  const cookieStore = await cookies();
  const token = cookieStore.get(WORKER_SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({
      id: workers.id,
      fullName: workers.fullName,
      phone: workers.phone,
      category: workers.category,
      experienceYears: workers.experienceYears,
      baseLocation: workers.baseLocation,
      currentLocation: workers.currentLocation,
      bio: workers.bio,
      isApproved: workers.isApproved,
      isActive: workers.isActive,
      status: workers.status,
      createdAt: workers.createdAt,
      approvedAt: workers.approvedAt,
    })
    .from(workerSessions)
    .innerJoin(workers, eq(workerSessions.workerId, workers.id))
    .where(
      and(
        eq(workerSessions.token, token),
        gt(workerSessions.expiresAt, new Date())
      )
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function requireWorker() {
  const worker = await getCurrentWorker();
  if (!worker) redirect("/login");
  return worker;
}

export async function createAdminSession(email: string) {
  const token = randomToken();
  const expiresAt = expiresInDays(7);
  await db.insert(adminSessions).values({ token, email, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({ email: adminSessions.email })
    .from(adminSessions)
    .where(
      and(eq(adminSessions.token, token), gt(adminSessions.expiresAt, new Date()))
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
