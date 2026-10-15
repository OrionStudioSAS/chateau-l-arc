"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import {
  publierPopup,
  type BrouillonPopup,
} from "@/app/(admin)/admin/(tableau-de-bord)/popup-marketing/actions";
import { classeChamp } from "@/components/admin/competitions/champs";
import { IconeAdmin } from "@/components/admin/icone-admin";
import { CartePopup } from "@/components/layout/carte-popup";
import {
  JOURS_AVANT_RETOUR,
  libelleLien,
  liensRapides,
  LONGUEUR_MAX_TEXTE,
  LONGUEUR_MAX_TITRE,
  pagesDuSite,
  surtitrePopup,
} from "@/lib/admin/popup";
import type { Popup } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { aujourdhuiAParis, formatDate } from "@/lib/format";

type Image3x2 = { fichier: File; apercu: string; largeur: number; hauteur: number };

/** Recadre au format 3:2 (centré) et réduit à 1600 × 1067 px, en JPEG. */
async function recadrer(fichier: File): Promise<Image3x2> {
  const image = await createImageBitmap(fichier);
  const ratio = 3 / 2;
  const [l, h] =
    image.width / image.height > ratio
      ? [image.height * ratio, image.height]
      : [image.width, image.width / ratio];
  const largeur = Math.min(1600, Math.round(l));
  const hauteur = Math.round(largeur / ratio);
  const toile = document.createElement("canvas");
  toile.width = largeur;
  toile.height = hauteur;
  toile
    .getContext("2d")
    ?.drawImage(image, (image.width - l) / 2, (image.height - h) / 2, l, h, 0, 0, largeur, hauteur);
  const blob = await new Promise<Blob | null>((ok) => toile.toBlob(ok, "image/jpeg", 0.85));
  if (!blob) throw new Error("Image illisible");
  const resultat = new File([blob], fichier.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  return { fichier: resultat, apercu: URL.createObjectURL(resultat), largeur, hauteur };
}

const depuisPopup = (popup: Popup | null): BrouillonPopup => ({
  actif: popup?.actif ?? false,
  titre: popup?.titre ?? "",
  texte: popup?.texte ?? "",
  boutonLibelle: popup?.boutonLibelle ?? "",
  boutonLien: popup?.boutonLien ?? "",
  debut: popup?.debut ?? "",
  fin: popup?.fin ?? "",
  retirerAffiche: false,
});

const groupes: { libelle: string; champs: (keyof BrouillonPopup)[] }[] = [
  { libelle: "titre", champs: ["titre"] },
  { libelle: "texte", champs: ["texte"] },
  { libelle: "bouton", champs: ["boutonLibelle", "boutonLien"] },
  { libelle: "période d'affichage", champs: ["debut", "fin"] },
  { libelle: "activation", champs: ["actif"] },
];

/** « Titre et période d'affichage » */
function resumeModifications(libelles: string[]): string {
  if (libelles.length === 0) return "";
  const texte = libelles.length === 1 ? libelles[0] : `${libelles.slice(0, -1).join(", ")} et ${libelles.at(-1)}`;
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

function Compteur({ valeur, max }: { valeur: string; max: number }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute bottom-2 right-3 font-mono text-[12px]",
        valeur.length > max * 0.9 ? "text-or-600" : "text-neutral-400",
      )}
    >
      {valeur.length} / {max}
    </span>
  );
}

