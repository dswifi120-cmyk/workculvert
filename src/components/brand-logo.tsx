import { cn } from "@/lib/utils";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  subtitle?: string;
  showWordmark?: boolean;
  className?: string;
};

export function WcMonogram({
  className = "size-10",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        "shrink-0 rounded-xl shadow-[0_8px_22px_-6px_rgba(12,91,78,0.45)]",
        className
      )}
    >
      <defs>
        <linearGradient
          id="wcMarkBg"
          x1="40"
          y1="24"
          x2="472"
          y2="488"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#052E27" />
          <stop offset="55%" stopColor="#0C5B4E" />
          <stop offset="100%" stopColor="#0A483E" />
        </linearGradient>
        <linearGradient
          id="wcMarkGold"
          x1="120"
          y1="90"
          x2="400"
          y2="260"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <rect x="12" y="12" width="488" height="488" rx="116" fill="url(#wcMarkBg)" />
      <rect
        x="32"
        y="32"
        width="448"
        height="448"
        rx="98"
        stroke="#6EE7B7"
        strokeOpacity="0.28"
        strokeWidth="6"
      />
      {/* Signature Culvert Bridge Arch */}
      <path
        d="M116 184C154 114 218 88 268 88C324 88 378 118 408 176"
        stroke="url(#wcMarkGold)"
        strokeWidth="34"
        strokeLinecap="round"
      />
      <circle cx="264" cy="142" r="14" fill="#FBBF24" />
      {/* Bold W */}
      <path
        d="M86 220L128 386L178 274L228 386L270 220"
        stroke="#FFFFFF"
        strokeWidth="42"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Interlocking Golden C */}
      <path
        d="M412 248C394 226 368 214 338 214C284 214 246 252 246 304C246 356 284 394 338 394C370 394 396 380 414 356"
        stroke="#FBBF24"
        strokeWidth="42"
        strokeLinecap="round"
      />
      <rect
        x="148"
        y="432"
        width="216"
        height="12"
        rx="6"
        fill="#6EE7B7"
        fillOpacity="0.5"
      />
    </svg>
  );
}

export function BrandLogo({
  size = "md",
  theme = "light",
  subtitle,
  showWordmark = true,
  className,
}: BrandLogoProps) {
  const iconSize =
    size === "sm" ? "size-9" : size === "lg" ? "size-12" : "size-10";
  const textSize =
    size === "sm"
      ? "text-[16.5px]"
      : size === "lg"
        ? "text-[22px]"
        : "text-[18px] sm:text-[19px]";

  const isDark = theme === "dark";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <WcMonogram className={iconSize} />
      {showWordmark && (
        <span className="leading-none">
          <span
            className={cn(
              "font-latin font-bold tracking-[-0.025em]",
              textSize,
              isDark ? "text-paper" : "text-ink"
            )}
          >
            Work
            <span className={isDark ? "text-mint" : "text-pine"}>Culvert</span>
            <sup
              className={cn(
                "ml-0.5 text-[9px] font-bold",
                isDark ? "text-ochre" : "text-ochre-deep"
              )}
            >
              TM
            </sup>
          </span>
          {subtitle ? (
            <span
              className={cn(
                "mt-0.5 block text-[10px] font-medium",
                isDark ? "text-paper/65" : "text-faint"
              )}
            >
              {subtitle}
            </span>
          ) : null}
        </span>
      )}
    </span>
  );
}
