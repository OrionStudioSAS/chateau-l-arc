"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

import {
  changerStatutCompetition,
  supprimerCompetition,
} from "@/app/(admin)/admin/(tableau-de-bord)/competitions/actions";
import { AssistantCompetition } from "@/components/admin/competitions/assistant";
import { ModaleResultats } from "@/components/admin/competitions/resultats";
import { IconeAdmin, type NomIconeAdmin } from "@/components/admin/icone-admin";
import {
  brouillonVide,
  versBrouillon,
  type BrouillonCompetition,
} from "@/lib/admin/brouillon-competition";
import type { CategorieCompetition, CompetitionAvecEtat } from "@/lib/api/types";
import { libellesCategorie } from "@/lib/competitions";
import { cn } from "@/lib/cn";

type Onglet = "a-venir" | "brouillons" | "terminees" | "toutes";
type Ton = "vert" | "bleu" | "gris" | "ambre";

const FUSEAU = "Europe/Paris";
const jourMois = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", timeZone: FUSEAU });
const heure = new Intl.DateTimeFormat("fr-FR", { hour: "numeric", minute: "2-digit", timeZone: FUSEAU });
const moisAnnee = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });
const jourTuile = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", timeZone: "UTC" });
const moisTuile = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" });

const midi = (jour: string) => new Date(`${jour}T12:00:00Z`);
const majuscule = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const fin = (c: CompetitionAvecEtat) => c.dateFin ?? c.dateDebut;

/** État affiché dans le back-office : plus précis que celui du site public. */
function etatAdmin(c: CompetitionAvecEtat, aujourdhui: string, maintenant: number): { libelle: string; ton: Ton } {
  if (c.statut === "brouillon") return { libelle: "Brouillon", ton: "gris" };
  if (fin(c) < aujourdhui) {
    return c.resultatsPublies
      ? { libelle: "Résultats publiés", ton: "gris" }
      : { libelle: "Résultats à publier", ton: "ambre" };
  }
  if (c.inscriptionOuverture && c.inscriptionOuverture > aujourdhui) {
    return { libelle: `Ouverture le ${jourMois.format(midi(c.inscriptionOuverture))}`, ton: "bleu" };
  }
  if (c.inscriptionCloture && new Date(c.inscriptionCloture).getTime() < maintenant) {
    return { libelle: "Inscriptions closes", ton: "gris" };
  }
  return { libelle: "Inscriptions ouvertes", ton: "vert" };
}

function cloture(c: CompetitionAvecEtat, aujourdhui: string, maintenant: number): { texte: string; urgent?: boolean } {
  if (c.statut === "brouillon") return { texte: "—" };
  if (fin(c) < aujourdhui) return { texte: "Terminée" };
  if (!c.inscriptionCloture) return { texte: "—" };
  const date = new Date(c.inscriptionCloture);
  const jours = Math.ceil((date.getTime() - maintenant) / 86_400_000);
  if (jours >= 0 && jours <= 3 && !(c.inscriptionOuverture && c.inscriptionOuverture > aujourdhui)) {
    return {
      texte: jours === 0 ? `Aujourd'hui · ${heure.format(date).replace(":", "h")}` : jours === 1 ? "Demain" : `Dans ${jours} jours`,
      urgent: true,
    };
  }
  return { texte: `${jourMois.format(date)} · ${heure.format(date).replace(":00", "h").replace(":", "h")}` };
}

const tons: Record<Ton, string> = {
  vert: "bg-emerald-50 text-emerald-700 [&>i]:bg-emerald-500",
  bleu: "bg-blue-50 text-blue-700 [&>i]:bg-blue-500",
  gris: "bg-neutral-100 text-neutral-600 [&>i]:bg-neutral-400",
  ambre: "bg-amber-50 text-amber-800 [&>i]:bg-amber-500",
};

function Pastille({ libelle, ton }: { libelle: string; ton: Ton }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[13px] font-medium", tons[ton])}>
      <i aria-hidden="true" className="size-1.5 rounded-full" />
      {libelle}
    </span>
  );
}

function Tuile({ jour, terminee }: { jour: string; terminee: boolean }) {
  const date = midi(jour);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 flex-col items-center justify-center rounded-md leading-none",
        terminee ? "border border-neutral-200 bg-neutral-50 text-neutral-500" : "bg-club-950 text-white",
      )}
    >
      <span className="font-butler text-[16px] font-bold">{jourTuile.format(date)}</span>
      <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide opacity-80">
        {moisTuile.format(date).replace(".", "")}
      </span>
    </span>
  );
}

