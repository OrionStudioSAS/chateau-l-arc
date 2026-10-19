import type { Metadata } from "next";
import { connection } from "next/server";

import { BandeauAdmin, type PastilleApercu } from "@/components/admin/bandeau-admin";
import { BANNER_IMAGE } from "@/constants";
import { getCompetitions } from "@/lib/api/content";
import { dernierJour } from "@/lib/bandeau";
import { lireContenu } from "@/lib/contenu/stockage";
import { aujourdhuiAParis } from "@/lib/format";
import { normaliserInstallation, optionCourante } from "@/lib/statut";

export const metadata: Metadata = {
  title: { absolute: "Bandeau d'information · Back-office" },
};

// Lecture directe du dépôt, sans cache : l'écran montre la dernière publication.
export const instant = false;

/** Installations toujours montrées dans l'aperçu. */
const ESSENTIEL = ["parcours", "voiturette", "practice", "restaurant"];

export default async function Page() {
  // Rendu à la requête : la fin automatique dépend de la date du jour.
  await connection();
  const [{ bandeau, installations }, competitions] = await Promise.all([
    lireContenu("statut"),
    getCompetitions(),
  ]);
  const aujourdhui = aujourdhuiAParis();

  // Aperçu : l'essentiel de l'état des installations (« Parcours ouvert »),
  // plus toute installation fermée.
  const pastilles: PastilleApercu[] = installations
    .map(normaliserInstallation)
    .flatMap((installation) => {
      const option = optionCourante(installation);
      if (!ESSENTIEL.includes(installation.cle) && option.ton !== "rouge") return [];
      const nom = installation.libelle.replace(/ 18 trous$/, "");
      return [{ texte: `${nom} ${option.libelle.toLowerCase()}`, ton: option.ton }];
    })
    .slice(0, 6);

  const annoncee = competitions.find((c) => c.annonceBandeau && c.etat.cle === "ouverte");

  return (
    <BandeauAdmin
      bandeau={{
        actif: bandeau.actif,
        message: bandeau.message,
        lienHref: bandeau.lien?.href ?? "",
        lienLabel: bandeau.lien?.label ?? "",
      }}
      propositions={competitions
        .filter((c) => c.etat.cle !== "terminee")
        .map((c) => ({ href: `/competitions/${c.slug}`, libelle: `Compétition ${c.nom}` }))}
      finCompetitions={Object.fromEntries(competitions.map((c) => [c.slug, dernierJour(c)]))}
      annonceEnCours={
        annoncee
          ? {
              nom: annoncee.nom,
              jusquau: (annoncee.inscriptionCloture ?? annoncee.dateDebut).slice(0, 10),
            }
          : null
      }
      pastilles={pastilles}
      image={BANNER_IMAGE}
      aujourdhui={aujourdhui}
    />
  );
}
