"use client";

import { motion } from "motion/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Counter } from "@/components/motion-primitives";
import { KPIS } from "@/app/dashboard/data";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * 96},${30 - ((v - min) / range) * 26}`
    )
    .join(" ");
  return (
    <svg viewBox="0 0 96 32" className="h-8 w-24" fill="none">
      <motion.polyline
        points={pts}
        stroke={up ? "#0c5b4e" : "#d95d4e"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function KpiCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPIS.map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: i * 0.07, ease: EASE }}
          className="shadow-card rounded-2xl border border-line bg-card p-5 transition-colors hover:border-pine/30"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-faint">
              {k.label}
            </p>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
                k.up ? "bg-tint text-pine" : "bg-brick-soft text-brick"
              )}
            >
              {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {k.delta}
            </span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <p className="text-[26px] font-bold leading-none tracking-tight text-ink">
              <Counter
                to={k.value}
                prefix={k.prefix ?? ""}
                suffix={k.suffix ?? ""}
                decimals={k.decimals ?? 0}
                duration={1.8}
              />
            </p>
            <Sparkline data={k.spark} up={k.up} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
