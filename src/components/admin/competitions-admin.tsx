"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActionState } from "react";

import {
  enregistrerCompetition,
  publierResultats,
} from "@/app/(admin)/admin/(tableau-de-bord)/competitions/actions";
import type {
  EtatCompetitionFormulaire,
  EtatResultats,
} from "@/lib/admin/formulaire-competition";
import type { CompetitionAvecEtat } from "@/lib/api/types";
import { tonsPastille } from "@/lib/competitions";
import { cn } from "@/lib/cn";

const moisCourt = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  timeZone: "Europe/Paris",
});
const jour = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  timeZone: "Europe/Paris",
});

/** Valeur attendue par un champ `datetime-local`, exprimée en heure de Paris. */
function pourDatetimeLocal(iso?: string): string {
  if (!iso) return "";
  const parties = new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const valeur = (type: string) =>
    parties.find((partie) => partie.type === type)?.value ?? "";
  return `${valeur("year")}-${valeur("month")}-${valeur("day")}T${valeur("hour")}:${valeur("minute")}`;
}

const champ =
  "mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-club-600";
const etiquette = "block text-xs font-medium text-neutral-700";
const titreSection =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-or-600";

export function CompetitionsAdmin({
  competitions,
  page,
  pages,
}: {
  competitions: CompetitionAvecEtat[];
  page: number;
  pages: number;
}) {
  const [enEdition, setEnEdition] = useState<CompetitionAvecEtat | null>(null);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [resultatsPour, setResultatsPour] = useState<CompetitionAvecEtat | null>(null);

  const ouvrir = (competition: CompetitionAvecEtat | null) => {
    setEnEdition(competition);
    setModaleOuverte(true);
  };

  return (
    <>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Compétitions
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Créez, ouvrez les inscriptions, publiez les résultats.
          </p>
        </div>

        <button
          type="button"
          onClick={() => ouvrir(null)}
          className="rounded-lg bg-club-950 px-5 py-3 text-sm font-semibold text-sable-50 transition-colors hover:bg-club-800"
        >
          + Nouvelle compétition
        </button>
      </header>

      {competitions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-5 py-12 text-center text-sm text-neutral-500 sm:px-8 sm:py-16">
          Aucune compétition pour le moment.
        </p>
      ) : (
        <ul className="space-y-4">
          {competitions.map((competition) => (
            <li
              key={competition.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:gap-5 sm:p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              <p className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-club-950 leading-none text-sable-50">
                <span className="font-butler text-lg font-bold">
                  {jour.format(new Date(competition.dateDebut))}
                </span>
                <span className="mt-1 text-[10px] uppercase">
                  {moisCourt
                    .format(new Date(competition.dateDebut))
                    .replace(".", "")}
                </span>
              </p>

              <div className="min-w-0 flex-1 basis-[calc(100%-4.5rem)] sm:basis-0">
                <p className="flex flex-wrap items-center gap-2 text-base font-semibold text-neutral-900">
                  {competition.nom}
                  {competition.statut === "brouillon" ? (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase text-neutral-500">
                      Brouillon
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-neutral-500 sm:truncate">
                  {[
                    competition.formule,
                    competition.depart,
                    `${competition.inscrits} inscrits`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>

              {/* Mobile : état et actions passent sous le nom, sur une ligne. */}
              <div className="flex w-full flex-wrap items-center gap-x-5 gap-y-2 border-t border-neutral-100 pt-3 sm:w-auto sm:border-0 sm:pt-0">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-medium",
                    tonsPastille[competition.etat.ton],
                  )}
                >
                  {competition.etat.libelle}
                </span>

                <button
                  type="button"
                  onClick={() => ouvrir(competition)}
                  className="text-sm font-medium text-neutral-800 underline-offset-4 hover:underline"
                >
                  Modifier
                </button>

                {/* Les résultats ne se déposent qu'une fois la compétition passée. */}
                {competition.etat.cle === "terminee" ? (
                  <button
                    type="button"
                    onClick={() => setResultatsPour(competition)}
                    className="text-sm font-medium text-neutral-800 underline-offset-4 hover:underline"
                  >
                    {competition.resultatsPublies ? "Remplacer les résultats" : "Résultats"}
                  </button>
                ) : (
                  <span
                    title="Disponible une fois les inscriptions closes"
                    className="cursor-not-allowed text-sm font-medium text-neutral-300"
                  >
                    Résultats
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 ? (
        <nav
          aria-label="Pagination des compétitions"
          className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-10"
        >
          {Array.from({ length: pages }, (_, index) => index + 1).map((numero) => (
            <Link
              key={numero}
              href={`/admin/competitions?page=${numero}`}
              aria-current={numero === page ? "page" : undefined}
              className={cn(
                "flex size-10 items-center justify-center rounded-lg border text-sm",
                numero === page
                  ? "border-club-950 bg-club-950 font-semibold text-sable-50"
                  : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100",
              )}
            >
              {numero}
            </Link>
          ))}
        </nav>
      ) : null}

      {modaleOuverte ? (
        <ModaleCompetition
          competition={enEdition}
          onFermer={() => setModaleOuverte(false)}
        />
      ) : null}

      {resultatsPour ? (
        <ModaleResultats
          competition={resultatsPour}
          onFermer={() => setResultatsPour(null)}
        />
      ) : null}
    </>
  );
}

function ModaleCompetition({
  competition,
  onFermer,
}: {
  competition: CompetitionAvecEtat | null;
  onFermer: () => void;
}) {
  const router = useRouter();
  const [etat, action, enCours] = useActionState<EtatCompetitionFormulaire, FormData>(
    enregistrerCompetition,
    { statut: "vide" },
  );

  useEffect(() => {
    if (etat.statut === "succes") {
      router.refresh();
      onFermer();
    }
  }, [etat, router, onFermer]);

  useEffect(() => {
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") onFermer();
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [onFermer]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={competition ? "Modifier la compétition" : "Nouvelle compétition"}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-900/40 p-3 sm:p-6"
    >
      <div className="w-full max-w-4xl rounded-2xl bg-white p-5 shadow-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-neutral-900">
            {competition ? "Modifier la compétition" : "Nouvelle compétition"}
          </h2>
          <button
            type="button"
            onClick={onFermer}
            className="text-sm text-neutral-500 hover:text-neutral-800"
          >
            Fermer
          </button>
        </div>

        <form action={action} className="mt-6">
          {competition ? (
            <input type="hidden" name="id" value={competition.id} />
          ) : null}

          <p className={titreSection}>Le jeu</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <label className={etiquette} htmlFor="nom">
                Nom de la compétition
              </label>
              <input
                id="nom"
                name="nom"
                required
                defaultValue={competition?.nom}
                className={champ}
              />
            </div>
            <div>
              <label className={etiquette} htmlFor="dateDebut">
                Date
              </label>
              <input
                id="dateDebut"
                name="dateDebut"
                type="date"
                required
                defaultValue={competition?.dateDebut}
                className={champ}
              />
            </div>
            <div>
              <label className={etiquette} htmlFor="dateFin">
                Date de fin
              </label>
              <input
                id="dateFin"
                name="dateFin"
                type="date"
                defaultValue={competition?.dateFin}
                className={champ}
              />
            </div>
            <div>
              <label className={etiquette} htmlFor="formule">
                Formule
              </label>
              <input
                id="formule"
                name="formule"
                defaultValue={competition?.formule}
                placeholder="Stableford"
                className={champ}
              />
            </div>
            <div>
              <label className={etiquette} htmlFor="trous">
                Trous
              </label>
              <input
                id="trous"
                name="trous"
                defaultValue={competition?.trous}
                placeholder="18 trous"
                className={champ}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={etiquette} htmlFor="depart">
                Départ
              </label>
              <input
                id="depart"
                name="depart"
                defaultValue={competition?.depart}
                placeholder="Shotgun · 9h00"
                className={champ}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={etiquette} htmlFor="indexMaximum">
                Index maximum
              </label>
              <input
                id="indexMaximum"
                name="indexMaximum"
                defaultValue={competition?.indexMaximum}
                placeholder="54 (ouvert à tous)"
                className={champ}
              />
            </div>
            <div>
              <label className={etiquette} htmlFor="categories">
                Catégories
              </label>
              <input
                id="categories"
                name="categories"
                defaultValue={competition?.categories}
                placeholder="Messieurs · Dames"
                className={champ}
              />
            </div>
            <div>
              <label className={etiquette} htmlFor="sponsor">
                Sponsor (facultatif)
              </label>
              <input
                id="sponsor"
                name="sponsor"
                defaultValue={competition?.sponsor}
                className={champ}
              />
            </div>
          </div>

          <p className={cn(titreSection, "mt-8")}>Inscriptions</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <label className={etiquette} htmlFor="inscriptionOuverture">
                Ouverture
              </label>
              <input
                id="inscriptionOuverture"
                name="inscriptionOuverture"
                type="date"
                defaultValue={competition?.inscriptionOuverture}
                className={champ}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={etiquette} htmlFor="inscriptionCloture">
                Clôture
              </label>
              <input
                id="inscriptionCloture"
                name="inscriptionCloture"
                type="datetime-local"
                defaultValue={pourDatetimeLocal(competition?.inscriptionCloture)}
                className={champ}
              />
            </div>
            <div>
              <label className={etiquette} htmlFor="places">
                Places
              </label>
              <input
                id="places"
                name="places"
                type="number"
                min={0}
                defaultValue={competition?.places}
                className={champ}
              />
            </div>
            <div>
              <label className={etiquette} htmlFor="modeInscription">
                Mode d&apos;inscription
              </label>
              <input
                id="modeInscription"
                name="modeInscription"
                defaultValue={competition?.modeInscription}
                placeholder="Formulaire sur le site"
                className={champ}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={etiquette} htmlFor="droitJeuMembres">
                Droit de jeu — membres
              </label>
              <input
                id="droitJeuMembres"
                name="droitJeuMembres"
                defaultValue={competition?.droitJeuMembres}
                placeholder="15 €"
                className={champ}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={etiquette} htmlFor="droitJeuVisiteurs">
                Droit de jeu — visiteurs
              </label>
              <input
                id="droitJeuVisiteurs"
                name="droitJeuVisiteurs"
                defaultValue={competition?.droitJeuVisiteurs}
                placeholder="15 € + green fee"
                className={champ}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={etiquette} htmlFor="inclus">
                Inclus
              </label>
              <input
                id="inclus"
                name="inclus"
                defaultValue={competition?.inclus}
                placeholder="Remise des prix · cocktail"
                className={champ}
              />
            </div>
          </div>

          <p className={cn(titreSection, "mt-8")}>Présentation sur le site</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className={etiquette} htmlFor="description">
                Description / règlement
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={competition?.description}
                className={champ}
              />
            </div>
            <div>
              <p className={etiquette}>Affiche (facultatif)</p>
              <p className="mt-2 flex h-[86px] items-center justify-center rounded-lg border border-dashed border-neutral-300 px-4 text-center text-xs text-neutral-400">
                Dépôt d&apos;image à venir
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              name="statut"
              value="publie"
              disabled={enCours}
              className="rounded-lg bg-club-950 px-5 py-3 text-sm font-semibold text-sable-50 transition-colors hover:bg-club-800 disabled:opacity-60"
            >
              {enCours ? "Enregistrement…" : "Publier sur le site"}
            </button>
            <button
              type="submit"
              name="statut"
              value="brouillon"
              disabled={enCours}
              className="rounded-lg border border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-60"
            >
              Enregistrer en brouillon
            </button>
            <p className="text-xs text-neutral-500">
              Après la compétition : publication des résultats (PDF) à venir.
            </p>
          </div>

          {etat.statut === "erreur" ? (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {etat.message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

function ModaleResultats({
  competition,
  onFermer,
}: {
  competition: CompetitionAvecEtat;
  onFermer: () => void;
}) {
  const router = useRouter();
  const [etat, action, enCours] = useActionState<EtatResultats, FormData>(
    publierResultats,
    { statut: "vide" },
  );

  useEffect(() => {
    if (etat.statut === "succes") {
      router.refresh();
      onFermer();
    }
  }, [etat, router, onFermer]);

  useEffect(() => {
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") onFermer();
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [onFermer]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Publier les résultats"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-900/40 p-3 sm:p-6"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-neutral-900">
            Résultats — {competition.nom}
          </h2>
          <button
            type="button"
            onClick={onFermer}
            className="text-sm text-neutral-500 hover:text-neutral-800"
          >
            Fermer
          </button>
        </div>

        <form action={action} className="mt-6">
          <input type="hidden" name="id" value={competition.id} />
          <input type="hidden" name="slug" value={competition.slug} />

          <label className={etiquette} htmlFor="fichier">
            Classement au format PDF
          </label>
          <input
            id="fichier"
            name="fichier"
            type="file"
            accept="application/pdf"
            required
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm"
          />
          <p className="mt-2 text-xs text-neutral-500">
            10 Mo maximum. Le document sera téléchargeable depuis la page
            compétitions.
          </p>

          {competition.resultatsPublies && competition.resultatsUrl ? (
            <p className="mt-4 text-xs text-neutral-500">
              Fichier actuel :{" "}
              <a
                href={competition.resultatsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-4"
              >
                consulter
              </a>
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={enCours}
              className="rounded-lg bg-club-950 px-5 py-3 text-sm font-semibold text-sable-50 transition-colors hover:bg-club-800 disabled:opacity-60"
            >
              {enCours ? "Envoi…" : "Publier les résultats"}
            </button>
          </div>

          {etat.statut === "erreur" ? (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {etat.message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
