import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "À propos",
  description: "Le domaine, l'équipe et le projet du golf de Château l'Arc.",
  chemin: "/a-propos",
  indexable: false,
});

export default function Page() {
  return (
    <>
      <PageHero surtitre="Le club" titre="À propos" chapo="Le domaine, l'équipe et le projet du Golf Château l'Arc." />
      <EnConstruction />
    </>
  );
}
