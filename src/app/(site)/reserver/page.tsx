import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Réserver un départ",
  description: "Réservation d'un départ sur le parcours 18 trous.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Green-fees" titre="Réserver un départ" chapo="Réservation d'un départ sur le parcours 18 trous." />
      <EnConstruction />
    </>
  );
}
