import Link from "next/link";
import type { Route } from "next";

import { cn } from "@/lib/cn";

/**
 * Bouton doré de l'en-tête (« Réserver un départ »), partagé avec les sections
 * qui doivent reprendre exactement le même traitement.
 */
export function BoutonOr({
  href,
  className,
  children,
}: {
  href: Route;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-sm bg-or-500 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-or-600 xl:px-5",
        className,
      )}
    >
      {children}
    </Link>
  );
}
