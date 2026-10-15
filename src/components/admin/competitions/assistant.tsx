"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { sauvegarderCompetition } from "@/app/(admin)/admin/(tableau-de-bord)/competitions/actions";
import {
  Champ,
  classeChamp,
  EditeurTexte,
  Etiquettes,
  Interrupteur,
  Segments,
} from "@/components/admin/competitions/champs";
import { CarteApercu } from "@/components/admin/competitions/carte-apercu";
import { IconeAdmin } from "@/components/admin/icone-admin";
import { TexteRiche } from "@/components/ui/texte-riche";
import {
  FORMULES,
  INDEX_OUVERT,
  libellesPublics,
  manquantsPourPublier,
  MODES_INSCRIPTION,
  SUGGESTIONS_CATEGORIES,
  type BrouillonCompetition,
} from "@/lib/admin/brouillon-competition";
import { libellesCategorie } from "@/lib/competitions";
import { cn } from "@/lib/cn";
import type { CategorieCompetition } from "@/lib/api/types";

const ETAPES = ["Le jeu", "Inscriptions", "Présentation", "Vérification"] as const;
const CLE_LOCALE = "chateau-larc:competition:";
const TAILLE_MAX_REGLEMENT = 2 * 1024 * 1024;

/** Réduit l'affiche à 1600 px de côté (JPEG) : envoi rapide, sous la limite de Vercel. */
async function reduireImage(fichier: File): Promise<{ fichier: File; largeur: number; hauteur: number }> {
  const image = await createImageBitmap(fichier);
  const echelle = Math.min(1, 1600 / Math.max(image.width, image.height));
  const largeur = Math.round(image.width * echelle);
  const hauteur = Math.round(image.height * echelle);
  const toile = document.createElement("canvas");
  toile.width = largeur;
  toile.height = hauteur;
  toile.getContext("2d")?.drawImage(image, 0, 0, largeur, hauteur);
  const blob = await new Promise<Blob | null>((ok) => toile.toBlob(ok, "image/jpeg", 0.85));
  if (!blob) throw new Error("Image illisible");
  const nom = fichier.name.replace(/\.[^.]+$/, "") + ".jpg";
  return { fichier: new File([blob], nom, { type: "image/jpeg" }), largeur, hauteur };
}

function depuis(date: number | null, maintenant: number): string {
  if (!date) return "";
  const s = Math.max(0, Math.round((maintenant - date) / 1000));
  if (s < 60) return `il y a ${s} s`;
  const min = Math.round(s / 60);
  return min < 60 ? `il y a ${min} min` : "il y a plus d'une heure";
}

type Pieces = {
  affiche: { fichier: File; apercu: string; largeur: number; hauteur: number } | null;
  reglement: File | null;
};

/**
 * Assistant de création et de modification d'une compétition (maquettes
 * « Nouvelle compétition ») : quatre étapes dans un panneau latéral. La
 * saisie est gardée dans ce navigateur au fil de l'eau (enregistrement
 * automatique) ; « Enregistrer le brouillon » et « Publier » l'envoient sur le site.
 */
