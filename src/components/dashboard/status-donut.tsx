"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { APPLICATION_STATUS } from "@/app/dashboard/data";
import { bn } from "@/lib/utils";

function StatusTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ name?: string; value?: number | string }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="shadow-lift rounded-xl border border-line bg-card/95 px-3.5 py-2 text-xs backdrop-blur">
      <p className="text-mist">
        {p.name} <span className="ml-1 font-bold text-ink">{bn(String(p.value))}%</span>
      </p>
    </div>
  );
}

export function StatusDonut() {
  return (
    <section className="shadow-card rounded-2xl border border-line bg-card p-5 sm:p-6">
      <h3 className="text-base font-bold text-ink">আবেদনের ফলাফল</h3>
      <p className="mt-0.5 text-xs text-faint">মোট ১৮টি আবেদন · গত ৩০ দিন</p>

      <div className="relative mx-auto mt-4 h-[200px] w-full max-w-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<StatusTooltip />} />
            <Pie
              data={APPLICATION_STATUS}
              dataKey="value"
              nameKey="name"
              innerRadius="68%"
              outerRadius="94%"
              paddingAngle={4}
              cornerRadius={7}
              strokeWidth={0}
              startAngle={90}
              endAngle={450}
            >
              {APPLICATION_STATUS.map((s) => (
                <Cell key={s.name} fill={s.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight text-ink">৫৫%</p>
            <p className="mt-0.5 text-[11px] text-faint">আবেদন গৃহীত</p>
          </div>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {APPLICATION_STATUS.map((s) => (
          <li key={s.name} className="flex items-center gap-2.5 text-sm">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-mist">{s.name}</span>
            <span className="ml-auto text-sm font-bold text-ink">{bn(s.value)}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
