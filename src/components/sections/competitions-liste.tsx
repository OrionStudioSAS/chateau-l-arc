"use client";

import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/ui/container";
import { formatJour, formatMoisCourt } from "@/lib/format";
import { tonsPastille } from "@/lib/competitions";
import { cn } from "@/lib/cn";
import type { CategorieCompetition, CompetitionAvecEtat } from "@/lib/api/types";

const filtres: { cle: CategorieCompetition | "toutes"; libelle: string }[] = [
  { cle: "toutes", libelle: "Toutes" },
  { cle: "club", libelle: "Club" },
  { cle: "grand-prix", libelle: "Grand Prix" },
  { cle: "sponsorisee", libelle: "Sponsorisées" },
  { cle: "loisir", libelle: "Loisir" },
];

export function CompetitionsListe({
  competitions,
  saison,
}: {
  competitions: CompetitionAvecEtat[];
  saison: number;
}) {
  const [filtre, setFiltre] = useState<CategorieCompetition | "toutes">("toutes");
  const [toutAfficher, setToutAfficher] = useState(false);

  const visibles = competitions
    .filter((competition) => filtre === "toutes" || competition.categorie === filtre)
    .filter((competition) => toutAfficher || competition.etat.cle !== "terminee");

  return (
    <section className="bg-sable-100 py-14 lg:py-20">
      <Container>
        {/* Mobile : une rangée qui défile horizontalement plutôt que des filtres
            répartis sur plusieurs lignes. */}
        <ul className="sans-barre -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:px-0">
          {filtres.map((item) => (
            <li key={item.cle} className="shrink-0">
              <button
                type="button"
                onClick={() => setFiltre(item.cle)}
                aria-pressed={filtre === item.cle}
                className={cn(
                  "whitespace-nowrap rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors sm:px-6 sm:py-3 sm:text-[15px]",
                  filtre === item.cle
                    ? "bg-club-950 text-sable-50"
                    : "border border-club-950/15 bg-white text-club-950 hover:border-club-950/40",
                )}
              >
                {item.libelle}
              </button>
            </li>
          ))}
        </ul>

        {visibles.length === 0 ? (
          <p className="mt-12 text-center text-[16px] text-encre/60">
            Aucune compétition dans cette catégorie pour le moment.
          </p>
        ) : (
          <ul className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
            {visibles.map((competition) => (
              <li
                key={competition.id}
                className="flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 sm:gap-5 sm:p-5"
              >
                <p className="flex size-16 shrink-0 flex-col items-center justify-center rounded-lg bg-club-950 leading-none text-sable-50">
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em]">
                    {formatMoisCourt(competition.dateDebut)}
                  </span>
                  <span className="mt-1.5 font-butler text-[22px] font-bold">
                    {formatJour(competition.dateDebut)}
                  </span>
                </p>

                <div className="min-w-0 flex-1 basis-[calc(100%-5rem)] sm:basis-0">
                  <h3 className="font-butler text-[20px] sm:text-[22px] font-bold leading-tight text-club-950">
                    <Link
                      href={`/competitions/${competition.slug}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {competition.nom}
                    </Link>
                  </h3>

                  <p className="mt-1 text-[14px] text-gris-500 sm:text-[15px]">
                    {[
                      competition.formule,
                      competition.depart,
                      competition.indexMaximum,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <p
                    className={cn(
                      "mt-2 inline-block rounded-full px-3 py-1 text-[12px] font-medium",
                      tonsPastille[competition.etat.ton],
                    )}
                  >
                    {competition.etat.libelle}
                  </p>
                </div>

                {/* Terminé : plus rien à faire, le bouton devient un simple état. */}
                {competition.etat.cle === "terminee" ? (
                  <span className="w-full cursor-not-allowed rounded-lg border border-club-950/15 px-6 py-3 text-center text-[16px] font-medium text-encre/40 sm:w-auto">
                    Terminé
                  </span>
                ) : (
                  <Link
                    href={`/competitions/${competition.slug}`}
                    className={cn(
                      "w-full rounded-lg px-6 py-3 text-center text-[16px] font-medium transition-colors sm:w-auto",
                      competition.etat.cle === "ouverte"
                        ? "bg-or-500 text-white hover:bg-or-600"
                        : "border border-club-950/20 text-club-950 hover:bg-club-950/5",
                    )}
                  >
                    {competition.etat.action}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setToutAfficher((valeur) => !valeur)}
            className="text-[16px] font-semibold text-club-950 underline-offset-4 hover:underline"
          >
            {toutAfficher
              ? "Voir seulement les compétitions à venir"
              : `Voir toute la saison ${saison}`}{" "}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </Container>
    </section>
  );
}