/** Lien du bouton : pages du site proposées, ou toute adresse (https, tel, mailto). */
function ChampLien({ valeur, onChange }: { valeur: string; onChange: (lien: string) => void }) {
  const [focus, setFocus] = useState(false);
  const libelle = libelleLien(valeur);
  const terme = valeur.trim().toLowerCase();
  const propositions = [...pagesDuSite.map((p) => ({ ...p, libelle: `Page ${p.libelle}` })), ...liensRapides].filter(
    (p) => !terme || p.href.toLowerCase().includes(terme) || p.libelle.toLowerCase().includes(terme),
  );

  return (
    <div className="relative">
      <IconeAdmin nom="lien" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
      <input
        id="lien-popup"
        value={focus || !libelle ? valeur : `${valeur} — ${pagesDuSite.some((p) => p.href === valeur) ? "Page " : ""}${libelle}`}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => window.setTimeout(() => setFocus(false), 150)}
        placeholder="/une-page, https://…, tel:…"
        aria-describedby="aide-lien"
        className={cn(classeChamp, "pl-9 pr-8")}
      />
      <IconeAdmin nom="chevronHaut" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 rotate-180 text-neutral-400" />
      {focus && propositions.length ? (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-lg">
          {propositions.map((p) => (
            <li key={p.href}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(p.href);
                  (document.activeElement as HTMLElement | null)?.blur();
                }}
                className="flex w-full items-baseline gap-2 rounded-md px-2.5 py-1.5 text-left text-[14px] hover:bg-neutral-100"
              >
                <span className="text-neutral-900">{p.libelle}</span>
                <span className="truncate text-[12px] text-neutral-400">{p.href}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * Écran « Pop-up marketing » (maquette) : contenu et diffusion à gauche,
 * aperçu fidèle à droite ; les changements restent en brouillon jusqu'à
 * « Publier » (⌘ + Entrée).
 */
export function PopupAdmin({ popup }: { popup: Popup | null }) {
  const [publiee, setPubliee] = useState<BrouillonPopup>(() => depuisPopup(popup));
  const [b, setB] = useState<BrouillonPopup>(() => depuisPopup(popup));
  const [afficheEnLigne, setAfficheEnLigne] = useState<string | null>(popup?.afficheUrl ?? null);
  const [image, setImage] = useState<Image3x2 | null>(null);
  const [appareil, setAppareil] = useState<"ordinateur" | "mobile">("ordinateur");
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null);
  const [enCours, demarrer] = useTransition();
  const champImage = useRef<HTMLInputElement>(null);
  const minuteur = useRef<number | undefined>(undefined);

  const maj = <K extends keyof BrouillonPopup>(cle: K, valeur: BrouillonPopup[K]) =>
    setB((actuel) => ({ ...actuel, [cle]: valeur }));

  const modifies = [
    ...groupes.filter((g) => g.champs.some((c) => b[c] !== publiee[c])).map((g) => g.libelle),
    ...(image || b.retirerAffiche ? ["image"] : []),
  ];

  const afficher = (ok: boolean, texte: string) => {
    setMessage({ ok, texte });
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => setMessage(null), 4500);
  };

  const annuler = () => {
    setB(publiee);
    setImage(null);
  };

  const publier = useCallback(() => {
    if (modifies.length === 0 || enCours) return;
    const donnees = new FormData();
    donnees.set("donnees", JSON.stringify(b));
    if (image) donnees.set("affiche", image.fichier);

    demarrer(async () => {
      const resultat = await publierPopup(donnees);
      if (resultat.ok) {
        // L'état local fait foi (une relecture immédiate du dépôt peut être en retard).
        const suivante = { ...b, retirerAffiche: false };
        setPubliee(suivante);
        setB(suivante);
        setAfficheEnLigne(image ? image.apercu : b.retirerAffiche ? null : afficheEnLigne);
        setImage(null);
      }
      afficher(resultat.ok, resultat.message);
    });
  }, [modifies.length, enCours, b, image, afficheEnLigne]);

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

  const choisirImage = async (fichier: File | undefined) => {
    if (!fichier) return;
    try {
      setImage(await recadrer(fichier));
      maj("retirerAffiche", false);
    } catch {
      afficher(false, "Cette image est illisible. Essayez un JPEG ou un PNG.");
    }
  };

  const imageAffichee = image?.apercu ?? (b.retirerAffiche ? null : afficheEnLigne);
  const jour = aujourdhuiAParis();
  const etat = !b.actif
    ? "Désactivée : rien ne s'affiche sur le site."
    : b.fin && b.fin < jour
      ? `Période terminée le ${formatDate(b.fin)} : changez les dates pour l'afficher.`
      : b.debut && b.debut > jour
        ? `Programmée : visible à partir du ${formatDate(b.debut)}.`
        : null;

  return (
    <>
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">Pop-up marketing</h1>
        <p className="mt-1 text-[14px] text-neutral-500">
          Une seule pop-up active à la fois · affichée une seule fois par visiteur.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <section className="min-w-0 rounded-xl border border-neutral-200 bg-white">
          <header className="border-b border-neutral-200 px-5 py-4 sm:px-6">
            <h2 className="text-[15px] font-semibold text-neutral-900">Contenu</h2>
            <p className="mt-0.5 text-[13px] text-neutral-500">Ce que voit le visiteur</p>
          </header>

          <div className="space-y-4 px-5 py-5 sm:px-6">
            <div>
              <label htmlFor="titre-popup" className="mb-1.5 block text-[13px] font-medium text-neutral-700">Titre</label>
              <div className="relative">
                <input
                  id="titre-popup"
                  value={b.titre}
                  maxLength={LONGUEUR_MAX_TITRE}
                  onChange={(e) => maj("titre", e.target.value)}
                  placeholder="Stages d'été : dernières places"
                  className={cn(classeChamp, "pr-20")}
                />
                <Compteur valeur={b.titre} max={LONGUEUR_MAX_TITRE} />
              </div>
            </div>

            <div>
              <label htmlFor="texte-popup" className="mb-1.5 block text-[13px] font-medium text-neutral-700">Texte</label>
              <div className="relative">
                <textarea
                  id="texte-popup"
                  value={b.texte}
                  maxLength={LONGUEUR_MAX_TEXTE}
                  rows={3}
                  onChange={(e) => maj("texte", e.target.value)}
                  className={cn(classeChamp, "resize-none pb-7")}
                />
                <Compteur valeur={b.texte} max={LONGUEUR_MAX_TEXTE} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
              <div>
                <label htmlFor="bouton-popup" className="mb-1.5 block text-[13px] font-medium text-neutral-700">Texte du bouton</label>
                <input
                  id="bouton-popup"
                  value={b.boutonLibelle}
                  maxLength={30}
                  onChange={(e) => maj("boutonLibelle", e.target.value)}
                  placeholder="Réserver un stage"
                  className={classeChamp}
                />
              </div>
              <div>
                <label htmlFor="lien-popup" className="mb-1.5 block text-[13px] font-medium text-neutral-700">Lien</label>
                <ChampLien valeur={b.boutonLien} onChange={(lien) => maj("boutonLien", lien)} />
                <p id="aide-lien" className="mt-1.5 text-[12px] text-neutral-500">
                  Une page du site, un numéro de téléphone ou un lien externe.
                </p>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[13px] font-medium text-neutral-700">Image (facultatif)</p>
              <input
                ref={champImage}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                aria-label="Choisir une image"
                onChange={(e) => {
                  void choisirImage(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              {imageAffichee ? (
                <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageAffichee} alt="" className="h-10 w-14 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-neutral-900">
                      {image?.fichier.name ?? imageAffichee.split("/").pop()}
                    </p>
                    <p className="text-[12px] text-neutral-500">
                      {image
                        ? `${image.largeur} × ${image.hauteur} · ${Math.round(image.fichier.size / 1024)} Ko · recadrée automatiquement`
                        : "Image en ligne"}
                    </p>
                  </div>
                  <button type="button" onClick={() => champImage.current?.click()} className="rounded-md px-2.5 py-1.5 text-[14px] text-neutral-700 hover:bg-neutral-200/60">
                    Remplacer
                  </button>
                  <button
                    type="button"
                    aria-label="Retirer l'image"
                    onClick={() => {
                      setImage(null);
                      if (afficheEnLigne) maj("retirerAffiche", true);
                    }}
                    className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-200/60"
                  >
                    <IconeAdmin nom="fermer" className="size-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => champImage.current?.click()}
                  className="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-neutral-300 px-4 py-5 text-[14px] text-neutral-600 hover:bg-neutral-50"
                >
                  <IconeAdmin nom="image" className="size-5 text-neutral-400" />
                  Ajouter une image
                  <span className="text-[12px] text-neutral-400">Recadrée automatiquement au format paysage</span>
                </button>
              )}
            </div>
          </div>

          <header className="flex items-start justify-between gap-4 border-y border-neutral-200 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-[15px] font-semibold text-neutral-900">Diffusion</h2>
              <p className="mt-0.5 text-[13px] text-neutral-500">Quand et où la pop-up apparaît</p>
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-neutral-700">
              {b.actif ? "Active" : "Désactivée"}
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

          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
            {(
              [
                ["debut", "Début"],
                ["fin", "Fin"],
              ] as const
            ).map(([cle, libelle]) => (
              <div key={cle}>
                <label htmlFor={`${cle}-popup`} className="mb-1.5 block text-[13px] font-medium text-neutral-700">{libelle}</label>
                <input
                  id={`${cle}-popup`}
                  type="date"
                  value={b[cle]}
                  min={cle === "fin" ? b.debut || undefined : undefined}
                  onChange={(e) => maj(cle, e.target.value)}
                  className={classeChamp}
                />
              </div>
            ))}
          </div>
        </section>

        <aside className="min-w-0 xl:sticky xl:top-6">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[13px] font-medium text-neutral-700">Aperçu sur le site</p>
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
            className={cn(
              "relative mx-auto flex items-center justify-center overflow-hidden rounded-xl border border-neutral-200 transition-[width]",
              appareil === "ordinateur" ? "aspect-[440/540] w-full" : "aspect-[9/17] w-[260px] rounded-[28px] border-4 border-neutral-900",
            )}
          >
            <Image src="/images/parcours.png" alt="" fill sizes="440px" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-club-950/30" />
            <div className={cn("relative origin-center", appareil === "ordinateur" ? "w-[300px] scale-100" : "w-[300px] scale-[0.75]")}>
              <CartePopup
                surtitre={surtitrePopup(b.boutonLien, b.debut)}
                titre={b.titre}
                texte={b.texte}
                boutonLibelle={b.boutonLibelle}
                boutonLien={b.boutonLien || "#"}
                afficheUrl={imageAffichee ?? undefined}
                className="pointer-events-none"
              />
            </div>
          </div>

          <p className="mt-3 flex items-start gap-2.5 rounded-lg bg-neutral-50 px-4 py-3 text-[13px] text-neutral-600">
            <IconeAdmin nom="oeil" className="mt-0.5 size-4 shrink-0 text-neutral-400" />
            <span>
              Fermée par le visiteur, elle ne réapparaît pas avant {JOURS_AVANT_RETOUR} jours.
              {etat ? <span className="mt-1 block font-medium text-amber-800">{etat}</span> : null}
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
            <p className="text-[14px] font-medium">Modifications non publiées</p>
            <p className="truncate text-[12px] text-white/60">{resumeModifications(modifies)}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={annuler} disabled={enCours} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[14px] hover:bg-white/10 disabled:opacity-50">
              Annuler
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
