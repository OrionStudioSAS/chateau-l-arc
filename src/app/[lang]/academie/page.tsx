import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AcademieEnseignants } from "@/components/sections/academie-enseignants";
import { AcademieIntro } from "@/components/sections/academie-intro";
import { AcademieJuniors } from "@/components/sections/academie-juniors";
import { AcademiePrestige } from "@/components/sections/academie-prestige";
import { AcademieStages } from "@/components/sections/academie-stages";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { metadonnees } from "@/lib/seo";
import { i18n } from "@/lib/i18n/serveur";

export async function generateMetadata(): Promise<Metadata> {
  return metadonnees({
    titre: "École de golf à Aix-en-Provence",
    description: "École de golf juniors dès 4 ans, cours adultes en petits groupes, stages et initiations au golf de Château l'Arc, avec des enseignants diplômés d'État.",
    chemin: "/academie",
    image: "/og/academie.jpg",
  });
}

export default async function Page() {
  const { T } = await i18n();
  const { ACADEMIE_BANNIERE_IMAGE, ACADEMIE_BANNIERE_TEXTE, ACADEMIE_BANNIERE_TITRE } = T;
  return (
    <>
      <Banniere
        image={ACADEMIE_BANNIERE_IMAGE}
        imageAlt="Fairway du golf du Château l'Arc face à la montagne Sainte-Victoire"
        filAriane={[{ label: "Accueil", href: "/" }, { label: "L'Académie" }]}
        titre={ACADEMIE_BANNIERE_TITRE}
        texte={ACADEMIE_BANNIERE_TEXTE}
        cmsPaths={{
          titre: "L'Académie · Bannière.ACADEMIE_BANNIERE_TITRE",
          texte: "L'Académie · Bannière.ACADEMIE_BANNIERE_TEXTE",
          image: "L'Académie · Bannière.ACADEMIE_BANNIERE_IMAGE",
        }}
        hauteur="min-h-[70svh]"
      />

      <AcademieIntro />

      <AcademieJuniors />

      <AcademiePrestige />

      <AcademieStages />

      <AcademieEnseignants />

      <AppelAdhesion />
    </>
  );
}
