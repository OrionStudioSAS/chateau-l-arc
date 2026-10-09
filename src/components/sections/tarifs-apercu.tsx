"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";

import { Container } from "@/components/ui/container";
import { LienFleche } from "@/components/ui/lien-fleche";
import { Surtitre } from "@/components/ui/surtitre";
import { cn } from "@/lib/cn";

type Saison = "haute" | "basse";

type Formule = {
  libelle: string;
  /** Prix par saison : seul le 9 trous change d'une saison à l'autre. */
  prix: Record<Saison, string>;
  unite: string;
  texte: string;
  points: Record<Saison, string[]>;
  action: { label: string; href: Route };
  miseEnAvant?: string;
};

/**
 * TODO : grille reprise de src/lib/tarifs.ts et de la maquette, à faire
 * valider par le club (notamment les mentions sous chaque prix).
 */
const formules: Formule[] = [
  {
    libelle: "9 trous",
    prix: { haute: "55 €", basse: "45 €" },
    unite: "/ joueur",
    texte: "Idéal pour une partie après le travail ou une découverte du parcours.",
    points: {
      haute: ["7 j/7, toute la journée", "Basse saison : 45 €"],
      basse: ["7 j/7, toute la journée", "Haute saison : 55 €"],
    },
    action: { label: "Réserver", href: "/reserver" },
  },
  {
    libelle: "18 trous",
    prix: { haute: "85 €", basse: "85 €" },
    unite: "/ joueur",
    texte: "Le parcours complet, à jouer à votre rythme sur la journée.",
    points: {
      haute: ["Même tarif toute l'année", "Réservation en ligne", "Voiturette 40 € en option"],
      basse: ["Même tarif toute l'année", "Réservation en ligne", "Voiturette 40 € en option"],
    },
    action: { label: "Réserver un départ", href: "/reserver" },
    miseEnAvant: "Le plus joué",
  },
  {
    libelle: "Carnet 5 + 1 · 18 trous",
    prix: { haute: "350 €", basse: "350 €" },
    unite: "le carnet",
    texte: "Six green fees pour le prix de cinq, le sixième est offert.",
    points: {
      haute: ["Soit 58 € le green fee", "Carnet 10 + 2 : 700 €"],
      basse: ["Soit 58 € le green fee", "Carnet 10 + 2 : 700 €"],
    },
    action: { label: "Acheter un carnet", href: "/tarifs" },
  },
];

const saisons: { cle: Saison; libelle: string }[] = [
  { cle: "haute", libelle: "Haute saison" },
  { cle: "basse", libelle: "Basse saison" },
];

/** Bloc tarifs de l'accueil : trois formules et bascule haute / basse saison. */
export function TarifsApercu() {
  const [saison, setSaison] = useState<Saison>("haute");

  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-or-600">Tarifs</Surtitre>

          <h2 className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            Des tarifs simples, toute l&apos;année
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[14px] text-encre/55">
            Haute saison du 16 avril au 14 novembre · basse saison du 15 novembre au 15
            avril.
          </p>

          <div
            role="group"
            aria-label="Saison"
            className="mt-6 inline-flex rounded-full bg-sable-100 p-1"
          >
            {saisons.map((item) => (
              <button
                key={item.cle}
                type="button"
                aria-pressed={saison === item.cle}
                onClick={() => setSaison(item.cle)}
                className={cn(
                  "rounded-full px-5 py-2 text-[13px] font-medium transition-colors",
                  saison === item.cle
                    ? "bg-club-950 text-sable-50"
                    : "text-encre/70 hover:text-encre",
                )}
              >
                {item.libelle}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3 md:gap-4 lg:gap-5">
          {formules.map((formule) => {
            const fonce = Boolean(formule.miseEnAvant);
            return (
              <li
                key={formule.libelle}
                className={cn(
                  "flex flex-col rounded-sm p-7 lg:p-8",
                  fonce ? "bg-club-950 text-sable-50" : "border border-encre/10 bg-white",
                )}
              >
                <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-or-500">
                  {formule.libelle}
                  {formule.miseEnAvant ? (
                    <span className="rounded-full bg-or-500 px-2.5 py-0.5 text-[10px] tracking-[0.08em] text-white">
                      {formule.miseEnAvant}
                    </span>
                  ) : null}
                </p>

                <p className="mt-4 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-butler text-[44px] font-medium leading-none lg:text-[52px]",
                      fonce ? "text-sable-50" : "text-club-950",
                    )}
                  >
                    {formule.prix[saison]}
                  </span>
                  <span className={cn("text-[13px]", fonce ? "text-sable-50/60" : "text-encre/50")}>
                    {formule.unite}
                  </span>
                </p>

                <p className={cn("mt-4 text-[14px] leading-relaxed", fonce ? "text-sable-50/75" : "text-encre/65")}>
                  {formule.texte}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {formule.points[saison].map((point) => (
                    <li
                      key={point}
                      className={cn("flex gap-2.5 text-[13px]", fonce ? "text-sable-50/85" : "text-encre/70")}
                    >
                      <span aria-hidden="true" className={fonce ? "text-or-400" : "text-club-600"}>
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  href={formule.action.href}
                  className={cn(
                    "mt-8 flex items-center justify-center gap-2 rounded-sm px-5 py-3.5 text-[13px] font-semibold transition-colors",
                    fonce
                      ? "bg-or-500 text-white hover:bg-or-600"
                      : "border border-club-950/25 text-club-950 hover:bg-sable-50",
                  )}
                >
                  {formule.action.label} <span aria-hidden="true">→</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-[13px] text-encre/55">
          <span>Voiturette 40 € · Chariot manuel 5 € · Seau de balles 4 €</span>
          <LienFleche href="/tarifs" className="text-[13px]">
            Tous les tarifs et abonnements
          </LienFleche>
        </p>
      </Container>
    </section>
  );
}
