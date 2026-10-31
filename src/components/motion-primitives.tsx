"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useInView, animate } from "motion/react";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-70px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Counter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate(v) {
        node.textContent = prefix + formatNumber(v, decimals, true) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, prefix, suffix, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}০{suffix}
    </span>
  );
}

export function Eyebrow({
  children,
  dark = false,
  className,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.02em]",
        dark
          ? "border-white/15 bg-white/[0.06] text-mint"
          : "border-pine/20 bg-tint text-pine",
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          dark ? "bg-mint" : "bg-ochre"
        )}
      />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "center",
  dark = false,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <Reveal>
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "mt-5 text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold leading-[1.18] tracking-[-0.01em]",
            dark ? "text-paper" : "text-ink"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {copy ? (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "mt-4 text-[15px] leading-[1.8] sm:text-[17px]",
              dark ? "text-paper/65" : "text-mist"
            )}
          >
            {copy}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
