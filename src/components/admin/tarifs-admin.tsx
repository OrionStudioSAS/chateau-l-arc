"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

import { publierTarifs } from "@/app/(admin)/admin/(tableau-de-bord)/tarifs/actions";
import { IconeAdmin, type NomIconeAdmin } from "@/components/admin/icone-admin";
import { cn } from "@/lib/cn";
import { euros, saisonsDe, type GrilleTarifs, type LigneTarif } from "@/lib/tarifs";

type CleListe = "greenFees" | "carnets" | "locations" | "abonnements";
type Rubrique = { id: string; titre: string; sousTitre: string };

const RUBRIQUES: Rubrique[] = [
  { id: "green-fees", titre: "Green fees", sousTitre: "Tarifs visiteurs par parcours" },
  { id: "carnets", titre: "Carnets", sousTitre: "Valables 12 mois à partir de l'achat" },
  { id: "locations", titre: "Locations & practice", sousTitre: "Visiteurs · voiturettes, chariots et seaux de balles" },
  { id: "abonnements", titre: "Abonnements annuels", sousTitre: "Prix par an, remise en paiement comptant comprise" },
  { id: "membres", titre: "Tarifs membres", sousTitre: "Locations et practice, au prix membre" },
  { id: "saisons", titre: "Basse saison", sousTitre: "Dates des saisons : le tarif de saison s'applique automatiquement" },
];

const LISTE_DE: Record<string, CleListe> = {
  "green-fees": "greenFees",
  carnets: "carnets",
  locations: "locations",
  abonnements: "abonnements",
  membres: "locations",
};

const LIGNES_VISIBLES = 5;

/** Nouvelle ligne d'une liste, avec les champs propres à sa rubrique. */
function nouvelleLigne(liste: CleListe): LigneTarif & Record<string, unknown> {
  const base = { id: crypto.randomUUID(), libelle: "Nouveau tarif", detail: null, prix: 0 };
  if (liste === "greenFees") return { ...base, saison: null, miseEnAvant: false };
  if (liste === "carnets") return { ...base, parties: 6 };
  if (liste === "locations") return { ...base, membres: null, groupe: "location" };
  return { ...base, miseEnAvant: false };
}

/** Changements entre la grille publiée et le brouillon, en phrases. */
function changements(avant: GrilleTarifs, apres: GrilleTarifs): { rubrique: string; texte: string; prix?: boolean }[] {
  const liste: { rubrique: string; texte: string; prix?: boolean }[] = [];
  const noms: Record<CleListe, string> = {
    greenFees: "green-fees",
    carnets: "carnets",
    locations: "locations",
    abonnements: "abonnements",
  };

  for (const cle of Object.keys(noms) as CleListe[]) {
    const anciennes = new Map((avant[cle] as LigneTarif[]).map((l) => [l.id, l as LigneTarif & Record<string, unknown>]));
    const nouvelles = apres[cle] as (LigneTarif & Record<string, unknown>)[];
    for (const ligne of nouvelles) {
      const ancienne = anciennes.get(ligne.id);
      if (!ancienne) {
        liste.push({ rubrique: noms[cle], texte: `Ajout : ${ligne.libelle} (${euros(ligne.prix)})`, prix: true });
        continue;
      }
      if (ancienne.prix !== ligne.prix) {
        liste.push({ rubrique: noms[cle], texte: `${ligne.libelle} : ${ancienne.prix} → ${euros(ligne.prix)}`, prix: true });
      }
      if (cle === "locations" && ancienne.membres !== ligne.membres) {
        liste.push({
          rubrique: "membres",
          texte: `${ligne.libelle} (membres) : ${ancienne.membres ?? "—"} → ${ligne.membres === null ? "aucun" : euros(ligne.membres as number)}`,
          prix: true,
        });
      }
      if (ancienne.libelle !== ligne.libelle) liste.push({ rubrique: noms[cle], texte: `« ${ancienne.libelle} » renommé « ${ligne.libelle} »` });
      if ((ancienne.detail ?? "") !== (ligne.detail ?? "")) liste.push({ rubrique: noms[cle], texte: `${ligne.libelle} : précision modifiée` });
      if (ancienne.miseEnAvant !== ligne.miseEnAvant) {
        liste.push({ rubrique: noms[cle], texte: `${ligne.libelle} : ${ligne.miseEnAvant ? "mis en avant" : "n'est plus mis en avant"}` });
      }
      if (ancienne.parties !== ligne.parties) liste.push({ rubrique: noms[cle], texte: `${ligne.libelle} : ${ligne.parties} parties` });
    }
    const ids = new Set(nouvelles.map((l) => l.id));
    for (const ancienne of anciennes.values()) {
      if (!ids.has(ancienne.id)) liste.push({ rubrique: noms[cle], texte: `Suppression : ${ancienne.libelle}`, prix: true });
    }
    const ordre = (g: GrilleTarifs) => (g[cle] as LigneTarif[]).map((l) => l.id).filter((id) => anciennes.has(id) && ids.has(id)).join();
    if (ordre(avant) !== ordre(apres)) liste.push({ rubrique: noms[cle], texte: "Ordre des tarifs modifié" });
  }

  if (JSON.stringify(avant.saisons) !== JSON.stringify(apres.saisons)) {
    liste.push({ rubrique: "saisons", texte: `Haute saison : ${saisonsDe(apres).haute.periode}` });
  }
  if (JSON.stringify(avant.remiseComptant) !== JSON.stringify(apres.remiseComptant)) {
    liste.push({
      rubrique: "abonnements",
      texte: `Remise comptant : ${Math.round(apres.remiseComptant.taux * 100)} % jusqu'au ${apres.remiseComptant.jusquau}`,
    });
  }
  return liste;
}

