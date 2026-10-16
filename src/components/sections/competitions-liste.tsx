"use client";

import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/ui/container";
import { site } from "@/config/site";
import type { CategorieCompetition, CompetitionAvecEtat } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { libellesCategorie, tonsPastille } from "@/lib/competitions";

type Filtre = "toutes" | "visiteurs" | CategorieCompetition;

const filtres: { cle: Filtre; libelle: string }[] = [
  { cle: "toutes", libelle: "Toutes" },
  { cle: "visiteurs", libelle: "Ouvertes aux visiteurs" },
  { cle: "club", libelle: libellesCategorie.club },
  { cle: "grand-prix", libelle: libellesCategorie["grand-prix"] },
  { cle: "seniors", libelle: libellesCategorie.seniors },
];

const paris = { timeZone: "Europe/Paris" } as const;
const formatJourSemaine = new Intl.DateTimeFormat("fr-FR", { weekday: "short", ...paris });
const formatJour = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", ...paris });
const formatMois = new Intl.DateTimeFormat("fr-FR", { month: "short", ...paris });
const formatMoisAnnee = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", ...paris });
const formatJourMois = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", ...paris });

/** Les dates de la base (AAAA-MM-JJ) lues à midi : pas de bascule de jour. */
const dateDe = (iso: string) => new Date(`${iso.slice(0, 10)}T12:00:00`);
const majuscule = (texte: string) => texte.charAt(0).toUpperCase() + texte.slice(1);

/** Informations à droite de la ligne : places, accès, ouverture des inscriptions. */
function precisions(competition: CompetitionAvecEtat): { titre: string; detail?: string } | null {
  if (competition.modeInscription?.toLowerCase().includes("invitation")) {
    return { titre: "Sur invitation", detail: "Contactez l'accueil" };
  }
  if (competition.etat.cle !== "a-venir") return null;

  const ouverture = competition.inscriptionOuverture
    ? `Inscriptions dès le ${formatJourMois.format(dateDe(competition.inscriptionOuverture))}`
    : undefined;
  if (!competition.ouverteVisiteurs && competition.categorie === "club") {
    return { titre: "Réservé aux membres", detail: ouverture };
  }
  return competition.places
    ? { titre: `${competition.places} places`, detail: ouverture }
    : ouverture
      ? { titre: ouverture }
      : null;
}

function Icone({ nom }: { nom: "telephone" | "cloche" | "liste" | "calendrier" | "telecharger" }) {
  const chemins = {
    telephone: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    ),
    cloche: <path d="M6 17V11a6 6 0 1 1 12 0v6l1.5 2h-15L6 17Zm4 4h4" />,
    liste: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
    calendrier: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M3.5 10h17M8 3v4m8-4v4" />
      </>
    ),
    telecharger: <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />,
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {chemins[nom]}
    </svg>
  );
}

const boutonClair =
  "inline-flex items-center justify-center gap-2 rounded-sm border border-club-950/25 bg-white px-4 py-3 text-[13px] font-semibold text-club-950 transition-colors hover:bg-sable-50";
const boutonFonce =
  "inline-flex items-center justify-center gap-2 rounded-sm bg-club-950 px-5 py-3 text-[13px] font-semibold text-sable-50 transition-colors hover:bg-club-800";

