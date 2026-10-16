import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Politique de confidentialité",
  description: "Traitement des données personnelles et cookies.",
  chemin: "/politique-de-confidentialite",
  indexable: false,
});

export default function Page() {
  return (
    <>
      <PageHero surtitre="Informations légales" titre="Politique de confidentialité" chapo="Traitement des données personnelles et cookies." />
      <EnConstruction />
    </>
  );
}
