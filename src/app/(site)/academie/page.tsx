import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AcademieEnseignants } from "@/components/sections/academie-enseignants";
import { AcademieIntro } from "@/components/sections/academie-intro";
import { AcademieJuniors } from "@/components/sections/academie-juniors";
import { AcademiePrestige } from "@/components/sections/academie-prestige";
import { AcademieStages } from "@/components/sections/academie-stages";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";

export const metadata: Metadata = {
  title: "L'Académie",
  description:
    "École de golf juniors dès 4 ans, formules Prestige pour adultes, stages et initiations au Golf Château l'Arc, avec des enseignants diplômés d'État.",
};

export default function Page() {
  return (
    <>
      <Banniere
        image="/images/academie.png"
        filAriane={[{ label: "Accueil", href: "/" }, { label: "L'Académie" }]}
        titre="L’Académie"
        texte="Débutant ou confirmé, dès 4 ans : apprenez et progressez avec nos enseignants diplômés d'État, face à la Sainte-Victoire."
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
