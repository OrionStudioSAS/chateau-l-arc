"use server";

import { updateTag } from "next/cache";

import { tags } from "@/lib/api/content";
import {
  slugifier,
  type EtatCompetitionFormulaire,
} from "@/lib/admin/formulaire-competition";
import { creerClientServeur } from "@/lib/supabase/server";

type ClientServeur = Awaited<ReturnType<typeof creerClientServeur>>;

const texte = (formData: FormData, champ: string): string =>
  String(formData.get(champ) ?? "").trim();

const texteOuNull = (formData: FormData, champ: string): string | null =>
  texte(formData, champ) || null;

/**
 * Un champ `datetime-local` n'a pas de fuseau : sans cela, « 18h00 » serait
 * enregistré en UTC et reviendrait à 20h00 côté client.
 */
const isoDepuisParis = (valeurLocale: string): string => {
  const [date, heure = "00:00"] = valeurLocale.split("T");
  const reference = new Date(`${date}T${heure}:00Z`);
  const decalage =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Paris",
      timeZoneName: "longOffset",
    })
      .formatToParts(reference)
      .find((partie) => partie.type === "timeZoneName")
      ?.value.replace("GMT", "") || "+00:00";

  return `${date}T${heure}:00${decalage}`;
};

const nombreOuNull = (formData: FormData, champ: string): number | null => {
  const valeur = texte(formData, champ);
  if (!valeur) return null;
  const nombre = Number(valeur);
  return Number.isFinite(nombre) ? nombre : null;
};

/** Ajoute un suffixe tant que l'identifiant d'URL est déjà pris. */
async function slugDisponible(
  supabase: ClientServeur,
  base: string,
  idActuel: string | null,
): Promise<string> {
  let candidat = base;

  for (let suffixe = 2; suffixe < 50; suffixe += 1) {
    const { data } = await supabase
      .from("competitions")
      .select("id")
      .eq("slug", candidat)
      .maybeSingle();

    if (!data || data.id === idActuel) return candidat;
    candidat = `${base}-${suffixe}`;
  }

  return `${base}-${Date.now()}`;
}

/**
 * Crée ou met à jour une compétition, puis rafraîchit le site public.
 * Le bouton utilisé détermine le statut : publication ou brouillon.
 */
export async function enregistrerCompetition(
  _etat: EtatCompetitionFormulaire,
  formData: FormData,
): Promise<EtatCompetitionFormulaire> {
  const nom = texte(formData, "nom");
  const dateDebut = texte(formData, "dateDebut");
  const statut = texte(formData, "statut") === "publie" ? "publie" : "brouillon";
  const id = texteOuNull(formData, "id");

  if (!nom) return { statut: "erreur", message: "Le nom est obligatoire." };
  if (!dateDebut) return { statut: "erreur", message: "La date est obligatoire." };

  const supabase = await creerClientServeur();
  const { data: session } = await supabase.auth.getClaims();

  if (!session?.claims?.sub) {
    return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };
  }

  const valeurs = {
    nom,
    date_debut: dateDebut,
    date_fin: texteOuNull(formData, "dateFin"),
    formule: texte(formData, "formule") || "À préciser",
    depart: texte(formData, "depart") || "À préciser",
    trous: texte(formData, "trous") || "18 trous",
    index_maximum: texteOuNull(formData, "indexMaximum"),
    categories: texteOuNull(formData, "categories"),
    sponsor: texteOuNull(formData, "sponsor"),
    inscription_ouverture: texteOuNull(formData, "inscriptionOuverture"),
    inscription_cloture: (() => {
      const valeur = texteOuNull(formData, "inscriptionCloture");
      return valeur ? isoDepuisParis(valeur) : null;
    })(),
    places: nombreOuNull(formData, "places"),
    mode_inscription: texteOuNull(formData, "modeInscription"),
    droit_jeu_membres: texteOuNull(formData, "droitJeuMembres"),
    droit_jeu_visiteurs: texteOuNull(formData, "droitJeuVisiteurs"),
    inclus: texteOuNull(formData, "inclus"),
    description: texteOuNull(formData, "description"),
    statut,
    maj_le: new Date().toISOString(),
  };

  const slug = await slugDisponible(supabase, slugifier(nom), id);

  const { error } = id
    ? await supabase.from("competitions").update({ ...valeurs, slug }).eq("id", id)
    : await supabase.from("competitions").insert({ ...valeurs, slug });

  if (error) {
    console.error("Enregistrement de la compétition impossible", error);
    return {
      statut: "erreur",
      message: "L'enregistrement a échoué. Réessayez dans un instant.",
    };
  }

  updateTag(tags.competitions);

  return {
    statut: "succes",
    message:
      statut === "publie"
        ? "Compétition publiée sur le site."
        : "Brouillon enregistré.",
  };
}
