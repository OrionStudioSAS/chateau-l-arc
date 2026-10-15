import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AcademieEnseignants } from "@/components/sections/academie-enseignants";
import { AcademieIntro } from "@/components/sections/academie-intro";
import { AcademieJuniors } from "@/components/sections/academie-juniors";
import { AcademiePrestige } from "@/components/sections/academie-prestige";
import { AcademieStages } from "@/components/sections/academie-stages";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { ACADEMIE_BANNIERE_IMAGE, ACADEMIE_BANNIERE_TEXTE, ACADEMIE_BANNIERE_TITRE } from "@/constants";

export const metadata: Metadata = {
  title: "L'Académie",
  description:
    "École de golf juniors dès 4 ans, formules Prestige pour adultes, stages et initiations au Golf Château l'Arc, avec des enseignants diplômés d'État.",
};

export default function Page() {
  return (
    <>
      <Banniere
        image={ACADEMIE_BANNIERE_IMAGE}
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
