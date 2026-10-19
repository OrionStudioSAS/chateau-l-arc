"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { publierBandeau, type BrouillonBandeau } from "@/app/(admin)/admin/(tableau-de-bord)/bandeau/actions";
import { ChampLien, type PropositionLien } from "@/components/admin/champ-lien";
import { classeChamp } from "@/components/admin/competitions/champs";
import { IconeAdmin } from "@/components/admin/icone-admin";
import { LONGUEUR_MAX_BANDEAU, LONGUEUR_MAX_BOUTON_BANDEAU, slugCompetitionLiee } from "@/lib/bandeau";
import { cn } from "@/lib/cn";
import type { TonStatut } from "@/lib/statut";

export type PastilleApercu = { texte: string; ton: TonStatut };

const couleurs: Record<TonStatut, string> = {
  vert: "bg-emerald-500",
  ambre: "bg-amber-500",
  rouge: "bg-red-500",
  gris: "bg-neutral-400",
};

const champs: { cle: keyof BrouillonBandeau; libelle: (b: BrouillonBandeau, avant: BrouillonBandeau) => string }[] = [
  { cle: "actif", libelle: (b) => `Bandeau : ${b.actif ? "Masqué → Affiché" : "Affiché → Masqué"}` },
  { cle: "message", libelle: (b) => (b.message ? `Message : « ${b.message} »` : "Message effacé") },
  { cle: "lienHref", libelle: (b) => (b.lienHref ? `Lien : ${b.lienHref}` : "Lien retiré") },
  { cle: "lienLabel", libelle: (b) => (b.lienLabel ? `Bouton : « ${b.lienLabel} »` : "Texte du bouton effacé") },
];

const formatJour = (iso: string) => iso.split("-").reverse().join("/");

/**
 * Écran « Bandeau d'information » (maquette) : message et bouton à gauche,
 * aperçu en direct à droite. Les changements restent en brouillon jusqu'à
 * « Publier » (⌘ + Entrée).
 */
