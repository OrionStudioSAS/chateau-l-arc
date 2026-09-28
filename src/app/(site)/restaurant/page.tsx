import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "La table du golf",
  description: "Déjeuner et dîner face au parcours, au club-house du Château l'Arc.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Restaurant" titre="La table du golf" chapo="Déjeuner et dîner face au parcours, au club-house du Château l'Arc." />
      <EnConstruction />
    </>
  );
}
