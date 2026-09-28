import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Scorecard",
  description:
    "Carte de parcours du Golf Château l'Arc : distances, pars et index par trou.",
};

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
