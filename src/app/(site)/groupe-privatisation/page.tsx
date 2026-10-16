import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Séminaires et privatisation",
  description: "Séminaires, journées entreprises et privatisation du domaine.",
  chemin: "/groupe-privatisation",
  indexable: false,
});

export default function Page() {
  return (
    <>
      <PageHero surtitre="Événements" titre="Groupe & Privatisation" chapo="Séminaires, journées entreprises et privatisation du domaine." />
      <EnConstruction />
    </>
  );
}