export function BandeauAdmin({
  bandeau,
  propositions,
  finCompetitions,
  annonceEnCours,
  pastilles,
  image,
  aujourdhui,
}: {
  bandeau: BrouillonBandeau;
  /** Compétitions à venir, proposées comme lien du bouton. */
  propositions: PropositionLien[];
  /** Dernier jour de chaque compétition (AAAA-MM-JJ), par slug. */
  finCompetitions: Record<string, string>;
  /** Compétition qui prend le bandeau en ce moment (option « annoncée dans le bandeau »). */
  annonceEnCours: { nom: string; jusquau: string } | null;
  /** État des installations, comme sous le bandeau du site. */
  pastilles: PastilleApercu[];
  image: string;
  aujourdhui: string;
}) {
  const [publie, setPublie] = useState(bandeau);
  const [b, setB] = useState(bandeau);
  const [appareil, setAppareil] = useState<"ordinateur" | "mobile">("ordinateur");
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null);
  const [enCours, demarrer] = useTransition();
  const minuteur = useRef<number | undefined>(undefined);

  const maj = <K extends keyof BrouillonBandeau>(cle: K, valeur: BrouillonBandeau[K]) =>
    setB((actuel) => ({ ...actuel, [cle]: valeur }));

  const modifies = champs.filter(({ cle }) => b[cle] !== publie[cle]);

  const afficher = (ok: boolean, texte: string) => {
    setMessage({ ok, texte });
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => setMessage(null), 4500);
  };

  const publier = useCallback(() => {
    if (modifies.length === 0 || enCours) return;
    demarrer(async () => {
      const resultat = await publierBandeau(b);
      if (resultat.ok) {
        // L'état local fait foi (une relecture immédiate du dépôt peut être en retard).
        const suivant = {
          ...b,
          message: b.message.trim(),
          lienHref: b.lienHref.trim(),
          lienLabel: b.lienLabel.trim(),
        };
        setPublie(suivant);
        setB(suivant);
      }
      afficher(resultat.ok, resultat.message);
    });
  }, [modifies.length, enCours, b]);

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

  // Fin automatique : un bandeau lié à une compétition s'efface après l'épreuve.
  const slug = slugCompetitionLiee(b.lienHref.trim());
  const fin = slug ? finCompetitions[slug] : undefined;
  const note = !b.actif
    ? "Le bandeau est masqué : rien ne s'affiche en haut du site."
    : fin && fin < aujourdhui
      ? `La compétition liée est passée (${formatJour(fin)}) : le bandeau ne s'affiche plus. Changez de lien ou de message.`
      : fin
        ? `Le bandeau disparaîtra automatiquement après le ${formatJour(fin)}. Aucun oubli possible.`
        : "Le bandeau reste affiché jusqu'à ce que vous le masquiez.";
  const visible = b.actif && b.message.trim() !== "" && !(fin && fin < aujourdhui);

  return (
    <>
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">Bandeau d&apos;information</h1>
        <p className="mt-1 text-[14px] text-neutral-500">
          Ce que vos visiteurs voient en haut du site. Les changements sont visibles dès la publication.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 rounded-xl border border-neutral-200 bg-white">
          <header className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
            <div>
              <h2 className="text-[15px] font-semibold text-neutral-900">Bandeau d&apos;information</h2>
              <p className="mt-0.5 text-[13px] text-neutral-500">Message court affiché en haut de toutes les pages</p>
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-neutral-700">
              {b.actif ? "Affiché" : "Masqué"}
              <span className="relative inline-flex">
                <input
                  type="checkbox"
                  role="switch"
                  checked={b.actif}
                  onChange={(e) => maj("actif", e.target.checked)}
                  className="peer sr-only"
                />
                <span aria-hidden="true" className="h-5 w-9 rounded-full bg-neutral-300 transition-colors peer-checked:bg-club-800 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-club-600" />
                <span aria-hidden="true" className="pointer-events-none absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
              </span>
            </label>
          </header>

          <div className="space-y-4 px-5 py-5">
            <div>
              <label htmlFor="message-bandeau" className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                Message
              </label>
              <div className="relative">
                <input
                  id="message-bandeau"
                  value={b.message}
                  maxLength={LONGUEUR_MAX_BANDEAU}
                  onChange={(e) => maj("message", e.target.value)}
                  placeholder="Abonnements 2027 ouverts : -5 % en paiement comptant"
                  aria-describedby="aide-message-bandeau"
                  className={cn(classeChamp, "pr-20")}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[12px]",
                    b.message.length > LONGUEUR_MAX_BANDEAU * 0.9 ? "text-or-600" : "text-neutral-400",
                  )}
                >
                  {b.message.length} / {LONGUEUR_MAX_BANDEAU}
                </span>
              </div>
              <p id="aide-message-bandeau" className="mt-1.5 text-[12px] text-neutral-500">
                Restez court : une seule ligne, {LONGUEUR_MAX_BANDEAU} caractères maximum.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
              <div>
                <label htmlFor="lien-bandeau" className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                  Lien du bouton
                </label>
                <ChampLien
                  id="lien-bandeau"
                  valeur={b.lienHref}
                  onChange={(lien) => maj("lienHref", lien)}
                  propositions={propositions}
                />
              </div>
              <div>
                <label htmlFor="bouton-bandeau" className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                  Texte du bouton
                </label>
                <input
                  id="bouton-bandeau"
                  value={b.lienLabel}
                  maxLength={LONGUEUR_MAX_BOUTON_BANDEAU}
                  onChange={(e) => maj("lienLabel", e.target.value)}
                  placeholder="S'inscrire"
                  className={classeChamp}
                />
              </div>
            </div>
            <p className="text-[12px] text-neutral-500">
              Facultatif. Laissez les deux champs vides pour un bandeau sans bouton.
            </p>
          </div>
        </section>

        <aside className="min-w-0 xl:sticky xl:top-6">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[13px] font-medium text-neutral-700">Aperçu en direct</p>
            <div role="radiogroup" aria-label="Appareil" className="flex rounded-lg bg-neutral-100 p-0.5">
              {(["ordinateur", "mobile"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={appareil === a}
                  aria-label={a === "ordinateur" ? "Ordinateur" : "Mobile"}
                  onClick={() => setAppareil(a)}
                  className={cn("rounded-md px-2 py-1", appareil === a ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500")}
                >
                  <IconeAdmin nom={a} className="size-4" />
                </button>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className={cn(
              "mx-auto overflow-hidden border border-neutral-200 bg-white transition-[width]",
              appareil === "ordinateur" ? "w-full rounded-xl" : "w-[260px] rounded-[26px] border-4 border-neutral-900",
            )}
          >
            {appareil === "ordinateur" ? (
              <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-2">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-2 rounded-full bg-neutral-300" />
                  ))}
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[11px] text-neutral-500">
                  <IconeAdmin nom="globe" className="size-3 shrink-0" />
                  <span className="truncate">chateaularcgolfclub.com</span>
                </span>
              </div>
            ) : null}

            {visible ? (
              <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 bg-club-950 px-3 py-2 text-center text-[11px] leading-snug text-sable-100">
                <span className="break-words">{b.message.trim()}</span>
                {b.lienHref.trim() && b.lienLabel.trim() ? (
                  <span className="whitespace-nowrap font-semibold text-or-400">{b.lienLabel.trim()} →</span>
                ) : null}
              </p>
            ) : (
              <p className="bg-neutral-100 px-3 py-2 text-center text-[11px] italic text-neutral-500">
                Aucun bandeau affiché
              </p>
            )}

            {pastilles.length ? (
              <ul className="flex flex-wrap gap-x-3 gap-y-1 border-b border-neutral-200 bg-sable-50 px-3 py-2 text-[11px] text-neutral-700">
                {pastilles.map((p) => (
                  <li key={p.texte} className="flex items-center gap-1.5">
                    <span className={cn("size-1.5 rounded-full", couleurs[p.ton])} />
                    {p.texte}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className={cn("relative", appareil === "ordinateur" ? "aspect-[16/9]" : "aspect-[3/4]")}>
              <Image src={image} alt="" fill sizes="380px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-3 text-white">
                <p className="font-butler text-[20px] font-bold leading-tight">Golf du Château l&apos;Arc</p>
                <p className="text-[11px] text-white/80">Fuveau · Pays d&apos;Aix</p>
              </div>
            </div>
          </div>

          <p className="mt-3 flex items-start gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] text-neutral-600">
            <IconeAdmin nom="info" className="mt-0.5 size-4 shrink-0 text-neutral-400" />
            <span>
              {note}
              {annonceEnCours ? (
                <span className="mt-1 block font-medium text-amber-800">
                  En ce moment, le site annonce à la place les inscriptions de « {annonceEnCours.nom} »
                  (option de la compétition), jusqu&apos;au {formatJour(annonceEnCours.jusquau)}.
                </span>
              ) : null}
            </span>
          </p>
        </aside>
      </div>

      <div aria-hidden="true" className="h-24" />

      {modifies.length > 0 ? (
        <div
          role="region"
          aria-label="Modifications non publiées"
          className="fixed inset-x-3 bottom-4 z-40 mx-auto flex max-w-xl flex-wrap items-center gap-x-4 gap-y-3 rounded-xl bg-neutral-900 px-4 py-3 text-white shadow-2xl sm:inset-x-6 lg:left-[256px]"
        >
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-or-400" />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium">
              {modifies.length} modification{modifies.length > 1 ? "s" : ""} non publiée{modifies.length > 1 ? "s" : ""}
            </p>
            <p className="truncate text-[12px] text-white/60">
              {modifies.map((m) => m.libelle(b, publie)).join(" · ")}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setB(publie)}
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
            "fixed left-1/2 z-40 -translate-x-1/2 rounded-lg px-4 py-2.5 text-[14px] text-white shadow-lg lg:left-[calc(50%+120px)]",
            message.ok ? "bg-club-800" : "bg-red-700",
            modifies.length > 0 ? "bottom-24" : "bottom-4",
          )}
        >
          {message.texte}
        </p>
      ) : null}
    </>
  );
}
