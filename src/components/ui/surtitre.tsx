import { cn } from "@/lib/cn";

/** Surtitre centré entre deux filets, commun aux sections de l'accueil. */
export function Surtitre({
  children,
  filet = "or",
  aligne = "centre",
  className,
}: {
  children: React.ReactNode;
  filet?: "or" | "gris";
  /** « gauche » n'affiche qu'un filet, à gauche du texte. */
  aligne?: "centre" | "gauche";
  className?: string;
}) {
  const couleurFilet = filet === "or" ? "bg-or-500/70" : "bg-encre/25";
  const trait = <span aria-hidden="true" className={cn("h-px w-10", couleurFilet)} />;

  return (
    <p
      className={cn(
        "flex items-center gap-4 text-[12px] font-normal uppercase tracking-[0.2em]",
        aligne === "centre" ? "justify-center" : "justify-start",
        className,
      )}
    >
      {trait}
      {children}
      {aligne === "centre" ? trait : null}
    </p>
  );
}
