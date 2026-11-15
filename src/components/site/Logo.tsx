import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary", className)}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M7 3h7l3 3v5H7V3Z" className="fill-primary-foreground" />
        <rect x="3" y="11" width="18" height="7" rx="2" className="fill-lime" />
        <rect x="7" y="16" width="10" height="5" rx="1" className="fill-primary-foreground" />
      </svg>
    </span>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <LogoMark />
      <span className={cn("text-lg font-extrabold tracking-tight", inverted ? "text-ink-foreground" : "text-foreground")}>
        Smart<span className={inverted ? "text-lime" : "text-primary"}>Print</span>
      </span>
    </Link>
  );
}
