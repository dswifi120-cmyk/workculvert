import { PGlite } from "@electric-sql/pglite";
import path from "node:path";

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employers (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  is_phone_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employer_otps (
  id SERIAL PRIMARY KEY,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS worker_otps (
  id SERIAL PRIMARY KEY,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workers (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  category TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  base_location TEXT NOT NULL,
  current_location TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS worker_sessions (
  token TEXT PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legal_logs (
  id SERIAL PRIMARY KEY,
  user_type TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'terms_and_conditions',
  ip_address TEXT NOT NULL DEFAULT '0.0.0.0',
  user_agent TEXT NOT NULL DEFAULT '',
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  employer_id INTEGER REFERENCES employers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  budget INTEGER NOT NULL,
  duration_text TEXT NOT NULL DEFAULT '১ দিন',
  job_type TEXT NOT NULL DEFAULT 'দৈনিক',
  urgent BOOLEAN NOT NULL DEFAULT false,
  posted_by TEXT NOT NULL DEFAULT 'নিয়োগদাতা',
  contact_phone TEXT NOT NULL DEFAULT '',
  otp_verified BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending_review',
  verified_by_admin BOOLEAN NOT NULL DEFAULT false,
  assigned_worker_id INTEGER REFERENCES workers(id) ON DELETE SET NULL,
  worker_response TEXT NOT NULL DEFAULT 'pending',
  worker_response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  applicant_uid TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'বিবেচনাধীন',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT applications_job_applicant_unique UNIQUE (job_id, applicant_uid)
);
`;

const SEED_SQL = `
INSERT INTO employers (full_name, phone, location, is_phone_verified)
VALUES
  ('শারমিন আক্তার', '01710000000', 'সাতমাথা, বগুড়া', true),
  ('তানভীর হাসান', '01710000001', 'শেরপুর রোড, বগুড়া', true)
ON CONFLICT (phone) DO NOTHING;

INSERT INTO jobs (
  employer_id, title, category, location, description, budget, duration_text,
  job_type, urgent, posted_by, contact_phone, otp_verified, status, verified_by_admin, created_at
)
SELECT * FROM (
  VALUES
    (1, 'কিচেন সিংক পাইপ লিকেজ মেরামত', 'প্লাম্বার', 'সাতমাথা', 'পাইপ থেকে পানি পড়ছে, আজকের মধ্যে মেরামত দরকার।', 1800, '৪ ঘণ্টা', 'দৈনিক', true, 'শারমিন আক্তার', '01710000000', true, 'verified', true, now() - interval '25 minutes'),
    (2, 'বাসার পুরো ওয়্যারিং পরিবর্তন', 'ইলেকট্রিশিয়ান', 'শেরপুর রোড', 'পুরনো wiring change ও distribution board check করতে হবে।', 8500, '২ দিন', 'চুক্তিভিত্তিক', false, 'তানভীর হাসান', '01710000001', true, 'verified', true, now() - interval '2 hours'),
    (1, '৩ বেডরুম ফ্ল্যাট ডিপ ক্লিনিং টিম', 'ক্লিনার টিম', 'মালতিনগর', 'বাসা পুরো deep clean করার জন্য ৩ জনের টিম দরকার।', 3500, '১ দিন', 'দৈনিক', false, 'শারমিন আক্তার', '01710000000', true, 'verified', true, now() - interval '4 hours'),
    (2, 'শহীদ জিয়াউর রহমান মেডিকেলে রোগীর দেখাশোনা', 'হাসপাতালে রোগীর দেখাশোনা', 'ছিলিমপুর', 'রাত ৮টা থেকে সকাল ৮টা শিফটে রোগীর পাশে থেকে দেখাশোনা লাগবে।', 1200, '১ রাত', 'দৈনিক', true, 'তানভীর হাসান', '01710000001', true, 'verified', true, now() - interval '5 hours'),
    (1, 'বাসা বদলের জন্য ১ টন ট্রাক/পিকআপ', 'Truck', 'জলেশ্বরীতলা', 'জলেশ্বরীতলা থেকে উপশহর পর্যন্ত আসবাবপত্র শিফটিং।', 2800, '৪ ঘণ্টা', 'চুক্তিভিত্তিক', false, 'শারমিন আক্তার', '01710000000', true, 'verified', true, now() - interval '7 hours'),
    (2, 'বয়স্ক মায়ের বাসায় দৈনিক যত্নে সহায়ক', 'বাসায় রোগীর দেখাশোনা', 'নামুজা', 'সকাল ৮টা থেকে বিকাল ৫টা পর্যন্ত বাসায় care support লাগবে।', 15000, '১ মাস', 'মাসিক', false, 'তানভীর হাসান', '01710000001', true, 'verified', true, now() - interval '12 hours'),
    (1, 'জরুরি অফিস ডকুমেন্ট ডেলিভারি (বাইক)', 'Bike', 'সাতমাথা', 'সাতমাথা থেকে শেরপুর রোড অফিসে পার্সেল পৌঁছে দিতে হবে।', 350, '২ ঘণ্টা', 'চুক্তিভিত্তিক', true, 'শারমিন আক্তার', '01710000000', true, 'verified', true, now() - interval '1 day'),
    (2, 'অফিস ইভেন্টে চেয়ার ও ডেকোরেশন গোছানোর সহায়ক', 'যেকোনো কাজ (Any Work)', 'মাজহিরা', '১ দিনের অফিস প্রোগ্রামে সেটআপ ও গোছগাছের কাজ।', 900, '১ দিন', 'দৈনিক', false, 'তানভীর হাসান', '01710000001', true, 'verified', true, now() - interval '2 days')
) AS v(employer_id, title, category, location, description, budget, duration_text, job_type, urgent, posted_by, contact_phone, otp_verified, status, verified_by_admin, created_at)
WHERE NOT EXISTS (SELECT 1 FROM jobs LIMIT 1);
`;

type GlobalPglite = typeof globalThis & {
  __wcPgliteInstance?: PGlite;
  __wcPgliteReady?: Promise<PGlite>;
};

const g = globalThis as GlobalPglite;

export function getPgliteClient(): PGlite {
  if (!g.__wcPgliteInstance) {
    const dataDir =
      process.env.PGLITE_DATA_DIR || path.join(process.cwd(), ".pglite");
    g.__wcPgliteInstance = new PGlite(dataDir);
  }
  return g.__wcPgliteInstance;
}

export async function ensurePgliteInitialized(): Promise<PGlite> {
  if (!g.__wcPgliteReady) {
    const client = getPgliteClient();
    g.__wcPgliteReady = (async () => {
      await client.waitReady;
      await client.exec(INIT_SQL);
      await client.exec(SEED_SQL);
      return client;
    })();
  }
  return g.__wcPgliteReady;
}
