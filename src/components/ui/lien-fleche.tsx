import Link from "next/link";
import type { Route } from "next";

import { cn } from "@/lib/cn";

/**
 * Lien d'action fléché, partagé par les sections de l'accueil.
 * Générique comme `next/link`, pour accepter aussi les routes dynamiques
 * construites par interpolation sans passer par un cast.
 */
export function LienFleche<T extends string>({
  href,
  className,
  children,
}: {
  href: Route<T>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-[16px] font-semibold text-club-950 underline-offset-4 hover:underline",
        className,
      )}
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}
