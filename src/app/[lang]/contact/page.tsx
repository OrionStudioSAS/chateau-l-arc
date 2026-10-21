import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { FormulaireContact } from "@/components/sections/contact/formulaire-contact";
import { AutresDemandes, CoordonneesBanniere, VenirContact } from "@/components/sections/contact/sections-contact";
import { getGrilleTarifs } from "@/lib/api/content";
import { ACADEMIE_ENSEIGNANTS } from "@/constants";
import { formulesJuniors, formulesPrestige } from "@/lib/academie";
import { metadonnees } from "@/lib/seo";
import { i18n } from "@/lib/i18n/serveur";

export async function generateMetadata(): Promise<Metadata> {
  return metadonnees({
    titre: "Contact et demandes",
    description: "Adhésion, cours de golf, séminaire ou simple question : écrivez au golf de Château l'Arc à Fuveau, l'équipe concernée vous répond directement.",
    chemin: "/contact",
  });
}

export default async function Page() {
  const { T } = await i18n();
  const { CONTACT_IMAGE, CONTACT_TEXTE, CONTACT_TITRE } = T;
  const grille = await getGrilleTarifs();

  return (
    <>
      <Banniere
        image={CONTACT_IMAGE}
        imageAlt="Le parcours du Château l'Arc face à la montagne Sainte-Victoire"
        filAriane={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
        titre={CONTACT_TITRE}
        texte={CONTACT_TEXTE}
        hauteur="min-h-[64svh]"
        encart={<CoordonneesBanniere />}
        cmsPaths={{
          titre: "Contact · Bannière.CONTACT_TITRE",
          texte: "Contact · Bannière.CONTACT_TEXTE",
          image: "Contact · Bannière.CONTACT_IMAGE",
        }}
      />
      <FormulaireContact
        offres={{
          abonnements: grille.abonnements.map(({ id, libelle, prix }) => ({ id, libelle, prix })),
          remise: grille.remiseComptant.taux,
          prestige: formulesPrestige.map(({ titre, prix, description }) => ({ titre, prix, description })),
          juniors: formulesJuniors,
          enseignants: ACADEMIE_ENSEIGNANTS.map((e) => e.nom).filter(Boolean),
        }}
      />
      <AutresDemandes />
      <VenirContact />
    </>
  );
}
