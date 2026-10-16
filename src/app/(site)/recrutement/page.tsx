import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Recrutement",
  description: "Les postes à pourvoir au sein du club.",
  chemin: "/recrutement",
  indexable: false,
});

export default function Page() {
  return (
    <>
      <PageHero surtitre="Nous rejoindre" titre="Recrutement" chapo="Les postes à pourvoir au sein du club." />
      <EnConstruction />
    </>
  );
}