export function AssistantCompetition({
  initial,
  statutInitial,
  titre,
  memoriser = true,
  onFermer,
  onEnregistre,
}: {
  initial: BrouillonCompetition;
  /** Faux pour une copie : ne pas reprendre une autre saisie gardée sur l'appareil. */
  memoriser?: boolean;
  statutInitial: "publie" | "brouillon" | null;
  titre: string;
  onFermer: () => void;
  onEnregistre: (message: string) => void;
}) {
  const cleLocale = CLE_LOCALE + (memoriser ? (initial.id ?? "nouvelle") : "copie");
  const [b, setB] = useState<BrouillonCompetition>(initial);
  const [etape, setEtape] = useState(0);
  const [pieces, setPieces] = useState<Pieces>({ affiche: null, reglement: null });
  const [sauvegarde, setSauvegarde] = useState<number | null>(null);
  const [restaure, setRestaure] = useState(false);
  const [maintenant, setMaintenant] = useState(() => Date.now());
  const [erreur, setErreur] = useState<string | null>(null);
  const [apercu, setApercu] = useState(false);
  const [enCours, demarrer] = useTransition();
  const premier = useRef(true);
  const champAffiche = useRef<HTMLInputElement>(null);
  const champReglement = useRef<HTMLInputElement>(null);

  // Saisie en cours retrouvée dans ce navigateur (onglet fermé, page rechargée…).
  useEffect(() => {
    if (!memoriser) return;
    try {
      const garde = JSON.parse(window.localStorage.getItem(cleLocale) ?? "null");
      if (garde?.donnees) {
        // Lecture unique au montage, après l'hydratation.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setB({ ...initial, ...garde.donnees, afficheUrl: initial.afficheUrl, reglementUrl: initial.reglementUrl });
        setSauvegarde(garde.date);
        setRestaure(true);
      }
    } catch {
      // Stockage indisponible : on repart de la version enregistrée.
    }
  }, [cleLocale, initial, memoriser]);

  // Enregistrement automatique local, une seconde après la dernière frappe.
  useEffect(() => {
    if (premier.current) {
      premier.current = false;
      return;
    }
    const minuteur = window.setTimeout(() => {
      try {
        const date = Date.now();
        window.localStorage.setItem(cleLocale, JSON.stringify({ donnees: b, date }));
        setSauvegarde(date);
      } catch {
        // Voir plus haut.
      }
    }, 1000);
    return () => window.clearTimeout(minuteur);
  }, [b, cleLocale]);

  useEffect(() => {
    const horloge = window.setInterval(() => setMaintenant(Date.now()), 5000);
    return () => window.clearInterval(horloge);
  }, []);

  const maj = <K extends keyof BrouillonCompetition>(cle: K, valeur: BrouillonCompetition[K]) =>
    setB((actuel) => ({ ...actuel, [cle]: valeur }));

  const enregistrer = useCallback(
    (statut: "publie" | "brouillon") => {
      setErreur(null);
      const donnees = new FormData();
      donnees.set("donnees", JSON.stringify(b));
      donnees.set("statut", statut);
      if (pieces.affiche) donnees.set("affiche", pieces.affiche.fichier);
      if (pieces.reglement) donnees.set("reglement", pieces.reglement);

      demarrer(async () => {
        const resultat = await sauvegarderCompetition(donnees);
        if (!resultat.ok) {
          setErreur(resultat.message);
          return;
        }
        try {
          window.localStorage.removeItem(cleLocale);
        } catch {
          // Voir plus haut.
        }
        onEnregistre(resultat.message);
      });
    },
    [b, pieces, cleLocale, onEnregistre],
  );

  const suivant = useCallback(() => {
    if (etape < ETAPES.length - 1) setEtape((e) => e + 1);
    else enregistrer("publie");
  }, [etape, enregistrer]);

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !apercu) onFermer();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        suivant();
      }
    };
    document.addEventListener("keydown", surTouche);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", surTouche);
      document.documentElement.style.overflow = "";
    };
  }, [onFermer, suivant, apercu]);

  const choisirAffiche = async (fichier: File | undefined) => {
    if (!fichier) return;
    try {
      const reduite = await reduireImage(fichier);
      setPieces((p) => ({ ...p, affiche: { ...reduite, apercu: URL.createObjectURL(reduite.fichier) } }));
      setErreur(null);
    } catch {
      setErreur("Cette image est illisible. Essayez un JPEG ou un PNG.");
    }
  };

  const choisirReglement = (fichier: File | undefined) => {
    if (!fichier) return;
    if (fichier.type !== "application/pdf") return setErreur("Le règlement doit être un PDF.");
    if (fichier.size > TAILLE_MAX_REGLEMENT) return setErreur("Le règlement dépasse 2 Mo.");
    setErreur(null);
    setPieces((p) => ({ ...p, reglement: fichier }));
  };

  const publics = libellesPublics(b);
  const manquants = manquantsPourPublier(b);
  const imageAffiche = pieces.affiche?.apercu ?? b.afficheUrl;
  const soustitre = sauvegarde
    ? `${etape > 0 && b.nom ? `${b.nom} · e` : "E"}nregistré automatiquement ${depuis(sauvegarde, maintenant)}${restaure ? " · saisie retrouvée sur cet appareil" : ""}`
    : "Enregistrement automatique sur cet appareil";

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" className="absolute inset-0 bg-neutral-900/30" onClick={onFermer} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-assistant"
        className="absolute inset-y-0 right-0 flex w-full max-w-[620px] flex-col bg-white shadow-2xl sm:inset-y-2 sm:right-2 sm:rounded-xl"
      >
        <header className="px-5 pt-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id="titre-assistant" className="flex flex-wrap items-center gap-2 text-[18px] font-semibold text-neutral-900">
                {titre}
                <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[12px] font-medium text-neutral-600">
                  <span
                    aria-hidden="true"
                    className={cn("size-1.5 rounded-full", statutInitial === "publie" ? "bg-emerald-500" : "bg-neutral-400")}
                  />
                  {statutInitial === "publie" ? "Publiée" : "Brouillon"}
                </span>
              </h2>
              <p className="mt-1 flex items-center gap-1.5 truncate text-[13px] text-neutral-500">
                <IconeAdmin nom="nuage" className="size-3.5" />
                {soustitre}
              </p>
            </div>
            <button
              type="button"
              aria-label="Fermer"
              onClick={onFermer}
              className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100"
            >
              <IconeAdmin nom="fermer" className="size-4" />
            </button>
          </div>

          <ol className="mt-5 flex items-center gap-2 overflow-x-auto border-b border-neutral-200 pb-4">
            {ETAPES.map((nom, i) => (
              <li key={nom} className="flex shrink-0 items-center gap-2">
                {i > 0 ? (
                  <span aria-hidden="true" className={cn("h-px w-5 sm:w-8", i <= etape ? "bg-club-800" : "bg-neutral-200")} />
                ) : null}
                <button
                  type="button"
                  onClick={() => setEtape(i)}
                  aria-current={i === etape ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-2 text-[14px]",
                    i === etape ? "font-medium text-neutral-900" : i < etape ? "text-neutral-800" : "text-neutral-500",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full text-[11px] font-semibold",
                      i < etape && "bg-club-800 text-white",
                      i === etape && "bg-neutral-900 text-white",
                      i > etape && "border border-neutral-300 text-neutral-500",
                    )}
                  >
                    {i < etape ? <IconeAdmin nom="coche" className="size-3" /> : i + 1}
                  </span>
                  <span className={cn(i !== etape && "hidden sm:inline")}>{nom}</span>
                </button>
              </li>
            ))}
          </ol>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {etape === 0 ? (
            <div className="space-y-4">
              <EnTeteEtape titre="Le jeu" texte="Les informations affichées sur la fiche de la compétition." />
              <Champ libelle="Nom de la compétition" requis>
                {(id) => (
                  <input
                    id={id}
                    value={b.nom}
                    onChange={(e) => maj("nom", e.target.value)}
                    maxLength={80}
                    placeholder="Coupe de l'automne"
                    className={classeChamp}
                  />
                )}
              </Champ>
              <div className="grid gap-4 sm:grid-cols-2">
                <Champ libelle="Date" requis aide={b.dateFin ? undefined : "Sur plusieurs jours ? Ajoutez une date de fin ci-dessous."}>
                  {(id) => (
                    <input id={id} type="date" value={b.dateDebut} onChange={(e) => maj("dateDebut", e.target.value)} className={classeChamp} />
                  )}
                </Champ>
                <Champ libelle="Formule" requis>
                  {(id) => (
                    <select id={id} value={b.formule} onChange={(e) => maj("formule", e.target.value)} className={classeChamp}>
                      <option value="">Choisir…</option>
                      {[...new Set([...FORMULES, b.formule].filter(Boolean))].map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                  )}
                </Champ>
              </div>
              <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto]">
                <Champ libelle="Départ">
                  {() => (
                    <Segments
                      libelle="Type de départ"
                      valeur={b.typeDepart}
                      onChange={(v) => maj("typeDepart", v)}
                      options={[
                        { valeur: "shotgun", libelle: "Shotgun" },
                        { valeur: "tee-times", libelle: "Tee-times" },
                      ]}
                    />
                  )}
                </Champ>
                <Champ libelle="Heure">
                  {(id) => (
                    <div className="relative">
                      <IconeAdmin nom="horloge" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                      <input id={id} value={b.heure} onChange={(e) => maj("heure", e.target.value)} maxLength={10} placeholder="9h00" className={cn(classeChamp, "pl-9")} />
                    </div>
                  )}
                </Champ>
                <Champ libelle="Trous">
                  {() => (
                    <Segments
                      libelle="Nombre de trous"
                      valeur={b.trous}
                      onChange={(v) => maj("trous", v)}
                      options={[
                        { valeur: "9", libelle: "9" },
                        { valeur: "18", libelle: "18" },
                        { valeur: "36", libelle: "36" },
                      ]}
                    />
                  )}
                </Champ>
              </div>
              <Champ libelle="Date de fin" facultatif>
                {(id) => (
                  <input id={id} type="date" min={b.dateDebut || undefined} value={b.dateFin} onChange={(e) => maj("dateFin", e.target.value)} className={cn(classeChamp, "sm:w-1/2")} />
                )}
              </Champ>
              <Champ libelle="Catégories" aide="Un classement est publié pour chaque catégorie.">
                {(id) => (
                  <Etiquettes id={id} valeurs={b.categories} suggestions={SUGGESTIONS_CATEGORIES} onChange={(v) => maj("categories", v)} />
                )}
              </Champ>
              <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                <Champ libelle="Index maximum">
                  {(id) => (
                    <div className="relative">
                      <input
                        id={id}
                        inputMode="numeric"
                        value={b.indexMaximum}
                        onChange={(e) => maj("indexMaximum", e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                        className={cn(classeChamp, "pr-24")}
                      />
                      {b.indexMaximum === INDEX_OUVERT ? (
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-neutral-400">ouvert à tous</span>
                      ) : null}
                    </div>
                  )}
                </Champ>
                <Champ libelle="Sponsor" facultatif>
                  {(id) => (
                    <input id={id} value={b.sponsor} onChange={(e) => maj("sponsor", e.target.value)} maxLength={60} placeholder="Domaine des Masques" className={classeChamp} />
                  )}
                </Champ>
              </div>
              <Champ libelle="Type de compétition" aide="Sert aux filtres du calendrier sur le site.">
                {() => (
                  <Segments
                    libelle="Type de compétition"
                    valeur={b.categorie}
                    onChange={(v) => maj("categorie", v as CategorieCompetition)}
                    options={Object.entries(libellesCategorie).map(([valeur, libelle]) => ({
                      valeur: valeur as CategorieCompetition,
                      libelle,
                    }))}
                    className="sm:w-fit"
                  />
                )}
              </Champ>
              <Encart>Étape suivante : ouverture et clôture des inscriptions, nombre de places et droits de jeu membres / visiteurs.</Encart>
            </div>
          ) : null}

          {etape === 1 ? (
            <div className="space-y-4">
              <EnTeteEtape titre="Inscriptions" texte="Quand et comment les joueurs s'inscrivent." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Champ libelle="Ouverture des inscriptions" aide="Avant cette date : « Être prévenu ».">
                  {(id) => (
                    <input id={id} type="date" value={b.inscriptionOuverture} onChange={(e) => maj("inscriptionOuverture", e.target.value)} className={classeChamp} />
                  )}
                </Champ>
                <Champ libelle="Clôture des inscriptions" aide="Heure de Paris.">
                  {(id) => (
                    <input id={id} type="datetime-local" value={b.inscriptionCloture} onChange={(e) => maj("inscriptionCloture", e.target.value)} className={classeChamp} />
                  )}
                </Champ>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Champ libelle="Nombre de places" facultatif>
                  {(id) => (
                    <input id={id} inputMode="numeric" value={b.places} onChange={(e) => maj("places", e.target.value.replace(/[^\d]/g, ""))} placeholder="96" className={classeChamp} />
                  )}
                </Champ>
                <Champ libelle="Déjà inscrits" aide="Affiché « 42 / 96 » sur la fiche.">
                  {(id) => (
                    <input id={id} inputMode="numeric" value={b.inscrits} onChange={(e) => maj("inscrits", e.target.value.replace(/[^\d]/g, ""))} className={classeChamp} />
                  )}
                </Champ>
              </div>
              <Champ libelle="Mode d'inscription">
                {(id) => (
                  <>
                    <input id={id} list={`${id}-modes`} value={b.modeInscription} onChange={(e) => maj("modeInscription", e.target.value)} className={classeChamp} />
                    <datalist id={`${id}-modes`}>
                      {MODES_INSCRIPTION.map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </>
                )}
              </Champ>
              <div className="grid gap-4 sm:grid-cols-2">
                <Champ libelle="Droit de jeu — membres">
                  {(id) => (
                    <input id={id} value={b.droitJeuMembres} onChange={(e) => maj("droitJeuMembres", e.target.value)} placeholder="15 €" className={classeChamp} />
                  )}
                </Champ>
                <Champ libelle="Droit de jeu — visiteurs">
                  {(id) => (
                    <input id={id} value={b.droitJeuVisiteurs} onChange={(e) => maj("droitJeuVisiteurs", e.target.value)} placeholder="15 € + green fee" className={classeChamp} />
                  )}
                </Champ>
              </div>
              <Champ libelle="Inclus" facultatif>
                {(id) => (
                  <input id={id} value={b.inclus} onChange={(e) => maj("inclus", e.target.value)} placeholder="Remise des prix · cocktail" className={classeChamp} />
                )}
              </Champ>
              <Interrupteur
                titre="Ouverte aux visiteurs"
                texte="Les joueurs non membres peuvent s'inscrire (badge « Ouvert à tous » sur le site)."
                actif={b.ouverteVisiteurs}
                onChange={(v) => maj("ouverteVisiteurs", v)}
              />
              <Encart>Étape suivante : affiche, description et règlement, mise en avant sur le site.</Encart>
            </div>
          ) : null}

          {etape === 2 ? (
            <div className="space-y-4">
              <EnTeteEtape titre="Présentation sur le site" texte="Ce que les joueurs voient sur la page de la compétition." />
              <Champ libelle="Affiche" facultatif>
                {(id) => (
                  <>
                    <input
                      ref={champAffiche}
                      id={id}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => choisirAffiche(e.target.files?.[0])}
                    />
                    {imageAffiche ? (
                      <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageAffiche} alt="" className="size-16 rounded-md object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-medium text-neutral-900">
                            {pieces.affiche?.fichier.name ?? imageAffiche.split("/").pop()}
                          </p>
                          <p className="text-[12px] text-neutral-500">
                            {pieces.affiche ? `${pieces.affiche.largeur} × ${pieces.affiche.hauteur} · ` : ""}format portrait conseillé
                          </p>
                        </div>
                        <button type="button" onClick={() => champAffiche.current?.click()} className="rounded-md px-2.5 py-1.5 text-[14px] text-neutral-700 hover:bg-neutral-200/60">
                          Remplacer
                        </button>
                        <button
                          type="button"
                          aria-label="Retirer l'affiche"
                          onClick={() => {
                            setPieces((p) => ({ ...p, affiche: null }));
                            maj("afficheUrl", null);
                          }}
                          className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-200/60"
                        >
                          <IconeAdmin nom="fermer" className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => champAffiche.current?.click()}
                        className="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-neutral-300 px-4 py-6 text-[14px] text-neutral-600 hover:bg-neutral-50"
                      >
                        <IconeAdmin nom="image" className="size-5 text-neutral-400" />
                        Ajouter une affiche
                        <span className="text-[12px] text-neutral-400">JPEG, PNG ou WebP · réduite automatiquement</span>
                      </button>
                    )}
                  </>
                )}
              </Champ>
              <Champ libelle="Description" aide="Visible sur la fiche de la compétition et partagée sur les réseaux.">
                {(id) => <EditeurTexte id={id} valeur={b.description} onChange={(v) => maj("description", v)} />}
              </Champ>
              <Champ libelle="Règlement" facultatif>
                {(id) => (
                  <>
                    <input
                      ref={champReglement}
                      id={id}
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                      onChange={(e) => choisirReglement(e.target.files?.[0])}
                    />
                    {pieces.reglement || b.reglementUrl ? (
                      <div className="flex items-center gap-3 rounded-lg border border-neutral-200 px-3 py-2.5">
                        <span className="rounded bg-red-50 px-1.5 py-1 text-[10px] font-bold text-red-600">PDF</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-medium text-neutral-900">
                            {pieces.reglement?.name ?? b.reglementUrl?.split("/").pop()}
                          </p>
                          {pieces.reglement ? (
                            <p className="text-[12px] text-neutral-500">{Math.round(pieces.reglement.size / 1024)} Ko</p>
                          ) : null}
                        </div>
                        <button type="button" onClick={() => champReglement.current?.click()} className="rounded-md px-2.5 py-1.5 text-[14px] text-neutral-700 hover:bg-neutral-100">
                          Remplacer
                        </button>
                        <button
                          type="button"
                          aria-label="Retirer le règlement"
                          onClick={() => {
                            setPieces((p) => ({ ...p, reglement: null }));
                            maj("reglementUrl", null);
                          }}
                          className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100"
                        >
                          <IconeAdmin nom="fermer" className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => champReglement.current?.click()}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-3 text-[14px] text-neutral-600 hover:bg-neutral-50"
                      >
                        <IconeAdmin nom="envoi" className="size-4 text-neutral-400" />
                        Ajouter le règlement (PDF, 2 Mo max.)
                      </button>
                    )}
                  </>
                )}
              </Champ>
              <Interrupteur
                titre="Mettre en avant sur l'accueil"
                texte="Apparaît dans « Prochaines compétitions » sur la page d'accueil."
                actif={b.miseEnAvant}
                onChange={(v) => maj("miseEnAvant", v)}
              />
              <Interrupteur
                titre="Annoncer dans le bandeau d'information"
                texte="Le bandeau s'affiche à l'ouverture des inscriptions, jusqu'à la clôture."
                actif={b.annonceBandeau}
                onChange={(v) => maj("annonceBandeau", v)}
              />
              <div>
                <p className="mb-1.5 text-[13px] font-medium text-neutral-700">Aperçu de la carte sur le site</p>
                <CarteApercu brouillon={b} affiche={imageAffiche} />
              </div>
            </div>
          ) : null}

          {etape === 3 ? (
            <div className="space-y-4">
              <EnTeteEtape titre="Vérification" texte="Relisez avant de publier : la compétition apparaîtra aussitôt sur le site." />
              {manquants.length ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[14px] text-amber-900">
                  Pour publier, renseignez {manquants.join(", ")}. Vous pouvez enregistrer un brouillon en attendant.
                </p>
              ) : null}
              <Resume titre="Le jeu" onModifier={() => setEtape(0)} lignes={[
                ["Nom", b.nom],
                ["Date", [b.dateDebut, b.dateFin].filter(Boolean).join(" → ")],
                ["Formule", b.formule],
                ["Départ", publics.depart],
                ["Trous", publics.trous],
                ["Catégories", publics.categories],
                ["Index maximum", publics.indexMaximum],
                ["Sponsor", b.sponsor],
                ["Type", libellesCategorie[b.categorie]],
              ]} />
              <Resume titre="Inscriptions" onModifier={() => setEtape(1)} lignes={[
                ["Ouverture", b.inscriptionOuverture || "Dès la publication"],
                ["Clôture", b.inscriptionCloture.replace("T", " à ") || "Le jour de la compétition"],
                ["Places", b.places ? `${b.inscrits || 0} / ${b.places}` : "Sans limite affichée"],
                ["Mode", b.modeInscription],
                ["Membres", b.droitJeuMembres],
                ["Visiteurs", b.ouverteVisiteurs ? b.droitJeuVisiteurs || "Ouverte" : "Réservée aux membres"],
                ["Inclus", b.inclus],
              ]} />
              <Resume titre="Présentation" onModifier={() => setEtape(2)} lignes={[
                ["Affiche", imageAffiche ? "Oui" : "Aucune"],
                ["Description", b.description ? `${b.description.length} caractères` : "Aucune"],
                ["Règlement", pieces.reglement || b.reglementUrl ? "PDF joint" : "Aucun"],
                ["Accueil", b.miseEnAvant ? "Mise en avant" : "Non"],
                ["Bandeau", b.annonceBandeau ? "Annonce pendant les inscriptions" : "Non"],
              ]} />
            </div>
          ) : null}

          {erreur ? (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-[14px] text-red-700">
              {erreur}
            </p>
          ) : null}
        </div>

        <footer className="flex flex-wrap items-center gap-2 border-t border-neutral-200 px-5 py-3.5 sm:px-6">
          <button type="button" onClick={() => setApercu(true)} className="mr-auto flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[14px] text-neutral-700 hover:bg-neutral-100">
            <IconeAdmin nom="oeil" className="size-4" />
            Aperçu
          </button>
          {etape === 0 || etape === 3 ? (
            <button
              type="button"
              disabled={enCours}
              onClick={() => enregistrer("brouillon")}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-60"
            >
              {statutInitial === "publie" ? "Repasser en brouillon" : "Enregistrer le brouillon"}
            </button>
          ) : null}
          {etape > 0 ? (
            <button type="button" onClick={() => setEtape((e) => e - 1)} className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] font-medium text-neutral-800 hover:bg-neutral-50">
              Retour
            </button>
          ) : null}
          <button
            type="button"
            disabled={enCours || (etape === 3 && manquants.length > 0)}
            onClick={suivant}
            className="flex items-center gap-2 rounded-lg bg-club-950 px-3.5 py-2 text-[14px] font-medium text-white hover:bg-club-800 disabled:opacity-50"
          >
            {enCours ? "Enregistrement…" : etape === 3 ? (statutInitial === "publie" ? "Mettre à jour" : "Publier") : "Continuer"}
            <span aria-hidden="true" className="hidden gap-0.5 sm:flex">
              <kbd className="rounded bg-white/20 px-1 font-sans text-[11px]">⌘</kbd>
              <kbd className="rounded bg-white/20 px-1 font-sans text-[11px]">↵</kbd>
            </span>
          </button>
        </footer>
      </section>

      {apercu ? (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-neutral-900/50 p-4 sm:p-10" onClick={() => setApercu(false)}>
          <div role="dialog" aria-modal="true" aria-label="Aperçu" onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium uppercase tracking-wide text-neutral-500">Aperçu sur le site</p>
              <button type="button" aria-label="Fermer l'aperçu" onClick={() => setApercu(false)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
                <IconeAdmin nom="fermer" className="size-4" />
              </button>
            </div>
            <div className="mt-4">
              <CarteApercu brouillon={b} affiche={imageAffiche} />
            </div>
            {b.description ? (
              <TexteRiche source={b.description} className="mt-6 text-[16px] leading-relaxed text-neutral-800" />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EnTeteEtape({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="pb-1">
      <h3 className="text-[15px] font-semibold text-neutral-900">{titre}</h3>
      <p className="mt-0.5 text-[13px] text-neutral-500">{texte}</p>
    </div>
  );
}

function Encart({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex gap-2.5 rounded-lg bg-neutral-50 px-4 py-3 text-[13px] text-neutral-600">
      <IconeAdmin nom="info" className="mt-0.5 size-4 text-neutral-400" />
      {children}
    </p>
  );
}

function Resume({
  titre,
  lignes,
  onModifier,
}: {
  titre: string;
  lignes: [string, string | null | undefined][];
  onModifier: () => void;
}) {
  return (
    <section className="rounded-lg border border-neutral-200">
      <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
        <h4 className="text-[14px] font-semibold text-neutral-900">{titre}</h4>
        <button type="button" onClick={onModifier} className="flex items-center gap-1 text-[13px] text-neutral-600 hover:text-neutral-900">
          <IconeAdmin nom="crayon" className="size-3.5" />
          Modifier
        </button>
      </header>
      <dl className="grid gap-x-4 gap-y-2 px-4 py-3 text-[13px] sm:grid-cols-[9rem_1fr]">
        {lignes.map(([libelle, valeur]) => (
          <div key={libelle} className="contents">
            <dt className="text-neutral-500">{libelle}</dt>
            <dd className="text-neutral-900">{valeur || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
