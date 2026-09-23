import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente du Golf Château l'Arc.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Informations légales" titre="Conditions générales de vente" chapo="Conditions générales de vente du Golf Château l'Arc." />
      <EnConstruction />
    </>
  );
}
