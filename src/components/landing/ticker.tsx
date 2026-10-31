const ITEMS = [
  "ইলেকট্রিশিয়ান",
  "প্লাম্বার",
  "ক্লিনার",
  "কেয়ারগিভার",
  "রংমিস্ত্রি",
  "কারপেন্টার",
  "ড্রাইভার",
  "নিরাপত্তাকর্মী",
  "এসি মিস্ত্রি",
  "গার্ডেনার",
];

export function Ticker() {
  return (
    <section className="border-y border-pine/15 bg-tint/60 py-4">
      <div className="mask-x overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-8 pr-8 hover:[animation-play-state:paused]">
          {[...ITEMS, ...ITEMS].map((t, i) => (
            <span
              key={i}
              aria-hidden={i >= ITEMS.length}
              className="flex items-center gap-8 whitespace-nowrap text-[15px] font-semibold text-pine/80"
            >
              {t}
              <span className="size-1.5 rounded-full bg-ochre" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
