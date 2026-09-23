import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Informations sur le parcours",
  description: "État du parcours, greens d'hiver, voiturettes et practice : les informations pratiques du jour.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Conditions du jour" titre="Informations sur le parcours" chapo="État du parcours, greens d'hiver, voiturettes et practice : les informations pratiques du jour." />
      <EnConstruction />
    </>
  );
}