function LigneCompetition({ competition }: { competition: CompetitionAvecEtat }) {
  const date = dateDe(competition.dateDebut);
  const infos = precisions(competition);
  const lien = `/competitions/${competition.slug}` as const;
  const meta = [competition.formule, competition.depart, competition.trous, competition.indexMaximum]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-5 gap-y-4 border-b border-encre/10 py-6 sm:grid-cols-[4.5rem_minmax(0,1fr)] lg:grid-cols-[4.5rem_minmax(0,1fr)_auto] lg:items-center lg:gap-x-8">
      <p className="text-center leading-none">
        <span className="block text-[11px] uppercase tracking-[0.12em] text-encre/45">
          {formatJourSemaine.format(date)}
        </span>
        <span className="mt-1.5 block font-butler text-[34px] font-medium text-club-950 sm:text-[38px]">
          {formatJour.format(date)}
        </span>
        <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.12em] text-or-600">
          {formatMois.format(date)}
        </span>
      </p>

      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
              tonsPastille[competition.etat.ton],
            )}
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
            {competition.etat.libelle}
          </span>
          <span className="rounded-full border border-encre/15 px-2.5 py-1 text-[11px] text-encre/70">
            {competition.ouverteVisiteurs ? "Ouvert à tous" : libellesCategorie[competition.categorie]}
          </span>
        </p>
        <h3 className="mt-2 font-butler text-[24px] font-medium leading-tight text-club-950 sm:text-[28px]">
          <Link href={lien} className="underline-offset-4 hover:underline">
            {competition.nom}
          </Link>
        </h3>
        {meta ? <p className="mt-1.5 text-[13px] text-encre/60">{meta}</p> : null}
      </div>

      <div className="col-span-2 flex flex-wrap items-center gap-3 sm:col-start-2 sm:col-span-1 lg:col-start-3 lg:justify-end">
        {infos ? (
          <p className="mr-2 text-[13px] lg:text-right">
            <span className="block font-semibold text-club-950">{infos.titre}</span>
            {infos.detail ? <span className="block text-[12px] text-encre/50">{infos.detail}</span> : null}
          </p>
        ) : null}

        {competition.etat.cle === "ouverte" ? (
          <>
            <Link href={lien} className={boutonFonce} data-suivi="inscription">
              S&apos;inscrire <span aria-hidden="true">→</span>
            </Link>
            <a href={site.contact.telephoneLien} className={boutonClair}>
              <Icone nom="telephone" />
              Nous appeler
            </a>
          </>
        ) : (
          <Link href={lien} className={boutonClair}>
            <Icone nom="cloche" />
            Être prévenu
          </Link>
        )}
      </div>
    </li>
  );
}

