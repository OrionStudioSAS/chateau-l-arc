"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { IconeAdmin } from "@/components/admin/icone-admin";
import {
  adminNav,
  adminNavPied,
  type AdminNavItem,
} from "@/config/admin";
import { cn } from "@/lib/cn";

const normaliser = (texte: string) =>
  texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function estActif(item: AdminNavItem, chemin: string): boolean {
  if (!item.href || item.href.startsWith("https://") || item.href.includes("#")) return false;
  return item.href === "/admin" ? chemin === "/admin" : chemin.startsWith(item.href);
}

function Entree({
  item,
  chemin,
  compteurs,
}: {
  item: AdminNavItem;
  chemin: string;
  compteurs: Partial<Record<NonNullable<AdminNavItem["compteur"]>, number>>;
}) {
  const actif = estActif(item, chemin);
  const externe = !item.href || item.href.startsWith("https://");
  const compteur = item.compteur ? compteurs[item.compteur] : undefined;

  const contenu = (
    <>
      <IconeAdmin nom={item.icone} className={actif ? "text-neutral-900" : "text-neutral-500"} />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {compteur ? (
        <span className="rounded-full bg-neutral-200/70 px-1.5 text-[11px] font-medium leading-5 text-neutral-600">
          {compteur}
        </span>
      ) : null}
      {externe ? <IconeAdmin nom="fleche" className="size-3.5 text-neutral-400" /> : null}
    </>
  );

  const classes = cn(
    "flex items-center gap-3 rounded-lg border px-2.5 py-[7px] text-[14px] transition-colors",
    actif
      ? "border-neutral-200 bg-white font-medium text-neutral-900 shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
      : "border-transparent text-neutral-700 hover:bg-neutral-200/50",
  );

  if (!item.href) {
    return (
      <span title="Lien à venir" className={cn(classes, "cursor-default opacity-60 hover:bg-transparent")}>
        {contenu}
      </span>
    );
  }

  if (item.href.startsWith("https://")) {
    return (
      <a href={item.href} target="_blank" rel="noopener" className={classes}>
        {contenu}
      </a>
    );
  }

  return (
    <Link href={item.href as Route} aria-current={actif ? "page" : undefined} className={classes}>
      {contenu}
    </Link>
  );
}

/**
 * Barre latérale du back-office : marque, recherche (⌘K), rubriques groupées
 * et repliables, puis aide et compte. Servie telle quelle dans le tiroir mobile.
 */
export function BarreLaterale({
  marque,
  compteurs,
  compte,
}: {
  marque: React.ReactNode;
  compteurs: Partial<Record<NonNullable<AdminNavItem["compteur"]>, number>>;
  compte: React.ReactNode;
}) {
  const chemin = usePathname();
  const router = useRouter();
  const recherche = useRef<HTMLInputElement>(null);
  const [filtre, setFiltre] = useState("");
  const [replies, setReplies] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const surTouche = (evenement: KeyboardEvent) => {
      if ((evenement.metaKey || evenement.ctrlKey) && evenement.key.toLowerCase() === "k") {
        evenement.preventDefault();
        recherche.current?.focus();
      }
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, []);

  const terme = normaliser(filtre.trim());
  const groupes = adminNav
    .map((groupe) => ({
      ...groupe,
      items: terme
        ? groupe.items.filter((item) => normaliser(item.label).includes(terme))
        : groupe.items,
    }))
    .filter((groupe) => groupe.items.length > 0);

  return (
    <div className="flex h-full flex-col">
      {marque}

      <form
        role="search"
        className="relative mt-4"
        onSubmit={(evenement) => {
          evenement.preventDefault();
          const premier = groupes.flatMap((g) => g.items).find((item) => item.href);
          if (!premier?.href) return;
          if (premier.href.startsWith("https://")) window.open(premier.href, "_blank", "noopener");
          else router.push(premier.href as Route);
          setFiltre("");
          recherche.current?.blur();
        }}
      >
        <IconeAdmin
          nom="recherche"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
        />
        <input
          ref={recherche}
          type="search"
          value={filtre}
          onChange={(evenement) => setFiltre(evenement.target.value)}
          onKeyDown={(evenement) => {
            if (evenement.key === "Escape") {
              setFiltre("");
              evenement.currentTarget.blur();
            }
          }}
          placeholder="Rechercher…"
          aria-label="Rechercher une rubrique"
          className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-14 text-[14px] outline-none placeholder:text-neutral-400 focus:border-neutral-300 [&::-webkit-search-cancel-button]:hidden"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 gap-1"
        >
          <kbd className="rounded border border-neutral-200 px-1 font-sans text-[10px] leading-4 text-neutral-500">
            ⌘
          </kbd>
          <kbd className="rounded border border-neutral-200 px-1 font-sans text-[10px] leading-4 text-neutral-500">
            K
          </kbd>
        </span>
      </form>

      <nav aria-label="Rubriques du back-office" className="mt-4 flex-1 space-y-5">
        {groupes.map((groupe) => {
          const cle = groupe.titre ?? "principal";
          const replie = !terme && replies[cle];

          return (
            <div key={cle}>
              {groupe.titre ? (
                <button
                  type="button"
                  aria-expanded={!replie}
                  onClick={() => setReplies((etat) => ({ ...etat, [cle]: !etat[cle] }))}
                  className="mb-1 flex w-full items-center justify-between px-2 text-[12px] text-neutral-500 hover:text-neutral-700"
                >
                  {groupe.titre}
                  <IconeAdmin
                    nom="chevronHaut"
                    className={cn("size-3.5 transition-transform", replie && "rotate-180")}
                  />
                </button>
              ) : null}
              {replie ? null : (
                <ul className="space-y-0.5">
                  {groupe.items.map((item) => (
                    <li key={item.label}>
                      <Entree item={item} chemin={chemin} compteurs={compteurs} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {groupes.length === 0 ? (
          <p className="px-2 text-[13px] text-neutral-500">Aucune rubrique ne correspond.</p>
        ) : null}
      </nav>

      <ul className="mt-8 space-y-0.5">
        {adminNavPied.map((item) => (
          <li key={item.label}>
            <Entree item={item} chemin={chemin} compteurs={compteurs} />
          </li>
        ))}
        <li>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 rounded-lg border border-transparent px-2.5 py-[7px] text-[14px] text-neutral-700 transition-colors hover:bg-neutral-200/50"
          >
            <IconeAdmin nom="externe" className="text-neutral-500" />
            Voir le site
          </a>
        </li>
      </ul>

      <div className="mt-4 border-t border-neutral-200 pt-4">{compte}</div>
    </div>
  );
}