function ChampPrix({
  valeur,
  avant,
  onChange,
  libelle,
}: {
  valeur: number;
  avant: number | null | undefined;
  onChange: (prix: number) => void;
  libelle: string;
}) {
  const [texte, setTexte] = useState(String(valeur));
  const [valeurPrecedente, setValeurPrecedente] = useState(valeur);
  if (valeur !== valeurPrecedente) {
    setValeurPrecedente(valeur);
    setTexte(String(valeur));
  }
  const modifie = avant !== undefined && avant !== valeur;

  return (
    <div className="flex items-center justify-end gap-3">
      {modifie && avant !== null ? (
        <span className="whitespace-nowrap text-[12px] text-neutral-400">
          avant <s>{avant}</s>
        </span>
      ) : null}
      <label
        className={cn(
          "flex w-[92px] items-center rounded-lg border bg-white px-2.5 py-1.5 transition-colors focus-within:ring-2 sm:w-[120px] sm:px-3",
          modifie ? "border-or-500 focus-within:ring-or-500/20" : "border-neutral-200 focus-within:border-club-600 focus-within:ring-club-600/15",
        )}
      >
        <span className="sr-only">Prix de {libelle}</span>
        <input
          inputMode="decimal"
          value={texte}
          onChange={(e) => {
            const brut = e.target.value.replace(",", ".").replace(/[^\d.]/g, "");
            setTexte(brut);
            const nombre = Number(brut);
            if (brut !== "" && Number.isFinite(nombre)) onChange(nombre);
          }}
          onBlur={() => setTexte(String(valeur))}
          className="w-full min-w-0 bg-transparent font-mono text-[14px] text-neutral-900 outline-none"
        />
        <span aria-hidden="true" className="text-[13px] text-neutral-400">€</span>
      </label>
    </div>
  );
}

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
      <button type="button" aria-label="Plus d'actions" aria-expanded={ouvert} onClick={() => setOuvert((v) => !v)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800">
        <IconeAdmin nom="points" className="size-5" />
      </button>
      {ouvert ? (
        <ul className="absolute right-0 top-full z-20 mt-1 w-60 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg">
          {actions.map((a) => (
            <li key={a.libelle}>
              <button
                type="button"
                onClick={() => {
                  setOuvert(false);
                  a.onClick();
                }}
                className={cn("flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[14px] hover:bg-neutral-100", a.danger ? "text-red-700" : "text-neutral-800")}
              >
                <IconeAdmin nom={a.icone} className="size-4 opacity-70" />
                {a.libelle}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

const versJJMM = (mmjj: string) => mmjj.split("-").reverse().join("/");
const depuisJJMM = (jjmm: string) => {
  const m = jjmm.match(/^(\d{1,2})\/(\d{1,2})$/);
  return m ? `${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : null;
};

/**
 * Écran « Tarifs » (maquette) : chaque prix se modifie sur place ; les
 * changements restent en brouillon jusqu'à « Publier » (⌘ + Entrée), puis
 * le site entier (accueil, page Tarifs, FAQ) affiche les nouveaux prix.
 */
export function TarifsAdmin({ grille }: { grille: GrilleTarifs }) {
  const [publiee, setPubliee] = useState(grille);
  const [b, setB] = useState(grille);
  const [active, setActive] = useState(RUBRIQUES[0].id);
  const [deplies, setDeplies] = useState<Record<string, boolean>>({});
  const [detail, setDetail] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null);
  const [enCours, demarrer] = useTransition();
  const [aFocaliser, setAFocaliser] = useState<string | null>(null);

  const liste = useMemo(() => changements(publiee, b), [publiee, b]);
  const nombre = liste.length;
  const rubriquesModifiees = new Set(liste.map((c) => c.rubrique));
  const anciennes = useMemo(
    () => new Map([...publiee.greenFees, ...publiee.carnets, ...publiee.locations, ...publiee.abonnements].map((l) => [l.id, l as LigneTarif & Record<string, unknown>])),
    [publiee],
  );

  const majLigne = (cle: CleListe, id: string, partiel: Record<string, unknown>) =>
    setB((g) => ({ ...g, [cle]: (g[cle] as LigneTarif[]).map((l) => (l.id === id ? { ...l, ...partiel } : l)) }));

  const deplacer = (cle: CleListe, id: string, sens: -1 | 1) =>
    setB((g) => {
      const lignes = [...(g[cle] as LigneTarif[])];
      const i = lignes.findIndex((l) => l.id === id);
      const j = i + sens;
      if (i < 0 || j < 0 || j >= lignes.length) return g;
      [lignes[i], lignes[j]] = [lignes[j], lignes[i]];
      return { ...g, [cle]: lignes };
    });

  const supprimer = (cle: CleListe, ligne: LigneTarif) => {
    if (!window.confirm(`Supprimer « ${ligne.libelle} » ? Il disparaîtra du site à la publication.`)) return;
    setB((g) => ({ ...g, [cle]: (g[cle] as LigneTarif[]).filter((l) => l.id !== ligne.id) }));
  };

  const ajouter = (cle: CleListe, rubrique: string) => {
    const ligne = nouvelleLigne(cle);
    setB((g) => ({ ...g, [cle]: [...(g[cle] as LigneTarif[]), ligne] }));
    setDeplies((d) => ({ ...d, [rubrique]: true }));
    setAFocaliser(ligne.id);
  };

  useEffect(() => {
    if (!aFocaliser) return;
    const champ = document.querySelector<HTMLInputElement>(`[data-libelle="${aFocaliser}"]`);
    champ?.focus();
    champ?.select();
    // Ciblage ponctuel après l'ajout d'une ligne.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAFocaliser(null);
  }, [aFocaliser]);

  const afficher = (ok: boolean, texte: string) => {
    setMessage({ ok, texte });
    window.setTimeout(() => setMessage(null), 4500);
  };

  const publier = useCallback(() => {
    if (nombre === 0 || enCours) return;
    demarrer(async () => {
      const resultat = await publierTarifs(b);
      if (resultat.ok) {
        setPubliee(b);
        setDetail(false);
      }
      afficher(resultat.ok, resultat.message);
    });
  }, [nombre, enCours, b]);

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

  // Rubrique active : la dernière dont le haut a passé le tiers de l'écran.
  useEffect(() => {
    let demande = 0;
    const suivre = () => {
      demande = 0;
      const passees = RUBRIQUES.map((r) => document.getElementById(`rubrique-${r.id}`)).filter(
        (el): el is HTMLElement => Boolean(el) && el!.getBoundingClientRect().top <= window.innerHeight / 3,
      );
      setActive(passees.at(-1)?.id.replace("rubrique-", "") ?? RUBRIQUES[0].id);
    };
    const surDefilement = () => {
      if (!demande) demande = window.requestAnimationFrame(suivre);
    };
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => {
      window.removeEventListener("scroll", surDefilement);
      if (demande) window.cancelAnimationFrame(demande);
    };
  }, []);

  const saisons = saisonsDe(b);
  const compte = (id: string) =>
    id === "membres"
      ? b.locations.filter((l) => l.membres !== null).length
      : id === "saisons"
        ? null
        : (b[LISTE_DE[id]] as LigneTarif[]).length;

  const ligneTarif = (cle: CleListe, rubrique: string, ligne: LigneTarif & Record<string, unknown>, index: number, total: number) => {
    const ancienne = anciennes.get(ligne.id);
    const membres = rubrique === "membres";
    const sousTitre =
      ligne.detail ?? (cle === "greenFees" && ligne.saison ? saisons[ligne.saison as "haute" | "basse"].detail.replace(/\.$/, "") : null);

    const actions = [
      ...(index > 0 ? [{ libelle: "Monter", icone: "chevronHaut" as const, onClick: () => deplacer(cle, ligne.id, -1) }] : []),
      ...(index < total - 1 ? [{ libelle: "Descendre", icone: "chevronHaut" as const, onClick: () => deplacer(cle, ligne.id, 1) }] : []),
      ...(cle === "greenFees" || cle === "abonnements"
        ? [{ libelle: ligne.miseEnAvant ? "Retirer la mise en avant" : "Mettre en avant", icone: "etoile" as const, onClick: () => majLigne(cle, ligne.id, { miseEnAvant: !ligne.miseEnAvant }) }]
        : []),
      ...(cle === "greenFees"
        ? [
            {
              libelle: ligne.saison === "basse" ? "Ne plus lier à la basse saison" : "Appliquer en basse saison",
              icone: "flocon" as const,
              onClick: () => majLigne(cle, ligne.id, { saison: ligne.saison === "basse" ? null : "basse" }),
            },
            {
              libelle: ligne.saison === "haute" ? "Ne plus lier à la haute saison" : "Appliquer en haute saison",
              icone: "horloge" as const,
              onClick: () => majLigne(cle, ligne.id, { saison: ligne.saison === "haute" ? null : "haute" }),
            },
          ]
        : []),
      ...(cle === "carnets"
        ? [
            {
              libelle: `Nombre de parties (${ligne.parties})…`,
              icone: "liste" as const,
              onClick: () => {
                const valeur = Number(window.prompt("Nombre de parties dans ce carnet", String(ligne.parties)));
                if (Number.isInteger(valeur) && valeur > 0) majLigne(cle, ligne.id, { parties: valeur });
              },
            },
          ]
        : []),
      ...(cle === "locations" && !membres
        ? [
            ligne.membres === null
              ? { libelle: "Ajouter un tarif membre", icone: "plus" as const, onClick: () => majLigne(cle, ligne.id, { membres: ligne.prix }) }
              : { libelle: "Retirer le tarif membre", icone: "fermer" as const, onClick: () => majLigne(cle, ligne.id, { membres: null }) },
            {
              libelle: ligne.groupe === "practice" ? "Classer en location" : "Classer en practice",
              icone: "etiquette" as const,
              onClick: () => majLigne(cle, ligne.id, { groupe: ligne.groupe === "practice" ? "location" : "practice" }),
            },
          ]
        : []),
      ...(membres
        ? [{ libelle: "Retirer le tarif membre", icone: "fermer" as const, onClick: () => majLigne(cle, ligne.id, { membres: null }) }]
        : [{ libelle: "Supprimer", icone: "corbeille" as const, danger: true, onClick: () => supprimer(cle, ligne) }]),
    ];

    return (
      <li key={ligne.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-neutral-200 px-4 py-2.5 last:border-b-0 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {membres ? (
              <p className="truncate text-[14px] font-medium text-neutral-900">{ligne.libelle}</p>
            ) : (
              <input
                data-libelle={ligne.id}
                aria-label="Intitulé"
                value={ligne.libelle}
                maxLength={80}
                onChange={(e) => majLigne(cle, ligne.id, { libelle: e.target.value })}
                className="-mx-1 w-full min-w-0 rounded px-1 text-[14px] font-medium text-neutral-900 outline-none hover:bg-neutral-100 focus:bg-neutral-100"
              />
            )}
            {!ancienne ? <span className="shrink-0 rounded bg-[#f6efe2] px-1.5 py-0.5 text-[11px] font-medium text-or-600">Nouveau</span> : null}
            {cle === "greenFees" && ligne.saison === "basse" ? (
              <span title={`Appliqué automatiquement ${saisons.basse.detail.charAt(0).toLowerCase()}${saisons.basse.detail.slice(1)}`} className="flex shrink-0 items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-600">
                <IconeAdmin nom="flocon" className="size-3" /> Auto
              </span>
            ) : null}
            {ligne.miseEnAvant ? <IconeAdmin nom="etoile" className="size-3.5 shrink-0 text-or-500" /> : null}
          </div>
          {membres ? (
            <p className="text-[12px] text-neutral-500">Visiteurs : {euros(ligne.prix)}</p>
          ) : (
            <input
              aria-label="Précision"
              value={ligne.detail ?? ""}
              placeholder={sousTitre ?? "Ajouter une précision"}
              maxLength={120}
              onChange={(e) => majLigne(cle, ligne.id, { detail: e.target.value || null })}
              className={cn(
                "-mx-1 w-full min-w-0 rounded px-1 text-[12px] text-neutral-500 outline-none hover:bg-neutral-100 focus:bg-neutral-100",
                // Sans précision ni texte de saison : l'invite n'apparaît qu'au survol.
                sousTitre ? "placeholder:text-neutral-500" : "placeholder:text-transparent hover:placeholder:text-neutral-400 focus:placeholder:text-neutral-400",
              )}
            />
          )}
        </div>
        <ChampPrix
          libelle={ligne.libelle}
          valeur={membres ? (ligne.membres as number) : ligne.prix}
          avant={ancienne ? (membres ? (ancienne.membres as number | null) : ancienne.prix) : undefined}
          onChange={(prix) => majLigne(cle, ligne.id, membres ? { membres: prix } : { prix })}
        />
        <Menu actions={actions} />
      </li>
    );
  };

  const resume = liste.filter((c) => c.prix).slice(0, 2).map((c) => c.texte).join(" · ") || liste[0]?.texte;

  return (
    <>
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">Tarifs</h1>
        <p className="mt-1 text-[14px] text-neutral-500">
          Un prix modifié ici est mis à jour partout sur le site : accueil, page Tarifs et réservations.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <nav aria-label="Catégories" className="lg:sticky lg:top-6">
          <p className="mb-2 hidden px-2.5 text-[12px] text-neutral-500 lg:block">Catégories</p>
          <ul className="flex gap-1 overflow-x-auto lg:block lg:space-y-0.5">
            {RUBRIQUES.map((r) => (
              <li key={r.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActive(r.id);
                    document.getElementById(`rubrique-${r.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[14px] transition-colors",
                    active === r.id ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-700 hover:bg-neutral-50",
                  )}
                >
                  {r.titre}
                  {rubriquesModifiees.has(r.id) ? <span aria-label="modifié" className="size-1.5 rounded-full bg-or-500" /> : null}
                  {compte(r.id) !== null ? <span className="ml-auto pl-3 text-[12px] text-neutral-400">{compte(r.id)}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          {RUBRIQUES.map((r) => {
            const cle = LISTE_DE[r.id];
            const lignes =
              r.id === "membres"
                ? b.locations.filter((l) => l.membres !== null)
                : cle
                  ? (b[cle] as (LigneTarif & Record<string, unknown>)[])
                  : [];
            const repliable = r.id === "locations" && lignes.length > LIGNES_VISIBLES + 1;
            const visibles = repliable && !deplies[r.id] ? lignes.slice(0, LIGNES_VISIBLES) : lignes;

            return (
              <section key={r.id} id={`rubrique-${r.id}`} className="scroll-mt-6 rounded-xl border border-neutral-200 bg-white">
                <header className="flex items-start justify-between gap-4 px-4 py-4 sm:px-5">
                  <div>
                    <h2 className="text-[15px] font-semibold text-neutral-900">{r.titre}</h2>
                    <p className="mt-0.5 text-[13px] text-neutral-500">{r.sousTitre}</p>
                  </div>
                  {cle && r.id !== "membres" ? (
                    <button type="button" onClick={() => ajouter(cle, r.id)} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[14px] text-neutral-700 hover:bg-neutral-100">
                      <IconeAdmin nom="plus" className="size-4" />
                      Ajouter
                    </button>
                  ) : null}
                </header>

                {r.id === "saisons" ? (
                  <div className="space-y-4 border-t border-neutral-200 px-4 py-4 sm:px-5">
                    <div className="flex flex-wrap items-center gap-3 text-[14px] text-neutral-700">
                      Haute saison du
                      {(["hauteDebut", "hauteFin"] as const).map((borne, i) => (
                        <span key={borne} className="flex items-center gap-3">
                          {i === 1 ? "au" : null}
                          <input
                            key={b.saisons[borne]}
                            aria-label={borne === "hauteDebut" ? "Début de la haute saison" : "Fin de la haute saison"}
                            defaultValue={versJJMM(b.saisons[borne])}
                            placeholder="JJ/MM"
                            onBlur={(e) => {
                              const valeur = depuisJJMM(e.target.value.trim());
                              if (valeur) setB((g) => ({ ...g, saisons: { ...g.saisons, [borne]: valeur } }));
                              else e.target.value = versJJMM(b.saisons[borne]);
                            }}
                            className="w-24 rounded-lg border border-neutral-200 px-3 py-1.5 font-mono text-[14px] outline-none focus:border-club-600"
                          />
                        </span>
                      ))}
                    </div>
                    <p className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2.5 text-[13px] text-neutral-600">
                      <IconeAdmin nom="flocon" className="size-4 text-neutral-400" />
                      Basse saison {saisons.basse.detail.charAt(0).toLowerCase() + saisons.basse.detail.slice(1, -1)} : les tarifs marqués « Auto » s&apos;appliquent automatiquement.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] border-y border-neutral-200 bg-neutral-50 px-4 py-2 text-[13px] text-neutral-500 sm:px-5">
                      <span>Intitulé</span>
                      <span className="mr-[46px] w-[92px] sm:w-[120px]">{r.id === "membres" ? "Prix membre" : "Prix TTC"}</span>
                    </div>
                    {lignes.length === 0 ? (
                      <p className="px-5 py-4 text-[14px] text-neutral-500">
                        {r.id === "membres" ? "Aucun tarif membre : ajoutez-en depuis « Locations & practice » (menu …)." : "Aucun tarif."}
                      </p>
                    ) : (
                      <ul>{visibles.map((l, i) => ligneTarif(cle!, r.id, l, i, visibles.length))}</ul>
                    )}
                    {repliable ? (
                      <button
                        type="button"
                        onClick={() => setDeplies((d) => ({ ...d, [r.id]: !d[r.id] }))}
                        className="flex w-full items-center gap-1.5 border-t border-neutral-200 px-5 py-3 text-left text-[14px] text-neutral-600 hover:bg-neutral-50"
                      >
                        {deplies[r.id] ? "Afficher moins" : `Afficher ${lignes.length - LIGNES_VISIBLES} tarifs de plus`}
                        <IconeAdmin nom="chevronHaut" className={cn("size-4", !deplies[r.id] && "rotate-180")} />
                      </button>
                    ) : null}
                    {r.id === "abonnements" ? (
                      <div className="flex flex-wrap items-center gap-2 border-t border-neutral-200 px-4 py-3 text-[14px] text-neutral-700 sm:px-5">
                        Remise en paiement comptant :
                        <input
                          key={`taux-${b.remiseComptant.taux}`}
                          aria-label="Remise en pourcentage"
                          inputMode="numeric"
                          defaultValue={Math.round(b.remiseComptant.taux * 100)}
                          onBlur={(e) => {
                            const taux = Number(e.target.value) / 100;
                            if (Number.isFinite(taux) && taux >= 0 && taux <= 0.5) setB((g) => ({ ...g, remiseComptant: { ...g.remiseComptant, taux } }));
                          }}
                          className="w-14 rounded-lg border border-neutral-200 px-2 py-1 text-center font-mono text-[14px] outline-none focus:border-club-600"
                        />
                        % jusqu&apos;au
                        <input
                          key={`limite-${b.remiseComptant.jusquau}`}
                          aria-label="Date limite de la remise"
                          defaultValue={b.remiseComptant.jusquau}
                          placeholder="JJ/MM"
                          onBlur={(e) => {
                            const valeur = e.target.value.trim();
                            if (/^\d{2}\/\d{2}$/.test(valeur)) setB((g) => ({ ...g, remiseComptant: { ...g.remiseComptant, jusquau: valeur } }));
                          }}
                          className="w-20 rounded-lg border border-neutral-200 px-2 py-1 text-center font-mono text-[14px] outline-none focus:border-club-600"
                        />
                      </div>
                    ) : null}
                  </>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <div aria-hidden="true" className="h-24" />

      {nombre > 0 ? (
        <div role="region" aria-label="Modifications non publiées" className="fixed inset-x-3 bottom-4 z-40 mx-auto flex max-w-2xl flex-wrap items-center gap-x-4 gap-y-3 rounded-xl bg-neutral-900 px-4 py-3 text-white shadow-2xl sm:inset-x-6 lg:left-[256px]">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-or-400" />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium">
              {nombre} {nombre > 1 ? "tarifs modifiés" : "tarif modifié"} — non publié{nombre > 1 ? "s" : ""}
            </p>
            <p className="truncate text-[12px] text-white/60">{resume}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setDetail(true)} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[14px] hover:bg-white/10">
              Voir les changements
            </button>
            <button type="button" onClick={publier} disabled={enCours} className="flex items-center gap-2 rounded-lg bg-or-500 px-3 py-1.5 text-[14px] font-medium hover:bg-or-600 disabled:opacity-60">
              {enCours ? "Publication…" : "Publier"}
              <span aria-hidden="true" className="hidden gap-0.5 sm:flex">
                <kbd className="rounded bg-white/20 px-1 font-sans text-[11px]">⌘</kbd>
                <kbd className="rounded bg-white/20 px-1 font-sans text-[11px]">↵</kbd>
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {detail ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-900/40 p-3 sm:p-10" onClick={() => setDetail(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="titre-changements" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <h2 id="titre-changements" className="text-[16px] font-semibold text-neutral-900">Changements non publiés</h2>
              <button type="button" aria-label="Fermer" onClick={() => setDetail(false)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
                <IconeAdmin nom="fermer" className="size-4" />
              </button>
            </header>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-4">
              {RUBRIQUES.filter((r) => rubriquesModifiees.has(r.id)).map((r) => (
                <section key={r.id}>
                  <h3 className="text-[12px] font-semibold uppercase tracking-wide text-neutral-500">{r.titre}</h3>
                  <ul className="mt-1.5 space-y-1">
                    {liste.filter((c) => c.rubrique === r.id).map((c, i) => (
                      <li key={i} className="text-[14px] text-neutral-800">{c.texte}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <footer className="flex justify-between gap-2 border-t border-neutral-200 px-5 py-3">
              <button
                type="button"
                onClick={() => {
                  setB(publiee);
                  setDetail(false);
                }}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Tout annuler
              </button>
              <button type="button" onClick={publier} disabled={enCours} className="rounded-lg bg-club-950 px-3.5 py-2 text-[14px] font-medium text-white hover:bg-club-800 disabled:opacity-60">
                {enCours ? "Publication…" : "Publier"}
              </button>
            </footer>
          </div>
        </div>
      ) : null}

      {message ? (
        <p role="status" className={cn("fixed left-1/2 z-[60] -translate-x-1/2 rounded-lg px-4 py-2.5 text-[14px] text-white shadow-lg lg:left-[calc(50%+120px)]", message.ok ? "bg-club-800" : "bg-red-700", nombre > 0 ? "bottom-24" : "bottom-4")}>
          {message.texte}
        </p>
      ) : null}
    </>
  );
}
