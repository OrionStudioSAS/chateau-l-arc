"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import {
  ajouterLangue,
  changerPublication,
  supprimerLangue,
  type ResultatTraduction,
} from "@/app/(admin)/admin/(tableau-de-bord)/orion-translate/actions";
import { IconeAdmin } from "@/components/admin/icone-admin";
import { cn } from "@/lib/cn";
import type { InfoLangue } from "@/lib/i18n";
import { cheminLocal } from "@/lib/i18n/chemins";
import { catalogueLangues, LANGUES_INCLUSES, PRIX_LANGUE_SUPPLEMENTAIRE } from "@/lib/traductions/catalogue";
import type { CategorieTextes } from "@/lib/traductions/textes";

export type LangueResume = InfoLangue & { total: number; traduits: number; pourcentage: number; aRevoir: number };
export type GroupeResume = {
  id: string;
  titre: string;
  categorie: CategorieTextes;
  total: number;
  /** Code de langue → textes traduits du groupe. */
  traduits: Record<string, number>;
};

type Onglet = "ensemble" | "langues" | "traductions";

const nombre = new Intl.NumberFormat("fr-FR");

export const lienGerer = (code: string, groupe?: string) =>
  `/admin/orion-translate/${code}${groupe ? `?groupe=${encodeURIComponent(groupe)}` : ""}` as Route;

/** Barre d'avancement (maquette : fine, verte, pourcentage à droite). */
export function Avancement({ pourcentage, className }: { pourcentage: number; className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
        <span
          className={cn("block h-full rounded-full", pourcentage === 100 ? "bg-club-600" : "bg-or-500")}
          style={{ width: `${pourcentage}%` }}
        />
      </span>
      <span className="w-10 text-right text-[13px] tabular-nums text-neutral-600">{pourcentage} %</span>
    </span>
  );
}

/** Pastille d'état d'une langue. */
export function StatutLangue({ langue }: { langue: InfoLangue }) {
  const [texte, ton] = langue.principale
    ? ["Langue source", "bg-neutral-100 text-neutral-700"]
    : langue.publiee
      ? ["En ligne", "bg-club-600/12 text-club-800"]
      : langue.demandeOrion
        ? ["Traduction Orion en cours", "bg-sky-500/12 text-sky-800"]
        : ["Brouillon", "bg-or-400/20 text-or-700"];
  return <span className={cn("inline-flex whitespace-nowrap rounded px-1.5 py-0.5 text-[12px] font-medium", ton)}>{texte}</span>;
}

function CodeLangue({ code }: { code: string }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-[12px] font-semibold uppercase text-neutral-700">
      {code}
    </span>
  );
}

/**
 * Écran Orion Translate (maquette) : vue d'ensemble, langues du site et
 * avancement des traductions par rubrique. « Gérer » ouvre la traduction
 * champ par champ ; « Ajouter une langue » propose de traduire soi-même ou de
 * confier la traduction à l'équipe Orion.
 */
