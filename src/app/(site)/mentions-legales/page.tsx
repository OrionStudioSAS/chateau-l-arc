import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";
import { MENTIONS_SURTITRE, MENTIONS_TEXTE, MENTIONS_TITRE } from "@/constants";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Mentions légales",
  description: "Éditeur, hébergeur et propriété intellectuelle.",
  chemin: "/mentions-legales",
  indexable: false,
});

export default function Page() {
  return (
    <>
      <PageHero
        surtitre={MENTIONS_SURTITRE}
        titre={MENTIONS_TITRE}
        chapo={MENTIONS_TEXTE}
        cms={{ surtitre: "Mentions légales · En-tête.MENTIONS_SURTITRE", titre: "Mentions légales · En-tête.MENTIONS_TITRE", chapo: "Mentions légales · En-tête.MENTIONS_TEXTE" }}
      />
      <EnConstruction />
    </>
  );
}
