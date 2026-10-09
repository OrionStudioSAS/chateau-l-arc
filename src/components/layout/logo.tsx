import { cn } from "@/lib/cn";

/**
 * TODO : ajouter le blason fourni par le club (SVG dans /public) à gauche du
 * lettrage, comme sur la maquette.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("block leading-tight", className)}>
      <span className="block text-[13px] font-bold uppercase tracking-[0.04em] sm:text-[14px]">
        Château l&apos;Arc
      </span>
      <span className="block text-[13px] font-normal sm:text-[14px]">Golf Club Provence</span>
    </span>
  );
}