/** Vue calendrier : une grille par mois, compétitions posées sur leurs jours. */
function Calendrier({ mois }: { mois: [string, CompetitionAvecEtat[]][] }) {
  const joursSemaine = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="space-y-12">
      {mois.map(([cle, competitions]) => {
        const [annee, numero] = cle.split("-").map(Number);
        const premier = new Date(annee, numero - 1, 1);
        const decalage = (premier.getDay() + 6) % 7; // lundi en premier
        const nombreJours = new Date(annee, numero, 0).getDate();
        const jours = [
          ...Array.from({ length: decalage }, () => null),
          ...Array.from({ length: nombreJours }, (_, index) => index + 1),
        ];
        // Dernière semaine complétée par des cases vides.
        const cases = [...jours, ...Array.from({ length: (7 - (jours.length % 7)) % 7 }, () => null)];

        const duJour = (jour: number) =>
          competitions.filter((competition) => {
            const debut = Number(competition.dateDebut.slice(8, 10));
            const fin = competition.dateFin?.startsWith(cle)
              ? Number(competition.dateFin.slice(8, 10))
              : debut;
            return jour >= debut && jour <= fin;
          });

        return (
          <section key={cle} aria-label={majuscule(formatMoisAnnee.format(premier))}>
            <h3 className="font-butler text-[24px] font-medium text-club-950">
              {majuscule(formatMoisAnnee.format(premier))}
            </h3>
            <div className="mt-5 grid grid-cols-7 gap-px overflow-hidden rounded-sm border border-encre/10 bg-encre/10">
              {joursSemaine.map((jour) => (
                <p
                  key={jour}
                  className="bg-sable-50 py-2 text-center text-[11px] uppercase tracking-[0.12em] text-encre/50"
                >
                  {jour}
                </p>
              ))}
              {cases.map((jour, index) => (
                <div key={index} className="min-h-[56px] bg-white p-1.5 sm:min-h-[96px] sm:p-2">
                  {jour ? (
                    <>
                      <p className="text-[12px] text-encre/45">{jour}</p>
                      <ul className="mt-1 space-y-1">
                        {duJour(jour).map((competition) => (
                          <li key={competition.id}>
                            <Link
                              href={`/competitions/${competition.slug}`}
                              className={cn(
                                // Sur mobile, une case est trop étroite pour un nom :
                                // une pastille de couleur, le détail est listé sous la grille.
                                "block h-2 rounded-full max-sm:bg-current sm:h-auto sm:truncate sm:rounded-sm sm:px-1.5 sm:py-1 sm:text-[12px] sm:font-medium",
                                tonsPastille[competition.etat.ton],
                              )}
                              title={competition.nom}
                            >
                              <span className="sr-only sm:not-sr-only">{competition.nom}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
            <ul className="mt-4 divide-y divide-encre/10 sm:hidden">
              {competitions.map((competition) => (
                <li key={competition.id}>
                  <Link
                    href={`/competitions/${competition.slug}`}
                    className="flex items-center gap-3 py-3 text-[15px] font-medium text-club-950"
                  >
                    <span
                      aria-hidden="true"
                      className={cn("size-2.5 shrink-0 rounded-full", tonsPastille[competition.etat.ton], "bg-current")}
                    />
                    <span className="w-12 shrink-0 text-[13px] font-normal text-encre/55">
                      {formatJourMois.format(dateDe(competition.dateDebut))}
                    </span>
                    {competition.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function CompetitionsListe({ competitions }: { competitions: CompetitionAvecEtat[] }) {
  const [filtre, setFiltre] = useState<Filtre>("toutes");
  const [vue, setVue] = useState<"liste" | "calendrier">("liste");

  const visibles = competitions
    .filter((competition) => competition.etat.cle !== "terminee")
    .filter((competition) =>
      filtre === "toutes"
        ? true
        : filtre === "visiteurs"
          ? competition.ouverteVisiteurs
          : competition.categorie === filtre,
    );

  // Regroupement par mois, dans l'ordre du calendrier (clé AAAA-MM).
  const parMois = new Map<string, CompetitionAvecEtat[]>();
  for (const competition of visibles) {
    const cle = competition.dateDebut.slice(0, 7);
    parMois.set(cle, [...(parMois.get(cle) ?? []), competition]);
  }
  const mois = [...parMois.entries()];

  return (
    <section className="bg-white">
      {/* Barre de filtres, sous la bannière. */}
      <div className="border-b border-encre/10">
        <Container className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <ul className="sans-barre -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {filtres.map((item) => (
              <li key={item.cle} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setFiltre(item.cle)}
                  aria-pressed={filtre === item.cle}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
                    filtre === item.cle
                      ? "bg-club-950 text-sable-50"
                      : "border border-encre/15 text-club-950 hover:border-encre/35",
                  )}
                >
                  {item.libelle}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-4">
            <div role="group" aria-label="Affichage" className="flex rounded-full bg-sable-100 p-1">
              {(["liste", "calendrier"] as const).map((cle) => (
                <button
                  key={cle}
                  type="button"
                  onClick={() => setVue(cle)}
                  aria-pressed={vue === cle}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-medium transition-colors sm:px-3.5 sm:py-1.5",
                    vue === cle ? "bg-white text-club-950 shadow-sm" : "text-encre/60 hover:text-encre",
                  )}
                >
                  <Icone nom={cle} />
                  {cle === "liste" ? "Liste" : "Calendrier"}
                </button>
              ))}
            </div>
            <a
              href="/competitions/agenda.ics"
              download
              className="flex items-center gap-2 text-[13px] font-semibold text-club-950 underline-offset-4 hover:underline"
            >
              <Icone nom="telecharger" />
              Ajouter à mon agenda
            </a>
          </div>
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        {mois.length === 0 ? (
          <p className="text-center text-[15px] text-encre/60">
            Aucune compétition à venir dans cette catégorie pour le moment.
          </p>
        ) : vue === "calendrier" ? (
          <Calendrier mois={mois} />
        ) : (
          <div className="space-y-12">
            {mois.map(([cle, liste]) => (
              <section key={cle}>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-butler text-[24px] font-medium text-club-950 sm:text-[28px]">
                    {majuscule(formatMoisAnnee.format(dateDe(`${cle}-01`)))}
                  </h2>
                  <p className="text-[12px] text-encre/50">
                    {liste.length} compétition{liste.length > 1 ? "s" : ""}
                  </p>
                </div>
                <ul className="mt-2">
                  {liste.map((competition) => (
                    <LigneCompetition key={competition.id} competition={competition} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
