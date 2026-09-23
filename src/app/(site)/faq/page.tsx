import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Accès, réservation, conditions de jeu : les réponses aux questions courantes.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Questions fréquentes" titre="FAQ" chapo="Accès, réservation, conditions de jeu : les réponses aux questions courantes." />
      <EnConstruction />
    </>
  );
}
