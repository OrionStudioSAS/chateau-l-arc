import { cn } from "@/lib/cn";

/**
 * TODO : remplacer par le blason fourni par le club (SVG dans /public),
 * ce lettrage n'est qu'un substitut.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("block text-center leading-none", className)}>
      <span className="block font-display text-lg tracking-[0.12em]">
        CHÂTEAU
      </span>
      <span className="block font-display text-xs tracking-[0.42em]">L&apos;ARC</span>
    </span>
  );
}
