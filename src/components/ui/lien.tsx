"use client";

import Link from "next/link";
import type { Route } from "next";

import { useI18n } from "@/lib/i18n/client";

type LienProps = {
  /** Chemin français (« /tarifs#carnets ») ou adresse externe. */
  href: string;
  prefetch?: boolean;
  scroll?: boolean;
  replace?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/**
 * Lien interne du site public : écrit avec le chemin français, il pointe
 * vers l'adresse de la page dans la langue affichée (« /en/rates »).
 */
export function Lien({ href, ...props }: LienProps) {
  const { lien } = useI18n();
  return <Link href={(href.startsWith("/") ? lien(href) : href) as Route} {...props} />;
}