/** Menu « … » d'une ligne. */
function Menu({ actions }: { actions: { libelle: string; icone: NomIconeAdmin; onClick: () => void; danger?: boolean }[] }) {
  const [ouvert, setOuvert] = useState(false);
  const zone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !zone.current?.contains(e.target as Node)) setOuvert(false);
    };
    document.addEventListener("mousedown", fermer);
    document.addEventListener("keydown", fermer);
    return () => {
      document.removeEventListener("mousedown", fermer);
      document.removeEventListener("keydown", fermer);
    };
  }, [ouvert]);

  return (
    <div ref={zone} className="relative">
      <button
        type="button"
        aria-label="Plus d'actions"
        aria-expanded={ouvert}
        onClick={() => setOuvert((v) => !v)}
        className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
      >
        <IconeAdmin nom="points" className="size-5" />
      </button>
      {ouvert ? (
        <ul className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg">
          {actions.map((action) => (
            <li key={action.libelle}>
              <button
                type="button"
                onClick={() => {
                  setOuvert(false);
                  action.onClick();
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[14px] hover:bg-neutral-100",
                  action.danger ? "text-red-700" : "text-neutral-800",
                )}
              >
                <IconeAdmin nom={action.icone} className="size-4 opacity-70" />
                {action.libelle}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type Edition = {
  initial: BrouillonCompetition;
  statut: "publie" | "brouillon" | null;
  titre: string;
  memoriser: boolean;
};

function exporterCsv(competitions: CompetitionAvecEtat[]) {
  const colonnes: [string, (c: CompetitionAvecEtat) => string | number | undefined | null][] = [
    ["Nom", (c) => c.nom],
    ["Date", (c) => c.dateDebut],
    ["Fin", (c) => c.dateFin],
    ["Type", (c) => libellesCategorie[c.categorie]],
    ["Formule", (c) => c.formule],
    ["Départ", (c) => c.depart],
    ["Trous", (c) => c.trous],
    ["Catégories", (c) => c.categories],
    ["Statut", (c) => (c.statut === "publie" ? "Publiée" : "Brouillon")],
    ["Ouverture inscriptions", (c) => c.inscriptionOuverture],
    ["Clôture inscriptions", (c) => c.inscriptionCloture],
    ["Places", (c) => c.places],
    ["Inscrits", (c) => c.inscrits],
    ["Sponsor", (c) => c.sponsor],
    ["Vainqueurs", (c) => c.vainqueurs],
  ];
  const cellule = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lignes = [
    colonnes.map(([titre]) => cellule(titre)).join(";"),
    ...competitions.map((c) => colonnes.map(([, lire]) => cellule(lire(c))).join(";")),
  ];
  // BOM : Excel lit alors correctement les accents.
  const blob = new Blob([`﻿${lignes.join("\r\n")}`], { type: "text/csv;charset=utf-8" });
  const lien = document.createElement("a");
  lien.href = URL.createObjectURL(blob);
  lien.download = `competitions-${new Date().toISOString().slice(0, 10)}.csv`;
  lien.click();
  URL.revokeObjectURL(lien.href);
}

/**
 * Écran « Compétitions » du back-office (maquette) : onglets, recherche,
 * filtres, vue liste groupée par mois ou calendrier, et assistant de saisie.
 */
export function CompetitionsAdmin({
  competitions,
  aujourdhui,
  maintenant,
}: {
  competitions: CompetitionAvecEtat[];
  aujourdhui: string;
  maintenant: number;
}) {
  const router = useRouter();
  const [onglet, setOnglet] = useState<Onglet>("a-venir");
  const [recherche, setRecherche] = useState("");
  const [types, setTypes] = useState<CategorieCompetition[]>([]);
  const [visiteursSeuls, setVisiteursSeuls] = useState(false);
  const [filtreOuvert, setFiltreOuvert] = useState(false);
  const [vue, setVue] = useState<"liste" | "calendrier">("liste");
  const [edition, setEdition] = useState<Edition | null>(null);
  const [resultatsPour, setResultatsPour] = useState<CompetitionAvecEtat | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null);
  const [, demarrer] = useTransition();
  const champRecherche = useRef<HTMLInputElement>(null);

  const afficher = useCallback((ok: boolean, texte: string) => {
    setMessage({ ok, texte });
    window.setTimeout(() => setMessage(null), 4000);
  }, []);

  const nouvelle = useCallback(
    () => setEdition({ initial: brouillonVide(), statut: null, titre: "Nouvelle compétition", memoriser: true }),
    [],
  );

  // « N » : nouvelle compétition (hors saisie).
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      const cible = e.target as HTMLElement;
      if (edition || resultatsPour || e.metaKey || e.ctrlKey || e.altKey) return;
      if (/INPUT|TEXTAREA|SELECT/.test(cible.tagName) || cible.isContentEditable) return;
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        nouvelle();
      }
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [edition, resultatsPour, nouvelle]);

  const aVenir = competitions.filter((c) => fin(c) >= aujourdhui);
  const terminees = competitions.filter((c) => fin(c) < aujourdhui);
  const brouillons = competitions.filter((c) => c.statut === "brouillon");
  // Terminées depuis moins de 60 jours sans résultats : rappelées sous « À venir ».
  const limiteRecentes = new Date(midi(aujourdhui).getTime() - 60 * 86_400_000).toISOString().slice(0, 10);
  const recentesSansResultats = terminees.filter(
    (c) => c.statut === "publie" && !c.resultatsPublies && fin(c) >= limiteRecentes,
  );

  const onglets: { cle: Onglet; libelle: string; nombre?: number }[] = [
    { cle: "a-venir", libelle: "À venir", nombre: aVenir.length },
    { cle: "brouillons", libelle: "Brouillons", nombre: brouillons.length },
    { cle: "terminees", libelle: "Terminées", nombre: terminees.length },
    { cle: "toutes", libelle: "Toutes" },
  ];

  const filtrer = useCallback(
    (liste: CompetitionAvecEtat[]) => {
      const terme = recherche.trim().toLowerCase();
      return liste.filter(
        (c) =>
          (!terme ||
            [c.nom, c.sponsor, c.formule, c.categories].some((v) => v?.toLowerCase().includes(terme))) &&
          (types.length === 0 || types.includes(c.categorie)) &&
          (!visiteursSeuls || c.ouverteVisiteurs),
      );
    },
    [recherche, types, visiteursSeuls],
  );

  const selection = useMemo(() => {
    const base =
      onglet === "a-venir" ? aVenir : onglet === "brouillons" ? brouillons : onglet === "terminees" ? terminees : competitions;
    const triee = [...filtrer(base)].sort((a, b) =>
      onglet === "terminees" ? b.dateDebut.localeCompare(a.dateDebut) : a.dateDebut.localeCompare(b.dateDebut),
    );
    return triee;
  }, [onglet, aVenir, brouillons, terminees, competitions, filtrer]);

  const groupes = useMemo(() => {
    const parMois = new Map<string, CompetitionAvecEtat[]>();
    for (const c of selection) {
      const cle = c.dateDebut.slice(0, 7);
      parMois.set(cle, [...(parMois.get(cle) ?? []), c]);
    }
    const liste = [...parMois].map(([cle, items]) => ({
      titre: majuscule(moisAnnee.format(midi(`${cle}-15`))),
      items,
    }));
    if (onglet === "a-venir") {
      const recentes = filtrer(recentesSansResultats);
      if (recentes.length) liste.push({ titre: "Terminées récemment", items: recentes });
    }
    return liste;
  }, [selection, onglet, filtrer, recentesSansResultats]);

  const modifier = (c: CompetitionAvecEtat) =>
    setEdition({ initial: versBrouillon(c), statut: c.statut, titre: "Modifier la compétition", memoriser: true });

  const dupliquer = (c: CompetitionAvecEtat) =>
    setEdition({
      initial: {
        ...versBrouillon(c),
        id: null,
        nom: `${c.nom} (copie)`,
        inscrits: "0",
        afficheUrl: null,
        reglementUrl: null,
      },
      statut: null,
      titre: "Nouvelle compétition",
      memoriser: false,
    });

  const executer = (action: () => Promise<{ ok: boolean; message: string }>) =>
    demarrer(async () => {
      const resultat = await action();
      afficher(resultat.ok, resultat.message);
      if (resultat.ok) router.refresh();
    });

  const actionsDe = (c: CompetitionAvecEtat) => [
    { libelle: "Modifier", icone: "crayon" as const, onClick: () => modifier(c) },
    ...(c.statut === "publie"
      ? [{ libelle: "Voir sur le site", icone: "externe" as const, onClick: () => window.open(`/competitions/${c.slug}`, "_blank", "noopener") }]
      : []),
    { libelle: "Dupliquer", icone: "copie" as const, onClick: () => dupliquer(c) },
    ...(fin(c) < aujourdhui && c.statut === "publie"
      ? [{ libelle: c.resultatsPublies ? "Remplacer les résultats" : "Publier les résultats", icone: "envoi" as const, onClick: () => setResultatsPour(c) }]
      : []),
    c.statut === "publie"
      ? { libelle: "Repasser en brouillon", icone: "page" as const, onClick: () => executer(() => changerStatutCompetition(c.id, "brouillon")) }
      : { libelle: "Publier", icone: "envoi" as const, onClick: () => executer(() => changerStatutCompetition(c.id, "publie")) },
    {
      libelle: "Supprimer",
      icone: "corbeille" as const,
      danger: true,
      onClick: () => {
        if (window.confirm(`Supprimer « ${c.nom} » ? Ses fichiers (affiche, règlement, résultats) seront retirés du site.`)) {
          executer(() => supprimerCompetition(c.id));
        }
      },
    },
  ];

  const fermerEdition = useCallback(() => setEdition(null), []);
  const surEnregistre = useCallback(
    (texte: string) => {
      setEdition(null);
      afficher(true, texte);
      router.refresh();
    },
    [afficher, router],
  );
  const fermerResultats = useCallback(() => setResultatsPour(null), []);
  const surResultats = useCallback(
    (texte: string) => {
      setResultatsPour(null);
      afficher(true, texte);
      router.refresh();
    },
    [afficher, router],
  );

  const filtresActifs = types.length + (visiteursSeuls ? 1 : 0);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">Compétitions</h1>
          <p className="mt-1 text-[14px] text-neutral-500">
            Créez une compétition, ouvrez les inscriptions et publiez les résultats.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => exporterCsv(selection)}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[14px] font-medium text-neutral-800 hover:bg-neutral-50"
          >
            <IconeAdmin nom="telechargement" className="size-4" />
            Exporter
          </button>
          <button
            type="button"
            onClick={nouvelle}
            className="inline-flex items-center gap-2 rounded-lg bg-club-950 px-3 py-2 text-[14px] font-medium text-white hover:bg-club-800"
          >
            <IconeAdmin nom="plus" className="size-4" />
            Nouvelle compétition
            <kbd aria-hidden="true" className="hidden rounded bg-white px-1.5 font-sans text-[11px] font-semibold text-club-950 sm:inline">
              N
            </kbd>
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-neutral-200">
        <nav aria-label="Filtrer par état" className="-mb-px flex gap-5 overflow-x-auto">
          {onglets.map((o) => (
            <button
              key={o.cle}
              type="button"
              aria-current={onglet === o.cle ? "page" : undefined}
              onClick={() => setOnglet(o.cle)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 pb-2.5 text-[14px] transition-colors",
                onglet === o.cle ? "border-neutral-900 font-medium text-neutral-900" : "border-transparent text-neutral-500 hover:text-neutral-800",
              )}
            >
              {o.libelle}
              {o.nombre !== undefined ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px] font-semibold leading-[18px]",
                    onglet === o.cle ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500",
                  )}
                >
                  {o.nombre}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="mb-2 flex w-full flex-wrap gap-2 sm:w-auto">
          <div className="relative min-w-0 flex-1 sm:w-60 sm:flex-none">
            <IconeAdmin nom="recherche" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              ref={champRecherche}
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher une compétition…"
              aria-label="Rechercher une compétition"
              className="w-full rounded-lg border border-neutral-200 py-1.5 pl-9 pr-3 text-[14px] outline-none placeholder:text-neutral-400 focus:border-neutral-300"
            />
          </div>
          <div className="relative">
            <button
              type="button"
              aria-expanded={filtreOuvert}
              onClick={() => setFiltreOuvert((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[14px] font-medium",
                filtresActifs ? "border-club-800 text-club-900" : "border-neutral-200 text-neutral-800 hover:bg-neutral-50",
              )}
            >
              <IconeAdmin nom="filtre" className="size-4" />
              Filtrer
              {filtresActifs ? <span className="rounded-full bg-club-800 px-1.5 text-[11px] text-white">{filtresActifs}</span> : null}
            </button>
            {filtreOuvert ? (
              <div className="absolute right-0 top-full z-20 mt-1 w-60 rounded-lg border border-neutral-200 bg-white p-3 shadow-lg">
                <p className="text-[12px] font-medium uppercase tracking-wide text-neutral-500">Type</p>
                {Object.entries(libellesCategorie).map(([valeur, libelle]) => (
                  <label key={valeur} className="mt-2 flex items-center gap-2 text-[14px]">
                    <input
                      type="checkbox"
                      checked={types.includes(valeur as CategorieCompetition)}
                      onChange={(e) =>
                        setTypes((t) => (e.target.checked ? [...t, valeur as CategorieCompetition] : t.filter((v) => v !== valeur)))
                      }
                      className="accent-club-800"
                    />
                    {libelle}
                  </label>
                ))}
                <label className="mt-3 flex items-center gap-2 border-t border-neutral-200 pt-3 text-[14px]">
                  <input type="checkbox" checked={visiteursSeuls} onChange={(e) => setVisiteursSeuls(e.target.checked)} className="accent-club-800" />
                  Ouvertes aux visiteurs
                </label>
                {filtresActifs ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTypes([]);
                      setVisiteursSeuls(false);
                    }}
                    className="mt-3 text-[13px] text-neutral-600 underline underline-offset-4"
                  >
                    Effacer les filtres
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
          <div role="radiogroup" aria-label="Affichage" className="flex rounded-lg bg-neutral-100 p-0.5">
            {(
              [
                ["liste", "grille", "Liste"],
                ["calendrier", "calendrier", "Calendrier"],
              ] as const
            ).map(([cle, icone, libelle]) => (
              <button
                key={cle}
                type="button"
                role="radio"
                aria-checked={vue === cle}
                aria-label={libelle}
                onClick={() => setVue(cle)}
                className={cn("rounded-md px-2 py-1", vue === cle ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500")}
              >
                <IconeAdmin nom={icone} className="size-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {vue === "calendrier" ? (
        <Calendrier competitions={selection} aujourdhui={aujourdhui} maintenant={maintenant} onOuvrir={modifier} />
      ) : groupes.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-neutral-300 px-5 py-12 text-center text-[14px] text-neutral-500">
          {recherche || filtresActifs ? "Aucune compétition ne correspond." : "Aucune compétition ici pour l'instant."}
        </p>
      ) : (
        <div className="mt-5 rounded-xl border border-neutral-200">
          <div className="hidden grid-cols-[minmax(0,1fr)_200px_150px_92px] border-b border-neutral-200 px-4 py-2.5 text-[13px] text-neutral-500 md:grid">
            <span>Compétition</span>
            <span>Statut</span>
            <span>Clôture</span>
            <span />
          </div>
          {groupes.map((groupe) => (
            <section key={groupe.titre}>
              <h2 className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-[13px] font-semibold text-neutral-800">
                {groupe.titre} <span className="ml-1 font-normal text-neutral-500">{groupe.items.length}</span>
              </h2>
              <ul>
                {groupe.items.map((c) => {
                  const etat = etatAdmin(c, aujourdhui, maintenant);
                  const clot = cloture(c, aujourdhui, maintenant);
                  const passee = fin(c) < aujourdhui;
                  const meta = [c.formule !== "À préciser" ? c.formule : null, c.depart !== "À préciser" ? c.depart : null, c.trous]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <li
                      key={c.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-neutral-200 px-4 py-3 last:border-b-0 md:grid-cols-[minmax(0,1fr)_200px_150px_92px]"
                    >
                      <button type="button" onClick={() => modifier(c)} className="flex min-w-0 items-center gap-3 text-left">
                        <Tuile jour={c.dateDebut} terminee={passee} />
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-neutral-900">
                            {c.nom}
                            {c.sponsor ? (
                              <span className="rounded border border-neutral-200 px-1.5 text-[11px] font-normal text-neutral-500">{c.sponsor}</span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 block truncate text-[13px] text-neutral-500">{meta}</span>
                        </span>
                      </button>
                      <span className="col-start-1 row-start-2 md:col-start-auto md:row-start-auto">
                        <Pastille {...etat} />
                      </span>
                      <span
                        className={cn(
                          "col-start-1 row-start-3 text-[13px] md:col-start-auto md:row-start-auto md:text-[14px]",
                          clot.urgent ? "font-medium text-or-600" : "text-neutral-600",
                        )}
                      >
                        <span className="md:hidden">Clôture : </span>
                        {clot.texte}
                      </span>
                      <span className="col-start-2 row-span-3 row-start-1 flex items-center justify-end gap-1 md:col-start-auto md:row-span-1 md:row-start-auto">
                        {passee && c.statut === "publie" && !c.resultatsPublies ? (
                          <button
                            type="button"
                            onClick={() => setResultatsPour(c)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-[14px] font-medium text-neutral-800 hover:bg-neutral-50"
                          >
                            <IconeAdmin nom="envoi" className="size-4" />
                            Publier
                          </button>
                        ) : (
                          <button
                            type="button"
                            aria-label={`Modifier ${c.nom}`}
                            onClick={() => modifier(c)}
                            className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                          >
                            <IconeAdmin nom="crayon" className="size-4" />
                          </button>
                        )}
                        <Menu actions={actionsDe(c)} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      {message ? (
        <p
          role="status"
          className={cn(
            "fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 rounded-lg px-4 py-2.5 text-[14px] text-white shadow-lg lg:left-[calc(50%+120px)]",
            message.ok ? "bg-club-800" : "bg-red-700",
          )}
        >
          {message.texte}
        </p>
      ) : null}

      {edition ? (
        <AssistantCompetition
          initial={edition.initial}
          statutInitial={edition.statut}
          titre={edition.titre}
          memoriser={edition.memoriser}
          onFermer={fermerEdition}
          onEnregistre={surEnregistre}
        />
      ) : null}

      {resultatsPour ? (
        <ModaleResultats competition={resultatsPour} onFermer={fermerResultats} onPublie={surResultats} />
      ) : null}
    </>
  );
}

const joursSemaine = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const pastilleCalendrier: Record<Ton, string> = {
  vert: "border-emerald-200 bg-emerald-50 text-emerald-800",
  bleu: "border-blue-200 bg-blue-50 text-blue-800",
  gris: "border-neutral-200 bg-neutral-50 text-neutral-700",
  ambre: "border-amber-200 bg-amber-50 text-amber-900",
};

/** Vue calendrier : un mois par bloc, compétitions posées sur leurs jours. */
function Calendrier({
  competitions,
  aujourdhui,
  maintenant,
  onOuvrir,
}: {
  competitions: CompetitionAvecEtat[];
  aujourdhui: string;
  maintenant: number;
  onOuvrir: (c: CompetitionAvecEtat) => void;
}) {
  const mois = [...new Set(competitions.map((c) => c.dateDebut.slice(0, 7)))].sort();
  if (mois.length === 0) {
    return <p className="mt-6 text-center text-[14px] text-neutral-500">Aucune compétition à afficher.</p>;
  }

  return (
    <div className="mt-5 space-y-8">
      {mois.map((cle) => {
        const [annee, numero] = cle.split("-").map(Number);
        const decalage = (new Date(Date.UTC(annee, numero - 1, 1)).getUTCDay() + 6) % 7;
        const nombreJours = new Date(Date.UTC(annee, numero, 0)).getUTCDate();
        const cases = [...Array.from({ length: decalage }, () => null), ...Array.from({ length: nombreJours }, (_, i) => i + 1)];
        return (
          <section key={cle}>
            <h2 className="mb-2 text-[14px] font-semibold text-neutral-900">{majuscule(moisAnnee.format(midi(`${cle}-15`)))}</h2>
            <div className="grid grid-cols-7 overflow-hidden rounded-xl border border-neutral-200 text-[12px]">
              {joursSemaine.map((j) => (
                <div key={j} className="border-b border-neutral-200 bg-neutral-50 px-2 py-1.5 text-neutral-500">
                  {j}
                </div>
              ))}
              {cases.map((jour, i) => {
                const date = jour ? `${cle}-${String(jour).padStart(2, "0")}` : null;
                const du = date ? competitions.filter((c) => c.dateDebut <= date && fin(c) >= date) : [];
                return (
                  <div key={i} className={cn("min-h-20 border-b border-r border-neutral-100 p-1.5", !jour && "bg-neutral-50/60")}>
                    {jour ? (
                      <span className={cn("text-[12px]", date === aujourdhui ? "rounded bg-neutral-900 px-1 font-semibold text-white" : "text-neutral-500")}>
                        {jour}
                      </span>
                    ) : null}
                    <div className="mt-1 space-y-1">
                      {du.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => onOuvrir(c)}
                          title={c.nom}
                          className={cn(
                            "block w-full truncate rounded border px-1.5 py-0.5 text-left text-[11px] font-medium",
                            pastilleCalendrier[etatAdmin(c, aujourdhui, maintenant).ton],
                          )}
                        >
                          {c.nom}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
