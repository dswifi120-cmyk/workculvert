WorkCulvert — PWA প্রস্তুতিমূলক সংস্করণ

ইনস্টল:
1) ZIP Extract করুন। সব ফাইল একই root/public ফোল্ডারে রাখুন।
2) GitHub Pages, Firebase Hosting বা অন্য HTTPS hosting-এ deploy করুন। শুধু কম্পিউটারে file:// দিয়ে খুললে PWA install/service worker কাজ করবে না।
3) index.html খুলে Chrome/Edge-এ Install app অপশন দেখুন। মোবাইলে browser menu থেকে Add to Home Screen ব্যবহার করা যায়।
4) আপডেটের পর service worker cache version বদলানো হয়েছে কি না পরীক্ষা করুন।

এই সংস্করণে:
- আগের HTML/Firebase flow রেখে PWA manifest, service worker, install prompt ও app icon যোগ করা হয়েছে।
- মূল HTML ফাইলগুলো একই ফোল্ডারে রাখতে হবে।
- Service worker শুধু same-origin app shell cache করে; Firebase/CDN requests cache করা হয় না.

গুরুত্বপূর্ণ নিরাপত্তা সীমাবদ্ধতা:
- admin-login.html-এ client-side username/password এবং sessionStorage gate রয়েছে। এগুলো নিরাপদ authentication নয়; public launch-এর আগে Firebase Authentication ও database security rules দিয়ে server-side authorization লাগবে।
- Firebase Realtime Database Rules live console থেকে পরীক্ষা/সেট করতে হবে। ZIP দেখে live rules নিশ্চিত করা যায় না।
- Worker login যদি শুধু phone number দিয়ে চলে, তা পরিচয় যাচাই নয়। OTP/Firebase Auth যোগ না করা পর্যন্ত sensitive data বা public commercial use-এর জন্য এটি নিরাপদ নয়।
- PWA installable হওয়া আর offline-এ সব feature কাজ করা এক নয়; Firebase data operations-এর জন্য internet প্রয়োজন।
- এই প্যাকেজে deployment, live Firebase rules, phone OTP, payment, notifications বা production security configure করা হয়নি।
