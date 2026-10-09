import Link from "next/link";
import type { Route } from "next";

import { cn } from "@/lib/cn";
import { proprietesLien } from "@/lib/liens";

/** Pendant clair du bouton doré (« Devenir membre », « Voir la scorecard »). */
export function BoutonClair<T extends string>({
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
      {...proprietesLien(href)}
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-sm bg-sable-100 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-club-950 transition-colors hover:bg-white xl:px-5",
        className,
      )}
    >
      {children}
    </Link>
  );
}
