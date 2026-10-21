"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { enregistrerTraductions } from "@/app/(admin)/admin/(tableau-de-bord)/orion-translate/actions";
import { IconeAdmin } from "@/components/admin/icone-admin";
import { Avancement, StatutLangue } from "@/components/admin/traductions/orion-translate";
import { cn } from "@/lib/cn";
import type { Dictionnaire, InfoLangue } from "@/lib/i18n";
import { cheminLocal } from "@/lib/i18n/chemins";
import { avancement, type CategorieTextes, type GroupeTextes, type TexteATraduire } from "@/lib/traductions/textes";

type Filtre = "tous" | "non-traduits" | "a-revoir" | "modifies";

const filtres: { cle: Filtre; libelle: string }[] = [
  { cle: "tous", libelle: "Tous les textes" },
  { cle: "non-traduits", libelle: "Non traduits" },
  { cle: "a-revoir", libelle: "À revoir" },
  { cle: "modifies", libelle: "Modifiés, non publiés" },
];

const categories: CategorieTextes[] = ["Pages", "Interface du site", "Contenus du back-office"];

const MAX_RESULTATS = 150;

const cleDe = (t: TexteATraduire) => `${t.source}:${t.cle}`;

/** Sans accents ni casse, pour la recherche. */
const normaliser = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/**
 * « Gérer » une langue (Orion Translate) : le texte français à gauche, sa
 * traduction à droite, rubrique par rubrique. Les modifications s'accumulent
 * puis se publient en une fois (un commit, le site se reconstruit).
 */
