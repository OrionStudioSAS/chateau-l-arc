import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";
import { RESTAURANT_SURTITRE, RESTAURANT_TEXTE, RESTAURANT_TITRE } from "@/constants";

export const metadata: Metadata = {
  title: "La table du golf",
  description: "Déjeuner et dîner face au parcours, au club-house du Château l'Arc.",
};

export default function Page() {
  return (
    <>
      <PageHero
        surtitre={RESTAURANT_SURTITRE}
        titre={RESTAURANT_TITRE}
        chapo={RESTAURANT_TEXTE}
        cms={{ surtitre: "Restaurant Le Club House · En-tête.RESTAURANT_SURTITRE", titre: "Restaurant Le Club House · En-tête.RESTAURANT_TITRE", chapo: "Restaurant Le Club House · En-tête.RESTAURANT_TEXTE" }}
      />
      <EnConstruction />
    </>
  );
}
