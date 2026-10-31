import { Counter, Reveal } from "@/components/motion-primitives";

const STATS = [
  { value: 2500, suffix: "+", label: "যাচাইকৃত কর্মী", sub: "বগুড়া জেলাজুড়ে" },
  { value: 8700, suffix: "+", label: "কাজ সম্পন্ন", sub: "গত ১২ মাসে" },
  { value: 4.9, suffix: "/৫", decimals: 1, label: "গড় রেটিং", sub: "৩,২০০+ রিভিউ থেকে" },
  { value: 3, prefix: "~", suffix: " ঘণ্টা", label: "গড় ম্যাচিং সময়", sub: "পোস্ট থেকে অ্যাসাইন" },
];

export function Stats() {
  return (
    <section id="results" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="shadow-card grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className="bg-card px-5 py-9 text-center sm:py-12">
              <Reveal delay={i * 0.08}>
                <p className="text-4xl font-bold tracking-tight text-pine sm:text-[44px]">
                  <Counter
                    to={s.value}
                    prefix={s.prefix ?? ""}
                    suffix={s.suffix ?? ""}
                    decimals={s.decimals ?? 0}
                  />
                </p>
                <p className="mt-2 text-[15px] font-semibold text-ink">{s.label}</p>
                <p className="mt-0.5 text-[12.5px] text-faint">{s.sub}</p>
              </Reveal>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-faint">
          প্রদর্শিত কিছু পরিসংখ্যান ও growth indicator বর্তমানে platform presentation / pilot estimate হিসেবে দেখানো হতে পারে; live operational data, worker availability ও matching result admin verification সাপেক্ষ।
        </p>
      </div>
    </section>
  );
}
