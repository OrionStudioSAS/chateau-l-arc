import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Traitement des données personnelles et cookies.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Informations légales" titre="Politique de confidentialité" chapo="Traitement des données personnelles et cookies." />
      <EnConstruction />
    </>
  );
}
