import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "À propos",
  description: "Le domaine, l'équipe et le projet du Golf Château l'Arc.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Le club" titre="À propos" chapo="Le domaine, l'équipe et le projet du Golf Château l'Arc." />
      <EnConstruction />
    </>
  );
}
