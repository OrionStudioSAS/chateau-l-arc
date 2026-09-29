"use client";

import { useActionState, useEffect, useState } from "react";

import { enregistrerPopup } from "@/app/(admin)/admin/(tableau-de-bord)/popup-marketing/actions";
import { AdminCard } from "@/components/admin/admin-card";
import { CartePopup } from "@/components/layout/carte-popup";
import type { EtatPopup } from "@/lib/admin/popup";
import type { Popup } from "@/lib/api/types";
import { aujourdhuiAParis, formatDate } from "@/lib/format";

const champ =
  "mt-2 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-club-600 focus:bg-white";
const etiquette = "block text-xs font-semibold text-neutral-700";

export function FormulairePopup({ popup }: { popup: Popup | null }) {
  const [etat, action, enCours] = useActionState<EtatPopup, FormData>(
    enregistrerPopup,
    { statut: "vide" },
  );

  // Champs contrôlés : l'aperçu suit la saisie en direct.
  const [actif, setActif] = useState(popup?.actif ?? false);
  const [titre, setTitre] = useState(popup?.titre ?? "");
  const [texte, setTexte] = useState(popup?.texte ?? "");
  const [boutonLibelle, setBoutonLibelle] = useState(popup?.boutonLibelle ?? "");
  const [boutonLien, setBoutonLien] = useState(popup?.boutonLien ?? "");
  const [debut, setDebut] = useState(popup?.debut ?? "");
  const [fin, setFin] = useState(popup?.fin ?? "");
  const [retirerAffiche, setRetirerAffiche] = useState(false);
  const [apercuAffiche, setApercuAffiche] = useState<string | null>(null);

  // Aperçu local d'une nouvelle affiche, libéré quand il change.
  useEffect(() => {
    return () => {
      if (apercuAffiche) URL.revokeObjectURL(apercuAffiche);
    };
  }, [apercuAffiche]);

  // Ce que verra un visiteur une fois enregistré, pour éviter les surprises.
  const jour = aujourdhuiAParis();
  const diffusion = !actif
    ? { alerte: false, texte: "Pop-up désactivée : rien ne s'affiche sur le site." }
    : fin && fin < jour
      ? {
          alerte: true,
          texte: `Période terminée le ${formatDate(fin)} : la pop-up ne s'afficherait pas. Changez les dates.`,
        }
      : debut && debut > jour
        ? { alerte: false, texte: `Programmée : visible à partir du ${formatDate(debut)}.` }
        : { alerte: false, texte: "Visible sur le site dès l'enregistrement." };

  const afficheVisible =
    apercuAffiche ?? (retirerAffiche ? undefined : popup?.afficheUrl);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,540px)_minmax(0,1fr)]">
      <form action={action}>
        <AdminCard className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="actif" className="text-[15px] font-semibold text-neutral-900">
              Pop-up active
            </label>
            <label className="relative inline-flex cursor-pointer">
              <input
                id="actif"
                name="actif"
                type="checkbox"
                role="switch"
                checked={actif}
                onChange={(evenement) => setActif(evenement.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="h-6 w-11 rounded-full bg-neutral-300 transition-colors peer-checked:bg-club-800 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-club-600"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
              />
            </label>
          </div>

          <div>
            <label htmlFor="titre" className={etiquette}>
              Titre
            </label>
            <input
              id="titre"
              name="titre"
              value={titre}
              onChange={(evenement) => setTitre(evenement.target.value)}
              className={champ}
            />
          </div>

          <div>
            <label htmlFor="texte" className={etiquette}>
              Texte
            </label>
            <textarea
              id="texte"
              name="texte"
              rows={3}
              value={texte}
              onChange={(evenement) => setTexte(evenement.target.value)}
              className={champ}
            />
          </div>

          <div>
            <label htmlFor="boutonLibelle" className={etiquette}>
              Bouton
            </label>
            <input
              id="boutonLibelle"
              name="boutonLibelle"
              value={boutonLibelle}
              onChange={(evenement) => setBoutonLibelle(evenement.target.value)}
              placeholder="Réserver un stage"
              className={champ}
            />
          </div>

          <div>
            <label htmlFor="boutonLien" className={etiquette}>
              Lien
            </label>
            <input
              id="boutonLien"
              name="boutonLien"
              value={boutonLien}
              onChange={(evenement) => setBoutonLien(evenement.target.value)}
              placeholder="/academie, https://…, tel:+33442298341"
              aria-describedby="lien-aide"
              className={champ}
            />
            <p id="lien-aide" className="mt-1.5 text-xs text-neutral-500">
              Une page du site (/academie), une adresse web, ou un numéro (tel:…).
            </p>
          </div>

          <fieldset>
            <legend className={etiquette}>Période d&apos;affichage</legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label className="text-xs text-neutral-500">
                Du
                <input
                  name="debut"
                  type="date"
                  value={debut}
                  onChange={(evenement) => setDebut(evenement.target.value)}
                  className={champ}
                />
              </label>
              <label className="text-xs text-neutral-500">
                Au
                <input
                  name="fin"
                  type="date"
                  value={fin}
                  onChange={(evenement) => setFin(evenement.target.value)}
                  className={champ}
                />
              </label>
            </div>
            <p className="mt-1.5 text-xs text-neutral-500">
              Laisser vide pour afficher sans limite de dates.
            </p>
          </fieldset>

          <div>
            <label htmlFor="affiche" className={etiquette}>
              Affiche (facultatif)
            </label>
            <input
              id="affiche"
              name="affiche"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(evenement) => {
                const fichier = evenement.target.files?.[0];
                setApercuAffiche(fichier ? URL.createObjectURL(fichier) : null);
              }}
              className="mt-2 w-full rounded-lg border border-dashed border-neutral-300 px-3 py-3 text-sm text-neutral-600 file:mr-4 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm"
            />
            <p className="mt-1.5 text-xs text-neutral-500">JPEG, PNG ou WebP, 5 Mo maximum.</p>

            {popup?.afficheUrl && !apercuAffiche ? (
              <label className="mt-2 flex items-center gap-2 text-xs text-neutral-600">
                <input
                  type="checkbox"
                  name="retirerAffiche"
                  checked={retirerAffiche}
                  onChange={(evenement) => setRetirerAffiche(evenement.target.checked)}
                />
                Retirer l&apos;affiche actuelle
              </label>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={enCours}
            className="rounded-lg bg-club-950 px-5 py-3 text-sm font-semibold text-sable-50 transition-colors hover:bg-club-800 disabled:opacity-60"
          >
            {enCours ? "Enregistrement…" : "Enregistrer & publier"}
          </button>

          {etat.statut !== "vide" ? (
            <p
              role="status"
              className={
                etat.statut === "succes" ? "text-sm text-club-800" : "text-sm text-red-700"
              }
            >
              {etat.message}
            </p>
          ) : null}
        </AdminCard>
      </form>

      <div className="lg:sticky lg:top-10">
        <p className="text-xs font-semibold text-neutral-700">Aperçu sur le site</p>
        <div className="mt-2 flex min-h-[420px] items-center justify-center rounded-2xl bg-gradient-to-b from-club-800 to-club-950 p-8">
          <CartePopup
            titre={titre}
            texte={texte}
            boutonLibelle={boutonLibelle}
            boutonLien={boutonLien || "#"}
            afficheUrl={afficheVisible}
            // Aperçu inerte : ni fermeture, ni navigation.
            onAction={() => undefined}
          />
        </div>
        <p
          className={
            diffusion.alerte
              ? "mt-3 text-xs font-semibold text-red-700"
              : "mt-3 text-xs text-neutral-500"
          }
        >
          {diffusion.texte}
        </p>
      </div>
    </div>
  );
}
