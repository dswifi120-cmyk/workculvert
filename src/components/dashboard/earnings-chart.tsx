"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { EARNINGS } from "@/app/dashboard/data";
import { bn } from "@/lib/utils";

function EarningsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number | string; dataKey?: string | number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const cur = payload.find((p) => p.dataKey === "cur")?.value;
  const prev = payload.find((p) => p.dataKey === "prev")?.value;
  return (
    <div className="shadow-lift rounded-xl border border-line bg-card/95 px-3.5 py-2.5 text-xs backdrop-blur">
      <p className="mb-1.5 font-bold text-ink">{label}</p>
      <p className="flex items-center gap-2 text-mist">
        <span className="size-2 rounded-full bg-pine" />
        এই বছর <span className="ml-1 font-semibold text-ink">৳{bn(String(cur))}k</span>
      </p>
      <p className="mt-1 flex items-center gap-2 text-mist">
        <span className="size-2 rounded-full bg-faint" />
        গত বছর <span className="ml-1 font-semibold text-ink">৳{bn(String(prev))}k</span>
      </p>
    </div>
  );
}

export function EarningsChart() {
  return (
    <section className="shadow-card rounded-2xl border border-line bg-card p-5 sm:p-6 xl:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink">আয়ের ধারা</h3>
          <p className="mt-0.5 text-xs text-faint">
            এই বছর বনাম গত বছর · মাসিক (হাজার টাকায়)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-4 text-xs text-mist sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-pine" /> ২০২৬
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-faint" /> ২০২৫
            </span>
          </span>
          <button className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-mist transition-colors hover:text-pine">
            শেষ ১২ মাস <ChevronDown size={13} />
          </button>
        </div>
      </div>

      <div className="mt-6 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={EARNINGS} margin={{ top: 6, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="earnFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c5b4e" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#0c5b4e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(20,35,29,0.07)" strokeDasharray="3 6" />
            <XAxis
              dataKey="m"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#8b978f", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              tick={{ fill: "#8b978f", fontSize: 12 }}
              tickFormatter={(v: number) => `৳${v}k`}
            />
            <Tooltip
              content={<EarningsTooltip />}
              cursor={{ stroke: "rgba(20,35,29,0.15)", strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="prev"
              stroke="#8b978f"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              fill="transparent"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="cur"
              stroke="#0c5b4e"
              strokeWidth={2.5}
              fill="url(#earnFill)"
              dot={false}
              activeDot={{ r: 4.5, fill: "#0c5b4e", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
