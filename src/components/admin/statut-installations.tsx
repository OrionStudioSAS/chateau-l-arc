"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import {
  lireHistoriqueStatut,
  publierStatut,
  type ChangementStatut,
  type EntreeHistorique,
} from "@/app/(admin)/admin/(tableau-de-bord)/statut/actions";
import { Panneau } from "@/components/admin/accueil/blocs";
import { IconeAdmin, type NomIconeAdmin } from "@/components/admin/icone-admin";
import type { Installation } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import {
  LONGUEUR_MAX_PRECISION,
  optionsStatut,
  valeurStatut,
  type TonStatut,
} from "@/lib/statut";

const icones: Record<string, NomIconeAdmin> = {
  parcours: "drapeau",
  "greens-hiver": "flocon",
  voiturette: "voiturette",
  practice: "cible",
  restaurant: "couverts",
  tennis: "balle",
  "chariot-manuel": "chariot",
  "chariot-electrique": "chariot",
  "club-house": "batiment",
  proshop: "boutique",
  piscine: "piscine",
};

const pastilles: Record<TonStatut, string> = {
  vert: "bg-emerald-500",
  ambre: "bg-amber-500",
  rouge: "bg-red-500",
  gris: "bg-neutral-400",
};

type Etats = Record<string, ChangementStatut>;

const etatsDe = (installations: Installation[]): Etats =>
  Object.fromEntries(
    installations.map((i) => [i.cle, { etat: i.etat ?? "", precision: i.precision ?? null }]),
  );

const identiques = (a: ChangementStatut, b: ChangementStatut) =>
  a.etat === b.etat && (a.precision ?? "") === (b.precision ?? "");

/** Contrôle segmenté : un bouton par état, le courant en blanc avec sa pastille. */
function Segments({
  installation,
  valeur,
  onChange,
}: {
  installation: Installation;
  valeur: string;
  onChange: (etat: string) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={installation.libelle}
      className="flex w-full shrink-0 rounded-lg bg-neutral-100 p-0.5 sm:w-auto"
    >
      {optionsStatut(installation).map((option) => {
        const choisi = option.cle === valeur;
        return (
          <button
            key={option.cle}
            type="button"
            role="radio"
            aria-checked={choisi}
            onClick={() => onChange(option.cle)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-[13px] transition-colors sm:flex-none",
              choisi
                ? "bg-white font-medium text-neutral-900 shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                : "text-neutral-500 hover:text-neutral-800",
            )}
          >
            {choisi ? (
              <span aria-hidden="true" className={cn("size-1.5 rounded-full", pastilles[option.ton])} />
            ) : null}
            {option.libelle}
          </button>
        );
      })}
    </div>
  );
}

