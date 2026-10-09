import { Blason } from "@/components/ui/blason";
import { cn } from "@/lib/cn";

/** Blason + lettrage « Château l'Arc / Golf Club Provence ». */
export function Logo({
  className,
  sombre = false,
}: {
  className?: string;
  /** En-tête blanc : blason assombri pour rester visible. */
  sombre?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5 leading-tight", className)}>
      <Blason sombre={sombre} priorite />
      <span className="block">
        <span className="block text-[13px] font-bold uppercase tracking-[0.04em] sm:text-[14px]">
          Château l&apos;Arc
        </span>
        <span className="block text-[13px] font-normal sm:text-[14px]">
          Golf Club Provence
        </span>
      </span>
    </span>
  );
}
