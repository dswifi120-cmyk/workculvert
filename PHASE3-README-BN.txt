WORKCULVERT MVP PHASE 3 — JOB APPLICATION FLOW

এই প্যাকে jobs.html (Worker কাজ খুঁজবে ও আবেদন করবে) এবং employer-applications.html (Employer আবেদন দেখবে, Worker নির্বাচন ও কাজ সম্পন্ন চিহ্নিত করবে) যোগ হয়েছে। নেভিগেশনেও লিংক যোগ করা হয়েছে।

গুরুত্বপূর্ণ সীমাবদ্ধতা:
- এটি source-code build; Firebase-এ live deploy/test হয়নি।
- database.rules.phase3.draft.json production-এ সরাসরি paste করবেন না। Rules Simulator-এ পরীক্ষা, ডেটা backup ও migration আগে আবশ্যক।
- বর্তমান draft-এ application status change-এর business rules যথেষ্ট কঠোর নয়; production-এ selected worker, valid status transitions, atomic consistency এবং application ownership আরও enforce করতে হবে।
- পুরোনো data phone/push-key ভিত্তিক হলে আগে backup/migration করুন।
- Admin role কেবল trusted Firebase Console বা privileged backend থেকে দিন।

পরীক্ষার ধাপ:
1. Worker account দিয়ে login → jobs.html → খোলা কাজের আবেদন।
2. Worker Dashboard-এ আবেদন দেখা।
3. Employer account দিয়ে login → employer-applications.html → Worker নির্বাচন।
4. নির্বাচিত Worker-এর জন্য কাজ সম্পন্ন চিহ্নিত করা।
5. অন্য Employer/Worker যেন অননুমোদিত ডেটা পরিবর্তন করতে না পারে তা Rules Simulator-এ পরীক্ষা।
