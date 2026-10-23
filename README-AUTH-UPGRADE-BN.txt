WORKCULVERT MVP — AUTH UPGRADE (PHASE 1)
==========================================

এটি মূল ZIP-এর একটি অডিট-ভিত্তিক আপগ্রেড প্যাক। মূল HTML ফাইলগুলো রাখা হয়েছে; নতুন auth.html এবং database.rules.draft.json যোগ করা হয়েছে।

গুরুত্বপূর্ণ:
- auth.html Firebase Email/Password sign-up/login ব্যবহার করে।
- নতুন অ্যাকাউন্ট Worker বা Employer হতে পারে; এই পেজ থেকে Admin তৈরি করা যায় না।
- admin-login.html ও admin.html-এ hard-coded credential/sessionStorage gate সরিয়ে Firebase Email/Password + users/<uid>/role === admin যাচাই যুক্ত করা হয়েছে। তবে worker-dashboard.html, employer-profile.html, index.html ও worker-register.html-এর পুরোনো ফর্ম/ডেটা-পাথ এখনও পুরোপুরি auth UID-ভিত্তিক করা হয়নি। তাই শুধু এই প্যাক দিয়ে নতুন Security Rules চালু করবেন না—পুরোনো ফিচারগুলো তখন permission-denied দিতে পারে।
- database.rules.draft.json একটি পরবর্তী মাইগ্রেশনের খসড়া, সরাসরি production-এ deploy করার জন্য চূড়ান্ত নয়। Rules Simulator-এ পরীক্ষা এবং পুরোনো ডেটার migration দরকার।
- Firebase config-এ থাকা apiKey সাধারণত client config; নিরাপত্তা নির্ভর করে Auth, Rules, App Check এবং অনুমতির উপর। Admin credential কখনো HTML/JS-এ রাখবেন না।

প্রথমে Firebase Console:
1. Authentication > Get started > Sign-in method > Email/Password চালু করুন।
2. Authentication > Settings > Authorized domains-এ আপনার GitHub Pages/Vercel domain যোগ করুন।
3. Realtime Database > Rules-এ বর্তমান Rules-এর ব্যাকআপ নিন। এই draft-টি এখনই production-এ paste করবেন না।
4. auth.html localhost, Firebase Hosting, GitHub Pages বা Vercel-এর মতো HTTP(S) hosting-এ চালান; file:// দিয়ে নয়।

Admin account:
1. auth.html-এ Worker/Employer অ্যাকাউন্ট তৈরি করে লগইন পরীক্ষা করুন।
2. Firebase Authentication-এ নির্দিষ্ট Admin-এর UID খুঁজুন।
3. Realtime Database-এ users/<UID>/role = "admin" সেট করতে হবে trusted Firebase Console থেকে।
4. Public signup form-এ admin role নির্বাচন করার ব্যবস্থা নেই। Rules-এ admin promotion নিজে নিজে অনুমোদন করা যাবে না।

পরবর্তী বাধ্যতামূলক কাজ:
- worker-register.html-এ email/password signup ও workers/<uid> schema যুক্ত করা
- worker-dashboard.html-এ email/password login, onAuthStateChanged guard, uid-ভিত্তিক profile read/update
- employer-profile.html-এ একই auth guard ও employers/<uid> schema
- index.html-এর public job posting বন্ধ করে authenticated Employer posting, employerUid যুক্ত করা
- admin-login.html-কে Firebase Auth + users/<uid>/role === admin চেক-এ রূপান্তর
- admin.html-এ প্রতিটি admin action-এ role verification এবং secure rules
- Applications, status changes, reviews, complaints-এর data model ও rules simulator tests
- বিদ্যমান phone-keyed workers/employers/jobs ডেটা backup ও migration

নিরাপত্তা নোট:
Firebase Realtime Database Rules-এ parent-level ".write" অনুমতি child-level ".write" দিয়ে সীমাবদ্ধ হয় না। তাই Rules লিখে parent grants, ownership, role escalation এবং read access পরীক্ষা করতে হবে। Admin role পরিবর্তন কেবল trusted Console/privileged server-side workflow থেকে করুন।
