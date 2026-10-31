-- WorkCulvert demo seed
-- ব্যবহার:
-- 1) আগে `npx drizzle-kit push` চালান
-- 2) তারপর এই SQL Neon / Supabase SQL Editor-এ রান করুন

INSERT INTO employers (full_name, phone, location, is_phone_verified)
VALUES
  ('শারমিন আক্তার', '01710000000', 'সাতমাথা, বগুড়া', true),
  ('তানভীর হাসান', '01710000001', 'শেরপুর রোড, বগুড়া', true)
ON CONFLICT (phone) DO UPDATE
SET full_name = EXCLUDED.full_name,
    location = EXCLUDED.location,
    is_phone_verified = true;

INSERT INTO jobs (
  employer_id,
  title,
  category,
  location,
  description,
  budget,
  duration_text,
  job_type,
  urgent,
  posted_by,
  contact_phone,
  otp_verified,
  status,
  verified_by_admin,
  created_at
)
VALUES
  ((SELECT id FROM employers WHERE phone='01710000000' LIMIT 1), 'কিচেন সিংক পাইপ লিকেজ মেরামত', 'প্লাম্বার', 'সাতমাথা', 'পাইপ থেকে পানি পড়ছে, আজকের মধ্যে মেরামত দরকার।', 1800, '৪ ঘণ্টা', 'দৈনিক', true, 'শারমিন আক্তার', '01710000000', true, 'verified', true, now() - interval '25 minutes'),
  ((SELECT id FROM employers WHERE phone='01710000001' LIMIT 1), 'বাসার পুরো ওয়্যারিং পরিবর্তন', 'ইলেকট্রিশিয়ান', 'শেরপুর রোড', 'পুরনো wiring change ও distribution board check করতে হবে।', 8500, '২ দিন', 'চুক্তিভিত্তিক', false, 'তানভীর হাসান', '01710000001', true, 'verified', true, now() - interval '2 hours'),
  ((SELECT id FROM employers WHERE phone='01710000000' LIMIT 1), '৩ বেডরুম ফ্ল্যাট ডিপ ক্লিনিং', 'ক্লিনার', 'মালতিনগর', 'বাসা পুরো deep clean দরকার।', 3500, '১ দিন', 'দৈনিক', false, 'শারমিন আক্তার', '01710000000', true, 'verified', true, now() - interval '4 hours'),
  ((SELECT id FROM employers WHERE phone='01710000001' LIMIT 1), 'বয়স্ক মায়ের দৈনিক যত্নে সহায়ক', 'কেয়ারগিভার', 'নামুজা', 'সকাল ৮টা থেকে বিকাল ৫টা পর্যন্ত care support লাগবে।', 15000, '১ মাস', 'মাসিক', false, 'তানভীর হাসান', '01710000001', true, 'verified', true, now() - interval '7 hours'),
  ((SELECT id FROM employers WHERE phone='01710000000' LIMIT 1), 'দোকানের শাটার ও গ্রিল রং করা', 'রংমিস্ত্রি', 'ঝিলেমিল', 'শাটার, গ্রিল ও সামনের সাইনবোর্ড টাচআপ।', 4200, '২ দিন', 'চুক্তিভিত্তিক', true, 'শারমিন আক্তার', '01710000000', true, 'verified', true, now() - interval '1 day'),
  ((SELECT id FROM employers WHERE phone='01710000001' LIMIT 1), 'অফিসের জন্য নাইট শিফট নিরাপত্তা', 'নিরাপত্তাকর্মী', 'মাজহিরা', 'রাত ১০টা থেকে সকাল ৬টা শিফট।', 14000, '১ মাস', 'মাসিক', false, 'তানভীর হাসান', '01710000001', true, 'verified', true, now() - interval '2 days')
ON CONFLICT DO NOTHING;
