import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";
import { MEMBRE_SURTITRE, MEMBRE_TEXTE, MEMBRE_TITRE } from "@/constants";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Devenir membre",
  description: "Formules d'abonnement, avantages et démarche d'adhésion au club.",
  chemin: "/devenir-membre",
  indexable: false,
});

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
