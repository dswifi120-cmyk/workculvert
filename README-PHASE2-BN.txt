WORKCULVERT MVP — PHASE 2 (UID-BASED AUTH PAGES)
================================================

This package updates the following pages to use Firebase Email/Password and UID-based records:
- auth.html: account creation/login (Worker or Employer)
- worker-register.html: routes to the secure signup flow
- worker-dashboard.html: requires Worker role; profile is stored at workers/<uid>
- employer-profile.html: requires Employer role; profile stored at employers/<uid>; jobs stored with employerUid
- admin-login.html and admin.html: Firebase Authentication plus users/<uid>/role === "admin"
- index.html: public job posting removed; job list requires sign-in

IMPORTANT — DO NOT DEPLOY database.rules.draft.json AS-IS.
The existing app uses legacy phone-keyed records and a new UID-based schema. A full database rules migration must be designed and tested in Firebase Rules Simulator before deploying. In particular, Realtime Database parent-level .write grants can override child restrictions. The included draft is only a discussion starting point and is NOT production-ready.

SETUP:
1. Firebase Console > Authentication > Sign-in method > Email/Password: Enable.
2. Authentication > Settings > Authorized domains: add your GitHub Pages/Vercel domain.
3. Host over HTTP(S) (not file://); test on staging first.
4. Create one Admin account using auth.html as Worker or Employer, then use Firebase Console to set users/<UID>/role = "admin". This is a trusted manual bootstrap step. Never expose Admin role selection in public signup.
5. Back up Realtime Database before any data/rules changes.

KNOWN LIMITATIONS / TEST REQUIRED:
- The pages are source-code updated, but have not been tested against your live Firebase project or deployed Rules.
- Existing old phone-keyed records are not migrated automatically.
- Applications/reviews/complaints and completion flow are not fully implemented in this phase.
- Existing Firebase Rules may deny some new reads/writes until migration is completed.
- The included database.rules.draft.json is not ready for production use.
- Admin UI currently provides basic read-only summaries; moderation actions need their own authorization and audit log.