export function OrionTranslate({
  langues,
  groupes,
  lienOrion,
}: {
  langues: LangueResume[];
  groupes: GroupeResume[];
  lienOrion: string;
}) {
  const [onglet, setOnglet] = useState<Onglet>("ensemble");
  const [ajout, setAjout] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null);
  const [enCours, demarrer] = useTransition();
  const router = useRouter();
  const minuteur = useRef<number | undefined>(undefined);

  const afficher = (ok: boolean, texte: string) => {
    setMessage({ ok, texte });
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => setMessage(null), 4500);
  };

  const executer = (action: () => Promise<ResultatTraduction>, apres?: () => void) => {
    demarrer(async () => {
      const resultat = await action();
      afficher(resultat.ok, resultat.message);
      if (resultat.ok) {
        apres?.();
        router.refresh();
      }
    });
  };

  const traduites = langues.filter((l) => !l.principale);
  const totalTextes = langues[0]?.total ?? 0;
  const global = traduites.length
    ? Math.floor(traduites.reduce((s, l) => s + l.traduits, 0) / traduites.reduce((s, l) => s + l.total, 0) * 100)
    : 100;
  const enLigne = langues.filter((l) => l.principale || l.publiee);
  const supplementaires = langues.filter((l) => !l.incluse).length;

  const onglets: { cle: Onglet; libelle: string; compte?: number }[] = [
    { cle: "ensemble", libelle: "Vue d'ensemble" },
    { cle: "langues", libelle: "Langues", compte: langues.length },
    { cle: "traductions", libelle: "Traductions", compte: totalTextes },
  ];

  const publier = (langue: LangueResume, publiee: boolean) => {
    const question = publiee
      ? `Mettre en ligne la version ${langue.nom.toLowerCase()} ? Elle apparaîtra dans le sélecteur de langue et sur Google.${langue.pourcentage < 100 ? ` Les textes non traduits (${100 - langue.pourcentage} %) s'afficheront en français.` : ""}`
      : `Retirer la version ${langue.nom.toLowerCase()} du site ? Les traductions sont conservées.`;
    if (window.confirm(question)) executer(() => changerPublication(langue.code, publiee));
  };

  const supprimer = (langue: LangueResume) => {
    if (window.confirm(`Supprimer la langue ${langue.nom.toLowerCase()} et ses ${nombre.format(langue.traduits)} traductions ? C'est définitif.`)) {
      executer(() => supprimerLangue(langue.code));
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-club-950 text-white">
            <IconeAdmin nom="traduction" className="size-5" />
          </span>
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">Orion Translate</h1>
            <p className="text-[14px] text-neutral-500">Application native · Traduction du site, page par page et champ par champ</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAjout(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-club-950 px-3 py-2 text-[14px] font-medium text-white hover:bg-club-800"
        >
          <IconeAdmin nom="plus" className="size-4" />
          Ajouter une langue
        </button>
      </div>

      <div role="tablist" aria-label="Rubriques" className="mt-6 flex w-fit rounded-lg border border-neutral-200 bg-white p-0.5">
        {onglets.map((o) => (
          <button
            key={o.cle}
            type="button"
            role="tab"
            aria-selected={onglet === o.cle}
            onClick={() => setOnglet(o.cle)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[14px] transition-colors",
              onglet === o.cle ? "border border-neutral-200 bg-white font-medium text-neutral-900 shadow-sm" : "text-neutral-600 hover:text-neutral-900",
            )}
          >
            {o.libelle}
            {o.compte !== undefined ? <span className="text-[12px] text-neutral-400">{nombre.format(o.compte)}</span> : null}
          </button>
        ))}
      </div>

      {onglet === "ensemble" ? (
        <>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <section className="rounded-xl border border-neutral-200 bg-white p-5">
              <h2 className="text-[13px] font-medium text-neutral-500">Langues actives</h2>
              <p className="mt-2 text-[30px] font-semibold tracking-tight text-neutral-900">{langues.length}</p>
              <p className="mt-1 text-[13px] text-neutral-500">
                {LANGUES_INCLUSES} incluses dans votre abonnement
                {supplementaires ? ` · ${supplementaires} supplémentaire${supplementaires > 1 ? "s" : ""}` : ""}
              </p>
              <p className="mt-3 border-t border-neutral-100 pt-3 text-[12px] text-neutral-500">
                Langue supplémentaire : +{PRIX_LANGUE_SUPPLEMENTAIRE} € HT/mois
              </p>
            </section>
            <section className="rounded-xl border border-neutral-200 bg-white p-5">
              <h2 className="text-[13px] font-medium text-neutral-500">Contenus traduits</h2>
              <p className="mt-2 text-[30px] font-semibold tracking-tight text-neutral-900">{global} %</p>
              <Avancement pourcentage={global} className="mt-2 [&>span:last-child]:hidden" />
              <p className="mt-3 border-t border-neutral-100 pt-3 text-[12px] text-neutral-500">
                {nombre.format(totalTextes)} textes sur le site : pages, menus, formulaires, tarifs et compétitions
              </p>
            </section>
            <section className="rounded-xl border border-neutral-200 bg-white p-5">
              <h2 className="text-[13px] font-medium text-neutral-500">En ligne</h2>
              <p className="mt-2 text-[30px] font-semibold tracking-tight text-neutral-900">{enLigne.length}</p>
              <p className="mt-1 truncate text-[13px] text-neutral-500">{enLigne.map((l) => l.nom).join(", ")}</p>
              <p className="mt-3 border-t border-neutral-100 pt-3 text-[12px] text-neutral-500">
                Une langue en brouillon reste invisible pour les visiteurs et Google.
              </p>
            </section>
          </div>

          <section className="mt-5 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <header className="border-b border-neutral-200 px-5 py-4">
              <h2 className="text-[15px] font-semibold text-neutral-900">Langues du site</h2>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[14px]">
                <thead className="bg-neutral-50 text-[12px] text-neutral-500">
                  <tr>
                    <th scope="col" className="px-5 py-2.5 font-medium">Langue</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Statut</th>
                    <th scope="col" className="w-[32%] px-3 py-2.5 font-medium">Traduction</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Abonnement</th>
                    <th scope="col" className="px-5 py-2.5"><span className="sr-only">Action</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {langues.map((langue) => (
                    <tr key={langue.code}>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-3">
                          <CodeLangue code={langue.code} />
                          <span>
                            <span className="block font-medium text-neutral-900">{langue.nom}</span>
                            <span className="block text-[12px] text-neutral-500">{langue.natif}</span>
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-3"><StatutLangue langue={langue} /></td>
                      <td className="px-3 py-3">
                        <Avancement pourcentage={langue.pourcentage} />
                        {langue.aRevoir ? (
                          <span className="mt-1 block text-[12px] text-or-700">{langue.aRevoir} à revoir (français modifié)</span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-[13px] text-neutral-600">
                        {langue.incluse ? "Incluse" : `+${PRIX_LANGUE_SUPPLEMENTAIRE} € HT/mois`}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={langue.principale ? "/admin/pages" : lienGerer(langue.code)}
                          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[14px] font-medium text-neutral-800 hover:bg-neutral-50"
                        >
                          {langue.principale ? "Modifier" : "Gérer"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {onglet === "langues" ? (
        <ul className="mt-5 grid gap-4 lg:grid-cols-2">
          {langues.map((langue) => (
            <li key={langue.code} className="flex flex-col rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex items-center gap-3">
                  <CodeLangue code={langue.code} />
                  <span>
                    <span className="block text-[15px] font-semibold text-neutral-900">{langue.nom}</span>
                    <span className="block text-[13px] text-neutral-500">
                      {langue.natif} · {langue.incluse ? "incluse" : `+${PRIX_LANGUE_SUPPLEMENTAIRE} € HT/mois`}
                    </span>
                  </span>
                </span>
                <StatutLangue langue={langue} />
              </div>
              <Avancement pourcentage={langue.pourcentage} className="mt-4" />
              <p className="mt-1.5 text-[13px] text-neutral-500">
                {langue.principale
                  ? "Langue d'origine du site : ses textes se modifient dans Pages et dans chaque rubrique."
                  : `${nombre.format(langue.traduits)} textes traduits sur ${nombre.format(langue.total)}${langue.aRevoir ? ` · ${langue.aRevoir} à revoir` : ""}`}
              </p>
              {langue.demandeOrion && !langue.publiee ? (
                <p className="mt-3 rounded-lg bg-sky-50 px-3 py-2 text-[13px] text-sky-900">
                  Traduction confiée à Orion Studio.{" "}
                  <a href={lienOrion} target="_blank" rel="noopener" className="font-medium underline underline-offset-2">
                    Contacter l&apos;équipe
                  </a>
                </p>
              ) : null}
              {langue.principale ? null : (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
                  <Link
                    href={lienGerer(langue.code)}
                    className="inline-flex items-center gap-2 rounded-lg bg-club-950 px-3 py-1.5 text-[14px] font-medium text-white hover:bg-club-800"
                  >
                    <IconeAdmin nom="crayon" className="size-4" />
                    Traduire
                  </Link>
                  <button
                    type="button"
                    disabled={enCours}
                    onClick={() => publier(langue, !langue.publiee)}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[14px] font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
                  >
                    {langue.publiee ? "Retirer du site" : "Mettre en ligne"}
                  </button>
                  <a
                    href={cheminLocal("/", langue.code)}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    Aperçu
                    <IconeAdmin nom="externe" className="size-3.5" />
                  </a>
                  {langue.publiee ? null : (
                    <button
                      type="button"
                      disabled={enCours}
                      onClick={() => supprimer(langue)}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      <IconeAdmin nom="corbeille" className="size-4" />
                      Supprimer
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {onglet === "traductions" ? (
        <div className="mt-5 space-y-5">
          {(["Pages", "Interface du site", "Contenus du back-office"] as const).map((categorie) => {
            const liste = groupes.filter((g) => g.categorie === categorie);
            if (!liste.length) return null;
            return (
              <section key={categorie} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <header className="flex items-baseline justify-between gap-3 border-b border-neutral-200 px-5 py-3.5">
                  <h2 className="text-[15px] font-semibold text-neutral-900">{categorie}</h2>
                  <p className="text-[12px] text-neutral-500">{nombre.format(liste.reduce((s, g) => s + g.total, 0))} textes</p>
                </header>
                <ul className="divide-y divide-neutral-100">
                  {liste.map((g) => (
                    <li key={g.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium text-neutral-900">{g.titre}</span>
                        <span className="text-[12px] text-neutral-500">{g.total} texte{g.total > 1 ? "s" : ""}</span>
                      </span>
                      <span className="flex flex-wrap gap-1.5">
                        {traduites.map((l) => {
                          const fait = g.traduits[l.code] ?? 0;
                          return (
                            <Link
                              key={l.code}
                              href={lienGerer(l.code, g.id)}
                              title={`Traduire en ${l.nom.toLowerCase()}`}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[12px] font-medium transition-colors",
                                fait === g.total
                                  ? "border-club-600/20 bg-club-600/8 text-club-800 hover:bg-club-600/15"
                                  : "border-or-400/40 bg-or-400/10 text-or-700 hover:bg-or-400/20",
                              )}
                            >
                              <span className="uppercase">{l.code}</span>
                              <span className="tabular-nums">{fait}/{g.total}</span>
                            </Link>
                          );
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : null}

      {ajout ? (
        <AjoutLangue
          existantes={langues.map((l) => l.code)}
          supplementaire={langues.filter((l) => l.incluse).length >= LANGUES_INCLUSES}
          enCours={enCours}
          lienOrion={lienOrion}
          onFermer={() => setAjout(false)}
          onAjouter={(code, parOrion) => executer(() => ajouterLangue(code, parOrion), () => setAjout(false))}
        />
      ) : null}

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

/** Fenêtre « Ajouter une langue » : choix de la langue, puis de qui traduit. */
function AjoutLangue({
  existantes,
  supplementaire,
  enCours,
  lienOrion,
  onFermer,
  onAjouter,
}: {
  existantes: string[];
  supplementaire: boolean;
  enCours: boolean;
  lienOrion: string;
  onFermer: () => void;
  onAjouter: (code: string, parOrion: boolean) => void;
}) {
  const proposees = catalogueLangues.filter((l) => !existantes.includes(l.code));
  const [code, setCode] = useState(proposees[0]?.code ?? "");
  const [parOrion, setParOrion] = useState(false);

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && onFermer();
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [onFermer]);

  const choix = [
    {
      orion: false,
      titre: "Je traduis moi-même",
      texte: "Traduisez chaque texte depuis le back-office. Tant qu'un texte n'est pas traduit, le site l'affiche en français.",
    },
    {
      orion: true,
      titre: "Orion traduit pour moi",
      texte: "Notre équipe traduit tout le site, référencement compris, puis vous la soumet pour relecture avant la mise en ligne.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-900/40 p-3 sm:p-10" onClick={onFermer}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-ajout-langue"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 id="titre-ajout-langue" className="text-[16px] font-semibold text-neutral-900">Ajouter une langue</h2>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              La langue est ajoutée en brouillon : rien ne change sur le site avant sa mise en ligne.
            </p>
          </div>
          <button type="button" aria-label="Fermer" onClick={onFermer} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
            <IconeAdmin nom="fermer" className="size-4" />
          </button>
        </header>

        {proposees.length === 0 ? (
          <p className="px-5 py-8 text-center text-[14px] text-neutral-500">
            Toutes les langues proposées sont déjà sur le site.{" "}
            <a href={lienOrion} target="_blank" rel="noopener" className="font-medium text-neutral-800 underline underline-offset-2">
              Demander une autre langue
            </a>
          </p>
        ) : (
          <form
            className="space-y-5 px-5 py-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (code) onAjouter(code, parOrion);
            }}
          >
            <fieldset>
              <legend className="mb-2 text-[13px] font-medium text-neutral-700">Langue</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {proposees.map((l) => (
                  <label
                    key={l.code}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[14px] transition-colors",
                      code === l.code ? "border-club-600 bg-club-600/5 ring-1 ring-club-600" : "border-neutral-200 hover:border-neutral-300",
                    )}
                  >
                    <input type="radio" name="langue" value={l.code} checked={code === l.code} onChange={() => setCode(l.code)} className="sr-only" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-neutral-900">{l.nom}</span>
                      <span className="block truncate text-[12px] text-neutral-500">{l.natif}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-[13px] font-medium text-neutral-700">Traduction</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {choix.map((c) => (
                  <label
                    key={String(c.orion)}
                    className={cn(
                      "flex cursor-pointer flex-col rounded-lg border p-3.5 transition-colors",
                      parOrion === c.orion ? "border-club-600 bg-club-600/5 ring-1 ring-club-600" : "border-neutral-200 hover:border-neutral-300",
                    )}
                  >
                    <input type="radio" name="traduction" checked={parOrion === c.orion} onChange={() => setParOrion(c.orion)} className="sr-only" />
                    <span className="text-[14px] font-semibold text-neutral-900">{c.titre}</span>
                    <span className="mt-1 text-[13px] leading-snug text-neutral-500">{c.texte}</span>
                  </label>
                ))}
              </div>
              {parOrion ? (
                <p className="mt-2 text-[12px] text-neutral-500">
                  Après l&apos;ajout, prévenez-nous depuis l&apos;onglet Langues (« Contacter l&apos;équipe ») pour convenir du délai et du devis.
                </p>
              ) : null}
            </fieldset>

            {supplementaire ? (
              <p className="rounded-lg bg-neutral-50 px-3 py-2.5 text-[13px] text-neutral-600">
                Vos {LANGUES_INCLUSES} langues incluses sont utilisées : cette langue est en supplément, +{PRIX_LANGUE_SUPPLEMENTAIRE} € HT/mois.
              </p>
            ) : null}

            <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
              <button type="button" onClick={onFermer} className="rounded-lg px-3 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100">
                Annuler
              </button>
              <button
                type="submit"
                disabled={enCours || !code}
                className="rounded-lg bg-club-950 px-4 py-2 text-[14px] font-medium text-white hover:bg-club-800 disabled:opacity-50"
              >
                {enCours ? "Ajout…" : "Ajouter la langue"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
