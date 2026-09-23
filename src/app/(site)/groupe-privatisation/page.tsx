import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Groupe & Privatisation",
  description: "Séminaires, journées entreprises et privatisation du domaine.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Événements" titre="Groupe & Privatisation" chapo="Séminaires, journées entreprises et privatisation du domaine." />
      <EnConstruction />
    </>
  );
}
