"use client";

import { useEffect, useState, useTransition } from "react";

import {
  enregistrerEvenement,
  supprimerEvenement,
} from "@/app/(admin)/admin/(tableau-de-bord)/competitions/actions-evenements";
import { Champ, classeChamp, Interrupteur } from "@/components/admin/competitions/champs";
import { IconeAdmin } from "@/components/admin/icone-admin";
import { cn } from "@/lib/cn";
import {
  LONGUEUR_MAX_DESCRIPTION_EVENEMENT,
  LONGUEUR_MAX_TITRE_EVENEMENT,
  typesEvenement,
  type EvenementCalendrier,
  type TypeEvenement,
} from "@/lib/evenements";

/** Couleur de chaque type, dans le calendrier et la liste du back-office. */
export const tonsEvenement: Record<TypeEvenement, string> = {
  entretien: "border-lime-200 bg-lime-50 text-lime-900",
  fermeture: "border-red-200 bg-red-50 text-red-800",
  animation: "border-violet-200 bg-violet-50 text-violet-800",
  autre: "border-stone-300 bg-stone-100 text-stone-700",
};

/** Suggestions de titres, pour aller vite. */
const suggestions: Record<TypeEvenement, string[]> = {
  entretien: ["Tonte des greens", "Carottage des greens", "Sablage des greens", "Tonte des fairways"],
  fermeture: ["Parcours fermé", "Practice fermé", "Restaurant fermé"],
  animation: ["Journée portes ouvertes", "Initiation gratuite", "Soirée du club"],
  autre: [],
};

/**
 * Fenêtre « Ajouter au calendrier » : une date qui n'est pas une compétition
 * (tonte, carottage, fermeture, animation…), sur un ou plusieurs jours.
 */
