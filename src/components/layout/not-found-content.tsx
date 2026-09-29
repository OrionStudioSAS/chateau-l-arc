import Link from "next/link";
import type { Route } from "next";

import { BoutonOr } from "@/components/ui/bouton-or";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";

/** Pages vers lesquelles on relance le visiteur égaré. */
const departs: { href: Route; titre: string; texte: string }[] = [
  {
    href: "/le-parcours",
    titre: "Le parcours",
    texte: "18 trous, par 70, au cœur de la Provence.",
  },
  {
    href: "/tarifs",
    titre: "Tarifs",
    texte: "Green fees, abonnements et services sur place.",
  },
  {
    href: "/competitions",
    titre: "Compétitions",
    texte: "Calendrier, inscriptions et résultats.",
  },
  {
    href: "/academie",
    titre: "L'académie",
    texte: "Cours, stages et école de golf.",
  },
];

export function NotFoundContent() {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-encre/60">Erreur 404</Surtitre>

          {/* Décor : le titre accessible est le h1 ci-dessous. */}
          <p
            aria-hidden="true"
            className="mt-8 font-butler text-[120px] font-bold uppercase leading-[0.8] tracking-[2px] text-or-500 sm:text-[180px] lg:text-[220px]"
          >
            404
          </p>

          <h1 className="mt-10 font-butler text-[40px] font-medium leading-none tracking-[-1px] text-club-950 sm:text-[56px]">
            Balle perdue
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[18px] font-normal leading-relaxed tracking-[-0.2px] text-encre/70 sm:text-[20px]">
            La page que vous cherchez n&apos;existe pas ou a été déplacée. Pas de
            pénalité : rejouez depuis l&apos;un de ces départs.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <BoutonOr href="/">Retour à l&apos;accueil</BoutonOr>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-sm border border-club-950/20 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-club-950 transition-colors hover:bg-white xl:px-5"
            >
              Nous contacter
            </Link>
          </div>
        </div>

        <ul className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {departs.map((depart, index) => (
            <li key={depart.href}>
              <Link
                href={depart.href}
                className="group flex h-full flex-col rounded-sm bg-white p-6 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(15,42,29,0.35)]"
              >
                <span className="text-[12px] uppercase tracking-[0.2em] text-or-600">
                  Départ {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-4 font-butler text-[24px] font-medium leading-tight text-club-950">
                  {depart.titre}
                </span>
                <span className="mt-2 flex-1 text-[15px] leading-relaxed text-encre/65">
                  {depart.texte}
                </span>
                <span className="mt-6 text-[16px] font-semibold text-club-950 underline-offset-4 group-hover:underline">
                  Y aller <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
