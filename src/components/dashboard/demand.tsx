import { DEMAND } from "@/app/dashboard/data";
import { bn } from "@/lib/utils";

export function DemandList() {
  return (
    <section className="shadow-card rounded-2xl border border-line bg-card p-5 sm:p-6">
      <h3 className="text-base font-bold text-ink">চাহিদা সবচেয়ে বেশি</h3>
      <p className="mt-0.5 text-xs text-faint">এই মাসের খোলা পোস্ট অনুযায়ী</p>
      <ul className="mt-5 space-y-4">
        {DEMAND.map((d, i) => (
          <li key={d.name}>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-4 text-xs font-bold text-faint">{bn(i + 1)}</span>
              <span className="font-semibold text-ink">{d.name}</span>
              <span className="ml-auto text-xs text-faint">{bn(d.jobs)}টি পোস্ট</span>
            </div>
            <div className="ml-7 mt-2 h-1.5 overflow-hidden rounded-full bg-linen">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pine to-mint transition-all duration-700"
                style={{ width: `${d.share}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 rounded-xl bg-tint px-4 py-3 text-[12.5px] leading-relaxed text-pine">
        টিপস: ইলেকট্রিশিয়ান ক্যাটাগরিতে চাহিদা ২৪% বেশি — প্রোফাইলে নতুন স্কিল যোগ করুন।
      </p>
    </section>
  );
}
