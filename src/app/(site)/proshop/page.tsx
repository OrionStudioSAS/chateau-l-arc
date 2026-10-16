import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Proshop",
  description: "Matériel, textile et conseil personnalisé au proshop du club.",
  chemin: "/proshop",
  indexable: false,
});

export default function Page() {
  return (
    <>
      <PageHero surtitre="S'équiper" titre="Pro-shop" chapo="Matériel, textile et conseil personnalisé au pro-shop du club." />
      <EnConstruction />
    </>
  );
}
