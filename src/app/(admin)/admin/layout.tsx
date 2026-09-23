import type { Metadata } from "next";

import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: `Back-office · ${site.shortName}` },
  robots: { index: false, follow: false },
};

/**
 * Le back-office lit la session à chaque requête : il ne peut pas être
 * prérendu dans la coquille statique (cf. Cache Components).
 */
export const instant = false;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-neutral-50 text-neutral-900">{children}</div>;
}
