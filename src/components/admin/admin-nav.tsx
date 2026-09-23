"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNav } from "@/config/admin";
import { cn } from "@/lib/cn";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Sections du back-office">
      <ul className="space-y-1">
        {adminNav.map((item) => {
          const actif =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  actif
                    ? "border border-neutral-200 bg-white font-semibold text-neutral-900 shadow-sm"
                    : "border border-transparent text-neutral-600 hover:bg-neutral-100",
                )}
              >
                <span aria-hidden="true" className="text-base">
                  {item.icone}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
