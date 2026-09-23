import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergeur et propriété intellectuelle.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Informations légales" titre="Mentions légales" chapo="Éditeur, hébergeur et propriété intellectuelle." />
      <EnConstruction />
    </>
  );
}
