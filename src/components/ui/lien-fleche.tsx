import { Lien as Link } from "@/components/ui/lien";

import { cn } from "@/lib/cn";
import { proprietesLien } from "@/lib/liens";

/**
 * Lien d'action fléché, partagé par les sections de l'accueil.
 * Générique comme `next/link`, pour accepter aussi les routes dynamiques
 * construites par interpolation sans passer par un cast.
 */
export function LienFleche({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      {...proprietesLien(href)}
      className={cn(
        "text-[16px] font-semibold text-club-950 underline-offset-4 hover:underline",
        className,
      )}
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}
