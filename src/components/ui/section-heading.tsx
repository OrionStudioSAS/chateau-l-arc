import { cn } from "@/lib/cn";

export function SectionHeading({
  surtitre,
  titre,
  chapo,
  className,
}: {
  surtitre?: string;
  titre: string;
  chapo?: string;
  className?: string;
}) {
  return (
    <header className={cn("max-w-2xl", className)}>
      {surtitre ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-club-600">
          {surtitre}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl text-club-950 sm:text-4xl">
        {titre}
      </h2>
      {chapo ? (
        <p className="mt-4 text-base leading-relaxed text-encre/70">{chapo}</p>
      ) : null}
    </header>
  );
}
