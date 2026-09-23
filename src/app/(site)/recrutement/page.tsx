import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Recrutement",
  description: "Les postes à pourvoir au sein du club.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Nous rejoindre" titre="Recrutement" chapo="Les postes à pourvoir au sein du club." />
      <EnConstruction />
    </>
  );
}