export function EditeurTraductions({
  langue,
  groupes,
  dico: dicoPublie,
  origines: originesPubliees,
  groupeInitial,
  lienOrion,
}: {
  langue: InfoLangue;
  groupes: GroupeTextes[];
  dico: Dictionnaire;
  origines: Record<string, string>;
  groupeInitial: string | null;
  lienOrion: string;
}) {
  const [dico, setDico] = useState(dicoPublie);
  const [origines, setOrigines] = useState(originesPubliees);
  const [modifs, setModifs] = useState<Record<string, string>>({});
  const [groupeId, setGroupeId] = useState(
    () =>
      groupes.find((g) => g.id === groupeInitial)?.id ??
      groupes.find((g) => g.textes.some((t) => !dicoPublie[t.source][t.cle]))?.id ??
      groupes[0]?.id,
  );
  const [filtre, setFiltre] = useState<Filtre>("tous");
  const [recherche, setRecherche] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null);
  const [enCours, demarrer] = useTransition();
  const router = useRouter();
  const minuteur = useRef<number | undefined>(undefined);

  const afficher = (ok: boolean, texte: string) => {
    setMessage({ ok, texte });
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => setMessage(null), 4500);
  };

  const nombreModifs = Object.keys(modifs).length;

  // Modifications non publiées : on prévient avant de quitter la page.
  useEffect(() => {
    if (!nombreModifs) return;
    const avant = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avant);
    return () => window.removeEventListener("beforeunload", avant);
  }, [nombreModifs]);

  const publie = (t: TexteATraduire) => dico[t.source][t.cle] ?? "";
  const valeur = (t: TexteATraduire) => modifs[cleDe(t)] ?? publie(t);
  const aRevoir = (t: TexteATraduire) =>
    t.source === "constantes" && Boolean(publie(t)) && origines[t.cle] !== undefined && origines[t.cle] !== t.francais && !(cleDe(t) in modifs);

  const garde = (t: TexteATraduire) => {
    if (filtre === "non-traduits") return !valeur(t).trim();
    if (filtre === "a-revoir") return aRevoir(t);
    if (filtre === "modifies") return cleDe(t) in modifs;
    return true;
  };

  const modifier = (t: TexteATraduire, texte: string) => {
    setModifs((m) => {
      const suite = { ...m };
      // Retour au texte publié (et pas « à revoir ») : plus rien à publier.
      if (texte === publie(t) && !(t.source === "constantes" && origines[t.cle] !== undefined && origines[t.cle] !== t.francais)) {
        delete suite[cleDe(t)];
      } else {
        suite[cleDe(t)] = texte;
      }
      return suite;
    });
  };

  // Avancement en direct, modifications comprises.
  const dicoCourant = useMemo<Dictionnaire>(() => {
    const courant = { constantes: { ...dico.constantes }, interface: { ...dico.interface } };
    for (const [cle, texte] of Object.entries(modifs)) {
      const [source, ...reste] = cle.split(":");
      courant[source as keyof Dictionnaire][reste.join(":")] = texte;
    }
    return courant;
  }, [dico, modifs]);
  const global = avancement(groupes, dicoCourant);
  const parGroupe = (g: GroupeTextes) => g.textes.filter((t) => dicoCourant[t.source][t.cle]?.trim()).length;

  const groupe = groupes.find((g) => g.id === groupeId) ?? groupes[0];
  const terme = normaliser(recherche.trim());
  const resultats = useMemo(() => {
    if (!terme) return null;
    return groupes.flatMap((g) =>
      g.textes
        .filter((t) => normaliser(t.francais).includes(terme) || normaliser(dicoCourant[t.source][t.cle] ?? "").includes(terme))
        .map((t) => ({ groupe: g, texte: t })),
    );
  }, [terme, groupes, dicoCourant]);

  const lignes = (resultats ?? (groupe ? groupe.textes.map((t) => ({ groupe, texte: t })) : [])).filter((l) => garde(l.texte));

  const publier = () => {
    const envoi: Dictionnaire = { constantes: {}, interface: {} };
    for (const [cle, texte] of Object.entries(modifs)) {
      const [source, ...reste] = cle.split(":");
      envoi[source as keyof Dictionnaire][reste.join(":")] = texte;
    }
    demarrer(async () => {
      const resultat = await enregistrerTraductions(langue.code, envoi);
      afficher(resultat.ok, resultat.message);
      if (!resultat.ok) return;
      setDico(dicoCourant);
      setOrigines((o) => {
        const suite = { ...o };
        for (const g of groupes) {
          for (const t of g.textes) {
            if (t.source === "constantes" && `constantes:${t.cle}` in modifs) suite[t.cle] = t.francais;
          }
        }
        return suite;
      });
      setModifs({});
      router.refresh();
    });
  };

  return (
    <>
      <Link href="/admin/orion-translate" className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-900">
        <IconeAdmin nom="retour" className="size-3.5" />
        Orion Translate
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">
              {langue.nom} <span className="font-normal text-neutral-400">· {langue.natif}</span>
            </h1>
            <StatutLangue langue={langue} />
          </div>
          <p className="mt-1 text-[14px] text-neutral-500">
            Un texte laissé vide s&apos;affiche en français sur le site.
            {langue.publiee ? "" : " La langue est en brouillon : mettez-la en ligne depuis l'onglet Langues."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={cheminLocal("/", langue.code)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Aperçu du site
            <IconeAdmin nom="externe" className="size-3.5" />
          </a>
          {nombreModifs ? (
            <button
              type="button"
              disabled={enCours}
              onClick={() => window.confirm("Annuler les modifications non publiées ?") && setModifs({})}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
            >
              Annuler
            </button>
          ) : null}
          <button
            type="button"
            disabled={enCours || !nombreModifs}
            onClick={publier}
            className="inline-flex items-center gap-2 rounded-lg bg-club-950 px-3.5 py-2 text-[14px] font-medium text-white hover:bg-club-800 disabled:opacity-40"
          >
            <IconeAdmin nom="envoi" className="size-4" />
            {enCours ? "Publication…" : nombreModifs ? `Publier ${nombreModifs} modification${nombreModifs > 1 ? "s" : ""}` : "Publier"}
          </button>
        </div>
      </div>

      {langue.demandeOrion && !langue.publiee ? (
        <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-[14px] text-sky-900">
          Traduction confiée à Orion Studio : vous pourrez relire et corriger chaque texte ici.{" "}
          <a href={lienOrion} target="_blank" rel="noopener" className="font-medium underline underline-offset-2">
            Contacter l&apos;équipe
          </a>
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label className="relative flex h-9 w-full items-center rounded-lg border border-neutral-200 bg-white focus-within:border-club-600 sm:w-80">
          <IconeAdmin nom="recherche" className="pointer-events-none absolute left-2.5 size-4 text-neutral-400" />
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un texte, en français ou traduit"
            aria-label="Rechercher un texte"
            className="h-full w-full bg-transparent pl-8 pr-3 text-[14px] outline-none placeholder:text-neutral-400"
          />
        </label>
        <div role="radiogroup" aria-label="Filtre" className="flex flex-wrap rounded-lg border border-neutral-200 bg-white p-0.5">
          {filtres.map((f) => (
            <button
              key={f.cle}
              type="button"
              role="radio"
              aria-checked={filtre === f.cle}
              onClick={() => setFiltre(f.cle)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[13px] transition-colors",
                filtre === f.cle ? "bg-neutral-900 font-medium text-white" : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              {f.libelle}
            </button>
          ))}
        </div>
        <div className="ml-auto w-full sm:w-56">
          <Avancement pourcentage={global.pourcentage} />
          <p className="mt-0.5 text-right text-[12px] text-neutral-500">
            {global.traduits} / {global.total} textes traduits
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
        {/* Rubriques : liste à gauche sur grand écran, menu déroulant sinon. */}
        <label className="lg:hidden">
          <span className="sr-only">Rubrique</span>
          <select
            value={groupe?.id}
            onChange={(e) => {
              setGroupeId(e.target.value);
              setRecherche("");
            }}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[14px]"
          >
            {categories.map((c) => (
              <optgroup key={c} label={c}>
                {groupes
                  .filter((g) => g.categorie === c)
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.titre} ({parGroupe(g)}/{g.textes.length})
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        <nav aria-label="Rubriques" className="hidden max-h-[calc(100vh-12rem)] overflow-y-auto rounded-xl border border-neutral-200 bg-white py-2 lg:sticky lg:top-4 lg:block">
          {categories.map((c) => (
            <div key={c} className="py-1">
              <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">{c}</p>
              <ul>
                {groupes
                  .filter((g) => g.categorie === c)
                  .map((g) => {
                    const fait = parGroupe(g);
                    const actif = !resultats && g.id === groupe?.id;
                    return (
                      <li key={g.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setGroupeId(g.id);
                            setRecherche("");
                          }}
                          aria-current={actif ? "true" : undefined}
                          className={cn(
                            "flex w-full items-center gap-2 border-l-2 px-4 py-1.5 text-left text-[13px] transition-colors",
                            actif ? "border-or-500 bg-neutral-50 font-medium text-neutral-900" : "border-transparent text-neutral-600 hover:bg-neutral-50",
                          )}
                        >
                          <span className="min-w-0 flex-1 truncate">{g.titre}</span>
                          <span className={cn("shrink-0 text-[11px] tabular-nums", fait === g.textes.length ? "text-club-700" : "text-or-700")}>
                            {fait === g.textes.length ? <IconeAdmin nom="coche" className="size-3.5" /> : `${fait}/${g.textes.length}`}
                          </span>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>

        <section className="@container min-w-0 rounded-xl border border-neutral-200 bg-white">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4">
            <div className="min-w-0">
              <h2 className="truncate text-[16px] font-semibold text-neutral-900">
                {resultats ? `Recherche : « ${recherche.trim()} »` : groupe?.titre}
              </h2>
              <p className="text-[13px] text-neutral-500">
                {resultats
                  ? `${resultats.length} résultat${resultats.length > 1 ? "s" : ""}`
                  : groupe
                    ? `${groupe.categorie} · ${parGroupe(groupe)} / ${groupe.textes.length} traduits`
                    : null}
              </p>
            </div>
            {!resultats && groupe?.page ? (
              <Link
                href={`/admin/pages/${groupe.page}` as Route}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <IconeAdmin nom="crayon" className="size-3.5" />
                Modifier le français
              </Link>
            ) : null}
          </header>

          <div className="hidden grid-cols-2 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-2 text-[12px] font-medium text-neutral-500 @2xl:grid">
            <span>Français</span>
            <span>{langue.nom}</span>
          </div>

          {lignes.length === 0 ? (
            <p className="px-5 py-12 text-center text-[14px] text-neutral-500">
              {filtre === "non-traduits" ? "Tout est traduit ici." : filtre === "a-revoir" ? "Rien à revoir ici." : filtre === "modifies" ? "Aucune modification en attente ici." : "Aucun texte."}
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {lignes.slice(0, MAX_RESULTATS).map(({ groupe: g, texte: t }) => (
                <Ligne
                  key={`${g.id}|${cleDe(t)}`}
                  texte={t}
                  rubrique={resultats ? g.titre : null}
                  valeur={valeur(t)}
                  modifie={cleDe(t) in modifs}
                  aRevoir={aRevoir(t)}
                  ancien={aRevoir(t) ? origines[t.cle] : null}
                  langue={langue.nom}
                  onChange={(texte) => modifier(t, texte)}
                />
              ))}
            </ul>
          )}
          {lignes.length > MAX_RESULTATS ? (
            <p className="border-t border-neutral-100 px-5 py-3 text-center text-[13px] text-neutral-500">
              {lignes.length - MAX_RESULTATS} autres résultats : précisez la recherche.
            </p>
          ) : null}
        </section>
      </div>

      {message ? (
        <p
          role="status"
          className={cn(
            "fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-lg px-4 py-2.5 text-[14px] text-white shadow-lg lg:left-[calc(50%+120px)]",
            message.ok ? "bg-club-800" : "bg-red-700",
          )}
        >
          {message.texte}
        </p>
      ) : null}
    </>
  );
}

function Ligne({
  texte,
  rubrique,
  valeur,
  modifie,
  aRevoir,
  ancien,
  langue,
  onChange,
}: {
  texte: TexteATraduire;
  rubrique: string | null;
  valeur: string;
  modifie: boolean;
  aRevoir: boolean;
  ancien: string | null;
  langue: string;
  onChange: (texte: string) => void;
}) {
  const vide = !valeur.trim();
  const lignes = Math.min(10, Math.max(1, Math.ceil(Math.max(texte.francais.length, valeur.length) / 55), texte.francais.split("\n").length));
  return (
    <li className={cn("grid gap-2 px-5 py-4 @2xl:grid-cols-2 @2xl:gap-4", modifie && "bg-or-400/5")}>
      <div className="min-w-0">
        <p className="mb-1 flex flex-wrap items-center gap-1.5 text-[12px] text-neutral-500">
          {rubrique ? <span className="font-medium text-neutral-700">{rubrique}</span> : null}
          {rubrique && texte.libelle ? <span aria-hidden="true">·</span> : null}
          {texte.libelle ? <span>{texte.libelle}</span> : null}
          {vide ? <span className="rounded bg-or-400/20 px-1.5 text-[11px] font-medium text-or-700">Non traduit</span> : null}
          {aRevoir ? <span className="rounded bg-sky-500/12 px-1.5 text-[11px] font-medium text-sky-800">À revoir</span> : null}
          {modifie ? <span className="rounded bg-neutral-900 px-1.5 text-[11px] font-medium text-white">Modifié</span> : null}
        </p>
        <p className="whitespace-pre-line rounded-lg bg-neutral-50 px-3 py-2 text-[14px] leading-relaxed text-neutral-800">{texte.francais}</p>
        {ancien ? (
          <p className="mt-1.5 text-[12px] text-sky-900">
            Le français a changé. Traduit depuis : <span className="italic">« {ancien} »</span>
          </p>
        ) : null}
      </div>
      <div className="min-w-0">
        <textarea
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          rows={lignes}
          aria-label={`${texte.libelle || texte.francais.slice(0, 60)} en ${langue.toLowerCase()}`}
          placeholder={`Traduction (${langue.toLowerCase()})…`}
          className={cn(
            "block w-full resize-y rounded-lg border bg-white px-3 py-2 text-[14px] leading-relaxed text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-club-600 focus:ring-1 focus:ring-club-600",
            vide ? "border-or-400/60" : "border-neutral-200",
          )}
        />
        <div className="mt-1 flex gap-3 text-[12px]">
          {vide ? (
            <button type="button" onClick={() => onChange(texte.francais)} className="text-neutral-500 hover:text-neutral-900">
              Reprendre le français
            </button>
          ) : null}
          {aRevoir ? (
            <button type="button" onClick={() => onChange(valeur)} className="font-medium text-sky-800 hover:text-sky-950">
              Traduction toujours juste
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}
