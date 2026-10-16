import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Conditions générales de vente",
  description: "Conditions générales de vente du golf de Château l'Arc.",
  chemin: "/cgv",
  indexable: false,
});

export default function Page() {
  return (
    <>
      <PageHero surtitre="Informations légales" titre="Conditions générales de vente" chapo="Conditions générales de vente du Golf Château l'Arc." />
      <EnConstruction />
    </>
  );
}
