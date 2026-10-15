import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";
import { MEMBRE_SURTITRE, MEMBRE_TEXTE, MEMBRE_TITRE } from "@/constants";

export const metadata: Metadata = {
  title: "Devenir membre",
  description: "Formules d'abonnement, avantages et démarche d'adhésion au club.",
};

export default function Page() {
  return (
    <>
      <PageHero
        surtitre={MEMBRE_SURTITRE}
        titre={MEMBRE_TITRE}
        chapo={MEMBRE_TEXTE}
        cms={{ surtitre: "Devenir membre · En-tête.MEMBRE_SURTITRE", titre: "Devenir membre · En-tête.MEMBRE_TITRE", chapo: "Devenir membre · En-tête.MEMBRE_TEXTE" }}
      />
      <EnConstruction />
    </>
  );
}
