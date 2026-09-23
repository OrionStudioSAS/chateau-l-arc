import { cn } from "@/lib/cn";

/** Surtitre centré entre deux filets, commun aux sections de l'accueil. */
export function Surtitre({
  children,
  filet = "or",
  className,
}: {
  children: React.ReactNode;
  filet?: "or" | "gris";
  className?: string;
}) {
  const couleurFilet = filet === "or" ? "bg-or-500/70" : "bg-encre/25";

  return (
    <p
      className={cn(
        "flex items-center justify-center gap-4 text-[12px] font-normal uppercase tracking-[0.2em]",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("h-px w-10", couleurFilet)} />
      {children}
      <span aria-hidden="true" className={cn("h-px w-10", couleurFilet)} />
    </p>
  );
}
