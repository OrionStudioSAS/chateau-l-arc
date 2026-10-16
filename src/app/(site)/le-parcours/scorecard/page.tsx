import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Carte de score",
  description: "Carte de score du golf de Château l'Arc : distances, pars et index par trou.",
  chemin: "/le-parcours/scorecard",
  indexable: false,
});

export default function Page() {
  return (
    <>
      <PageHero
        surtitre="Le parcours"
        titre="Scorecard"
        chapo="Distances, pars et index des 18 trous."
      />
      <EnConstruction note="La carte de parcours sera ajoutée dès réception du document du club." />
    </>
  );
}