export function ModaleEvenement({
  initial,
  jourParDefaut,
  onFermer,
  onEnregistre,
  onSupprime,
}: {
  initial: EvenementCalendrier | null;
  jourParDefaut: string;
  onFermer: () => void;
  onEnregistre: (evenement: EvenementCalendrier, message: string) => void;
  onSupprime: (id: string, message: string) => void;
}) {
  const [type, setType] = useState<TypeEvenement>(initial?.type ?? "entretien");
  const [titre, setTitre] = useState(initial?.titre ?? "");
  const [dateDebut, setDateDebut] = useState(initial?.dateDebut ?? jourParDefaut);
  const [plusieursJours, setPlusieursJours] = useState(Boolean(initial?.dateFin));
  const [dateFin, setDateFin] = useState(initial?.dateFin ?? "");
  const [horaires, setHoraires] = useState(initial?.horaires ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [visible, setVisible] = useState(initial?.public ?? true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && onFermer();
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [onFermer]);

  const enregistrer = (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    demarrer(async () => {
      const resultat = await enregistrerEvenement({
        id: initial?.id,
        type,
        titre,
        dateDebut,
        dateFin: plusieursJours ? dateFin : null,
        horaires,
        description,
        public: visible,
      });
      if (resultat.ok) onEnregistre(resultat.evenement, resultat.message);
      else setErreur(resultat.message);
    });
  };

  const supprimer = () => {
    if (!initial || !window.confirm(`Retirer « ${initial.titre} » du calendrier ?`)) return;
    demarrer(async () => {
      const resultat = await supprimerEvenement(initial.id);
      if (resultat.ok) onSupprime(initial.id, resultat.message);
      else setErreur(resultat.message);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-900/40 p-3 sm:p-10" onClick={onFermer}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-evenement"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 id="titre-evenement" className="text-[16px] font-semibold text-neutral-900">
              {initial ? "Modifier la date" : "Ajouter au calendrier"}
            </h2>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              Entretien du parcours, fermeture, animation : tout ce qui n&apos;est pas une compétition.
            </p>
          </div>
          <button type="button" aria-label="Fermer" onClick={onFermer} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
            <IconeAdmin nom="fermer" className="size-4" />
          </button>
        </header>

        <form onSubmit={enregistrer} className="space-y-4 px-5 py-5">
          <fieldset>
            <legend className="mb-1.5 text-[13px] font-medium text-neutral-700">Type</legend>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(typesEvenement) as TypeEvenement[]).map((cle) => (
                <label
                  key={cle}
                  className={cn(
                    "flex cursor-pointer flex-col rounded-lg border px-3 py-2 transition-colors",
                    type === cle ? "border-club-600 bg-club-600/5 ring-1 ring-club-600" : "border-neutral-200 hover:border-neutral-300",
                  )}
                >
                  <input type="radio" name="type" checked={type === cle} onChange={() => setType(cle)} className="sr-only" />
                  <span className="flex items-center gap-2 text-[14px] font-medium text-neutral-900">
                    <span aria-hidden="true" className={cn("size-2.5 rounded-full border", tonsEvenement[cle])} />
                    {typesEvenement[cle].libelle}
                  </span>
                  <span className="mt-0.5 text-[12px] leading-snug text-neutral-500">{typesEvenement[cle].exemple}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Champ libelle="Titre" requis>
            {(id) => (
              <>
                <input
                  id={id}
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  maxLength={LONGUEUR_MAX_TITRE_EVENEMENT}
                  placeholder={suggestions[type][0] ?? "Ex. : Assemblée générale"}
                  required
                  className={classeChamp}
                />
                {suggestions[type].length && !titre ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {suggestions[type].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTitre(s)}
                        className="rounded-full border border-neutral-200 px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </Champ>

          <div className="grid gap-4 sm:grid-cols-2">
            <Champ libelle={plusieursJours ? "Du" : "Date"} requis>
              {(id) => (
                <input id={id} type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required className={classeChamp} />
              )}
            </Champ>
            {plusieursJours ? (
              <Champ libelle="Au" requis>
                {(id) => (
                  <input
                    id={id}
                    type="date"
                    value={dateFin}
                    min={dateDebut}
                    onChange={(e) => setDateFin(e.target.value)}
                    required
                    className={classeChamp}
                  />
                )}
              </Champ>
            ) : (
              <Champ libelle="Horaires" facultatif>
                {(id) => (
                  <input id={id} value={horaires} onChange={(e) => setHoraires(e.target.value)} maxLength={40} placeholder="7h – 11h" className={classeChamp} />
                )}
              </Champ>
            )}
          </div>
          <label className="flex items-center gap-2 text-[14px] text-neutral-700">
            <input type="checkbox" checked={plusieursJours} onChange={(e) => setPlusieursJours(e.target.checked)} className="accent-club-800" />
            Sur plusieurs jours
          </label>
          {plusieursJours ? (
            <Champ libelle="Horaires" facultatif>
              {(id) => (
                <input id={id} value={horaires} onChange={(e) => setHoraires(e.target.value)} maxLength={40} placeholder="Tous les matins" className={classeChamp} />
              )}
            </Champ>
          ) : null}

          <Champ libelle="Précisions" facultatif aide="Ex. : « Départs décalés au trou n° 10 le matin. »">
            {(id) => (
              <textarea
                id={id}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={LONGUEUR_MAX_DESCRIPTION_EVENEMENT}
                rows={2}
                className={cn(classeChamp, "resize-y")}
              />
            )}
          </Champ>

          <Interrupteur
            titre="Afficher sur le site"
            texte="Dans le calendrier de la page Compétitions. Sinon, la date reste interne au back-office."
            actif={visible}
            onChange={setVisible}
          />

          {erreur ? <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-800">{erreur}</p> : null}

          <div className="flex items-center gap-2 border-t border-neutral-100 pt-4">
            {initial ? (
              <button
                type="button"
                onClick={supprimer}
                disabled={enCours}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <IconeAdmin nom="corbeille" className="size-4" />
                Supprimer
              </button>
            ) : null}
            <span className="flex-1" />
            <button type="button" onClick={onFermer} className="rounded-lg px-3 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100">
              Annuler
            </button>
            <button
              type="submit"
              disabled={enCours}
              className="rounded-lg bg-club-950 px-4 py-2 text-[14px] font-medium text-white hover:bg-club-800 disabled:opacity-50"
            >
              {enCours ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
