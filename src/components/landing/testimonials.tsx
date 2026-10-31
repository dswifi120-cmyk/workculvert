import { Star } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion-primitives";

const QUOTES = [
  {
    q: "রাতে হঠাৎ মেইন লাইন নষ্ট — সকালে পোস্ট দিয়ে দুপুরের আগেই কাজ হয়ে গেল। এত তাড়াতাড়ি কর্মী পাওয়া আগে অকল্পনীয় ছিল।",
    n: "শারমিন আক্তার",
    r: "গৃহকর্ত্রী, মালতিনগর",
    g: "from-pine to-river",
  },
  {
    q: "দোকানের জন্য নির্ভরযোগ্য নাইট গার্ড পেতে মাস ধরে চেষ্টা করছিলাম। WorkCulvert-এ দুই দিনেই যাচাইকৃত লোক পেয়ে গেছি।",
    n: "মোঃ রফিকুল ইসলাম",
    r: "দোকান মালিক, সাতমাথা",
    g: "from-ochre-deep to-ochre",
  },
  {
    q: "আগে কাজ পেতে দালালের পেছনে ঘুরতে হতো। এখন ফোনেই আবেদন করি — এই মাসে আমার আয় প্রায় দ্বিগুণ।",
    n: "রহিম উদ্দিন",
    r: "ইলেকট্রিশিয়ান, শেরপুর রোড",
    g: "from-river to-pine",
  },
  {
    q: "অফিসের পুরো ডিপ ক্লিনিং করাতে পেঁয়েছিলাম ৪ জনের টিম, টাইমলি ও প্রফেশনাল। ইনভয়েসও পরিষ্কার ছিল।",
    n: "তানভীর হাসান",
    r: "অফিস ম্যানেজার, ঝিলেমিল",
    g: "from-pine-dark to-pine",
  },
  {
    q: "রেটিং সিস্টেমটাই আসল জাদু। ভালো কাজ করলেই নতুন কাজ আসে — দক্ষতার দাম এখন দক্ষতাই।",
    n: "সালমা খাতুন",
    r: "কেয়ারগিভার, নামুজা",
    g: "from-brick to-ochre",
  },
  {
    q: "বাবার বাসার প্লাম্বিং কাজ ঢাকায় বসেই ম্যানেজ করেছি। পেমেন্ট, রিভিউ, সব এক জায়গায় — চমৎকার।",
    n: "নুসরাত জাহান",
    r: "প্রবাসী গ্রাহক, ঢাকা",
    g: "from-river to-mint",
  },
];

function QuoteCard({
  q,
  n,
  r,
  g,
}: {
  q: string;
  n: string;
  r: string;
  g: string;
}) {
  return (
    <figure className="shadow-card w-[320px] shrink-0 rounded-3xl border border-line bg-card p-6 sm:w-[380px]">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} className="fill-ochre text-ochre" />
        ))}
      </div>
      <blockquote className="mt-4 text-[14.5px] leading-[1.8] text-ink/85">
        &ldquo;{q}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className={`grid size-10 place-items-center rounded-full bg-gradient-to-br font-semibold text-paper ${g}`}
        >
          {n.trim().split(" ").pop()?.slice(0, 2)}
        </span>
        <div>
          <p className="text-[14px] font-semibold text-ink">{n}</p>
          <p className="text-[12px] text-faint">{r}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const rowA = QUOTES.slice(0, 3);
  const rowB = QUOTES.slice(3);
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="মানুষ যা বলছে"
          title={
            <>
              বগুড়ার মানুষের{" "}
              <span className="font-serif text-pine">আস্থার গল্প</span>
            </>
          }
          copy="কর্মী ও নিয়োগদাতা — দুই পক্ষেরই ভালোবাসা পাচ্ছি। এটাই আমাদের সবচেয়ে বড় পুরস্কার।"
        />
      </div>

      <div className="mx-auto mt-4 max-w-3xl px-4 text-center sm:px-6">
        <p className="text-[11.5px] leading-relaxed text-faint">
          প্রকাশিত কিছু অভিজ্ঞতা, প্রদর্শনী প্রোফাইল বা উদাহরণমূলক interface story platform-এর trust model বোঝানোর জন্য ব্যবহৃত হতে পারে; formal verified review system progressively update করা হবে।
        </p>
      </div>

      <Reveal delay={0.1} className="mt-14 space-y-5">
        <div className="mask-x overflow-hidden">
          <div className="flex w-max animate-marquee gap-5 pr-5 hover:[animation-play-state:paused]">
            {[...rowA, ...rowA].map((t, i) => (
              <QuoteCard key={`a-${i}`} {...t} />
            ))}
          </div>
        </div>
        <div className="mask-x overflow-hidden">
          <div className="flex w-max animate-marquee-rev gap-5 pr-5 hover:[animation-play-state:paused]">
            {[...rowB, ...rowB].map((t, i) => (
              <QuoteCard key={`b-${i}`} {...t} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
