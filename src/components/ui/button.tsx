import Link from "next/link";
import type { Route } from "next";

import { cn } from "@/lib/cn";

/**
 * `light` et `ghost` sont destinés aux fonds sombres.
 * Éviter de surcharger les couleurs via `className` : en Tailwind v4 l'ordre des
 * classes ne départage pas deux utilitaires de même propriété.
 */
type Variant = "primary" | "secondary" | "light" | "ghost";

const base =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-300";

const variants: Record<Variant, string> = {
  primary: "bg-club-800 text-sable-50 hover:bg-club-950",
  secondary:
    "border border-club-800/25 text-club-950 hover:border-club-800 hover:bg-club-800/5",
  light: "bg-sable-50 text-club-950 hover:bg-sable-100",
  ghost:
    "border border-sable-50/30 text-sable-50 hover:border-sable-50 hover:bg-sable-50/10",
};

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: Route;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
