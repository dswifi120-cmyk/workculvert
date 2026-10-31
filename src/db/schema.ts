import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const employers = pgTable("employers", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().unique(),
  location: text("location").notNull(),
  isPhoneVerified: boolean("is_phone_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const employerOtps = pgTable("employer_otps", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const workerOtps = pgTable("worker_otps", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  code: text("code").notNull(),
  verified: boolean("verified").notNull().default(false),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const workers = pgTable("workers", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  category: text("category").notNull(),
  experienceYears: integer("experience_years").notNull().default(0),
  baseLocation: text("base_location").notNull(),
  currentLocation: text("current_location").notNull(),
  bio: text("bio").notNull().default(""),
  isApproved: boolean("is_approved").notNull().default(false),
  isActive: boolean("is_active").notNull().default(false),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
});

export const workerSessions = pgTable("worker_sessions", {
  token: text("token").primaryKey(),
  workerId: integer("worker_id")
    .notNull()
    .references(() => workers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const adminSessions = pgTable("admin_sessions", {
  token: text("token").primaryKey(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const legalLogs = pgTable("legal_logs", {
  id: serial("id").primaryKey(),
  userType: text("user_type").notNull(), // 'worker' | 'employer'
  userPhone: text("user_phone").notNull(),
  documentType: text("document_type").notNull().default("terms_and_conditions"),
  ipAddress: text("ip_address").notNull().default("0.0.0.0"),
  userAgent: text("user_agent").notNull().default(""),
  acceptedAt: timestamp("accepted_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").references(() => employers.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull().default(""),
  budget: integer("budget").notNull(),
  durationText: text("duration_text").notNull().default("১ দিন"),
  jobType: text("job_type").notNull().default("দৈনিক"),
  urgent: boolean("urgent").notNull().default(false),
  postedBy: text("posted_by").notNull().default("নিয়োগদাতা"),
  contactPhone: text("contact_phone").notNull().default(""),
  otpVerified: boolean("otp_verified").notNull().default(false),
  status: text("status").notNull().default("pending_review"),
  verifiedByAdmin: boolean("verified_by_admin").notNull().default(false),
  assignedWorkerId: integer("assigned_worker_id").references(() => workers.id, {
    onDelete: "set null",
  }),
  workerResponse: text("worker_response").notNull().default("pending"), // 'pending' | 'accepted' | 'declined'
  workerResponseAt: timestamp("worker_response_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type Worker = typeof workers.$inferSelect;
export type Employer = typeof employers.$inferSelect;

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    jobTitle: text("job_title").notNull(),
    applicantUid: text("applicant_uid").notNull(),
    applicantName: text("applicant_name").notNull(),
    applicantEmail: text("applicant_email").notNull().default(""),
    status: text("status").notNull().default("বিবেচনাধীন"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique("applications_job_applicant_unique").on(t.jobId, t.applicantUid)]
);

export type Application = typeof applications.$inferSelect;
