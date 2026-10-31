# WorkCulvert — বগুড়ার কর্মী ও কাজের মার্কেটপ্লেস

Next.js 16 (App Router) + PostgreSQL (Drizzle ORM) + Tailwind CSS 4 + Motion।

## এখন কী কী built-in আছে

- Public landing page + commercial Bengali design
- Employer job posting form with **phone OTP verification flow**
- Admin review queue for jobs
- Worker signup → **admin approval required** → worker login
- Worker dashboard with active/inactive toggle, current location, assigned jobs
- Admin dashboard with:
  - সব worker profile
  - সব employer profile
  - pending worker approval
  - job verify / assign to worker

## লোকালে চালানো

```bash
npm install
cp .env.example .env.local
npx drizzle-kit push
npm run dev
```

## দরকারি Environment Variables

| Key | কাজ |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_EMAIL` | আপনার fixed admin email |
| `ADMIN_OTP_CODE` | admin login-এর 6 digit security code |

> `ADMIN_OTP_CODE` এখন practical fixed OTP/password-এর মতো কাজ করছে। পরে চাইলে Resend/Twilio দিয়ে real one-time OTP পাঠানো সহজে add করা যাবে।

## ডিপ্লয় (Vercel + Neon)

1. GitHub-এ push করুন
2. Neon-এ PostgreSQL project বানান
3. `DATABASE_URL` দিয়ে `npx drizzle-kit push` চালান
4. Vercel-এ repo import করুন
5. Vercel Environment Variables-এ দিন:
   - `DATABASE_URL`
   - `ADMIN_EMAIL`
   - `ADMIN_OTP_CODE`
6. Deploy

## Public job posting OTP

এই version-এ SMS provider configured না থাকলে OTP **demo mode**-এ স্ক্রিনেই দেখায়, যেন পুরো flow test করা যায়।
Production-এ real SMS service (Twilio/SSL Wireless/Infobip ইত্যাদি) যুক্ত করলে `request-otp` route-এ send logic বসালেই হবে। কাঠামো প্রস্তুত।

## প্রজেক্ট স্ট্রাকচার

- `src/app/page.tsx` — public landing page
- `src/app/login/page.tsx` — worker signup/login
- `src/app/dashboard/page.tsx` — worker dashboard
- `src/app/admin/login/page.tsx` — admin login
- `src/app/admin/page.tsx` — admin dashboard
- `src/db/schema.ts` — tables