/** Sous-titre de la ligne ; la précision (« 8h – 19h ») s'y modifie au crayon. */
function SousTitre({
  installation,
  precision,
  repere,
  onChange,
}: {
  installation: Installation;
  precision: string | null;
  repere: string;
  onChange: (precision: string | null) => void;
}) {
  const [edition, setEdition] = useState(false);
  const modifiable = installation.type === "ouverture" && installation.cle !== "parcours";

  if (edition) {
    return (
      <input
        autoFocus
        defaultValue={precision ?? ""}
        maxLength={LONGUEUR_MAX_PRECISION}
        aria-label={`Précision pour ${installation.libelle}`}
        placeholder="Affiché à la place de « Ouvert » (ex. 8h – 19h)"
        onBlur={(e) => {
          onChange(e.currentTarget.value.trim() || null);
          setEdition(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") setEdition(false);
        }}
        className="mt-0.5 w-full max-w-xs rounded-md border border-neutral-300 px-2 py-0.5 text-[13px] text-neutral-800 outline-none focus:border-neutral-400"
      />
    );
  }

  return (
    <p className="group mt-0.5 flex items-center gap-1.5 text-[13px] text-neutral-500">
      <span className="truncate">{precision ? `Affiché : ${precision}` : repere}</span>
      {modifiable ? (
        <button
          type="button"
          onClick={() => setEdition(true)}
          aria-label={`Modifier la précision de ${installation.libelle}`}
          title="Précision affichée sur le site à la place de « Ouvert »"
          className="rounded p-0.5 text-neutral-400 opacity-0 transition-opacity hover:text-neutral-700 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <IconeAdmin nom="crayon" className="size-3.5" />
        </button>
      ) : null}
    </p>
  );
}

const quand = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

function Historique({ onFermer }: { onFermer: () => void }) {
  const [entrees, setEntrees] = useState<EntreeHistorique[] | null>(null);

  useEffect(() => {
    let actif = true;
    lireHistoriqueStatut().then((liste) => actif && setEntrees(liste));
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && onFermer();
    document.addEventListener("keydown", surTouche);
    return () => {
      actif = false;
      document.removeEventListener("keydown", surTouche);
    };
  }, [onFermer]);

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" className="absolute inset-0 bg-neutral-900/30" onClick={onFermer} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Historique des publications"
        className="absolute inset-y-0 right-0 flex w-[min(26rem,100vw)] flex-col bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-neutral-900">Historique des publications</h2>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer l'historique"
            className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100"
          >
            <IconeAdmin nom="fermer" className="size-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {entrees === null ? (
            <p className="text-[14px] text-neutral-500">Chargement…</p>
          ) : entrees.length === 0 ? (
            <p className="text-[14px] text-neutral-500">Aucune publication trouvée.</p>
          ) : (
            <ol className="space-y-5">
              {entrees.map((entree) => (
                <li key={entree.date} className="border-l-2 border-neutral-200 pl-4">
                  <p className="text-[12px] font-medium uppercase tracking-wide text-neutral-500">
                    {quand.format(new Date(entree.date))}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {entree.changements.map((ligne) => (
                      <li key={ligne} className="text-[14px] text-neutral-800">
                        {ligne}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </div>
      </aside>
    </div>
  );
}

/**
 * Statut des installations (maquette « Statut des installations ») : on règle
 * chaque installation, les changements restent en brouillon jusqu'à
 * « Publier » (⌘ + Entrée), puis partent en un seul commit.
 */
export function StatutInstallations({
  installations,
  reperes,
}: {
  installations: Installation[];
  /** Sous-titre par installation (description ou date de mise à jour). */
  reperes: Record<string, string>;
}) {
  const [publies, setPublies] = useState<Etats>(() => etatsDe(installations));
  const [brouillon, setBrouillon] = useState<Etats>(() => etatsDe(installations));
  const [maj, setMaj] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null);
  const [historique, setHistorique] = useState(false);
  const fermerHistorique = useCallback(() => setHistorique(false), []);
  const [enCours, demarrer] = useTransition();
  const minuteur = useRef<number | undefined>(undefined);

  const modifiees = installations.filter((i) => !identiques(brouillon[i.cle], publies[i.cle]));

  const changer = (cle: string, partiel: Partial<ChangementStatut>) =>
    setBrouillon((etats) => ({ ...etats, [cle]: { ...etats[cle], ...partiel } }));

  const toutOuvrir = () =>
    setBrouillon((etats) =>
      Object.fromEntries(
        installations.map((i) => [i.cle, { ...etats[i.cle], etat: optionsStatut(i)[0].cle }]),
      ),
    );

  const afficher = (ok: boolean, texte: string) => {
    setMessage({ ok, texte });
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => setMessage(null), 4000);
  };

  const publier = useCallback(() => {
    if (modifiees.length === 0 || enCours) return;
    const changements = Object.fromEntries(modifiees.map((i) => [i.cle, brouillon[i.cle]]));

    demarrer(async () => {
      const resultat = await publierStatut(changements);
      if (resultat.ok) {
        // L'état local fait foi : une relecture immédiate du dépôt pourrait
        // encore renvoyer l'ancienne version.
        setPublies((etats) => ({ ...etats, ...changements }));
        setMaj((dates) => ({
          ...dates,
          ...Object.fromEntries(modifiees.map((i) => [i.cle, "Mis à jour à l'instant"])),
        }));
      }
      afficher(resultat.ok, resultat.message);
    });
  }, [modifiees, brouillon, enCours]);

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        publier();
      }
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [publier]);

  const versValeur = (i: Installation, etat: ChangementStatut) =>
    valeurStatut({ ...i, etat: etat.etat, precision: etat.precision });

  const resume = modifiees
    .slice(0, 2)
    .map((i) => `${i.libelle} : ${versValeur(i, publies[i.cle])} → ${versValeur(i, brouillon[i.cle])}`)
    .join(" · ");

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">
            Statut des installations
          </h1>
          <p className="mt-1 text-[14px] text-neutral-500">
            Ce que vos visiteurs voient en haut du site. Les changements sont visibles dès la
            publication.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setHistorique(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[14px] font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
        >
          <IconeAdmin nom="historique" className="size-4 text-neutral-600" />
          Historique
        </button>
      </div>

      <Panneau
        className="mt-6"
        titre="Installations"
        sousTitre="Statut affiché dans la barre d'info du site"
        action={
          <button
            type="button"
            onClick={toutOuvrir}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-[14px] text-neutral-700 hover:bg-neutral-100"
          >
            <IconeAdmin nom="coche" className="size-4" />
            Tout ouvrir
          </button>
        }
      >
        <ul className="divide-y divide-neutral-200">
          {installations.map((installation) => {
            const etat = brouillon[installation.cle];
            const modifie = !identiques(etat, publies[installation.cle]);
            return (
              <li
                key={installation.cle}
                className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-3.5 sm:px-6"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600"
                >
                  <IconeAdmin nom={icones[installation.cle] ?? "drapeau"} className="size-[17px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[14px] font-medium text-neutral-900">
                    {installation.libelle}
                    {modifie ? (
                      <span className="rounded bg-[#f6efe2] px-1.5 py-0.5 text-[11px] font-medium text-or-600">
                        Modifié
                      </span>
                    ) : null}
                  </p>
                  <SousTitre
                    installation={installation}
                    precision={etat.precision}
                    repere={maj[installation.cle] ?? reperes[installation.cle]}
                    onChange={(precision) => changer(installation.cle, { precision })}
                  />
                </div>
                <Segments
                  installation={installation}
                  valeur={etat.etat}
                  onChange={(valeur) => changer(installation.cle, { etat: valeur })}
                />
              </li>
            );
          })}
        </ul>
      </Panneau>

      {/* Réserve la place de la barre de publication en bas de page. */}
      <div aria-hidden="true" className="h-24" />

      {modifiees.length > 0 ? (
        <div
          role="region"
          aria-label="Modifications non publiées"
          className="fixed inset-x-3 bottom-4 z-40 mx-auto flex max-w-xl flex-wrap items-center gap-x-4 gap-y-3 rounded-xl bg-neutral-900 px-4 py-3 text-white shadow-2xl sm:inset-x-6 lg:left-[256px]"
        >
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-or-400" />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium">
              {modifiees.length} modification{modifiees.length > 1 ? "s" : ""} non publiée
              {modifiees.length > 1 ? "s" : ""}
            </p>
            <p className="truncate text-[12px] text-white/60">
              {resume}
              {modifiees.length > 2 ? ` · +${modifiees.length - 2}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setBrouillon(publies)}
              disabled={enCours}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[14px] hover:bg-white/10 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={publier}
              disabled={enCours}
              className="flex items-center gap-2 rounded-lg bg-or-500 px-3 py-1.5 text-[14px] font-medium hover:bg-or-600 disabled:opacity-60"
            >
              {enCours ? "Publication…" : "Publier"}
              <span aria-hidden="true" className="hidden gap-0.5 sm:flex">
                <kbd className="rounded bg-white/20 px-1 font-sans text-[11px]">⌘</kbd>
                <kbd className="rounded bg-white/20 px-1 font-sans text-[11px]">↵</kbd>
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {message ? (
        <p
          role="status"
          className={cn(
            "fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-lg px-4 py-2.5 text-[14px] text-white shadow-lg lg:left-[calc(50%+120px)]",
            message.ok ? "bg-club-800" : "bg-red-700",
            modifiees.length > 0 && "bottom-24",
          )}
        >
          {message.texte}
        </p>
      ) : null}

      {historique ? <Historique onFermer={fermerHistorique} /> : null}
    </>
  );
}
