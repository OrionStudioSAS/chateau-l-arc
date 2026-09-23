import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "L'académie",
  description: "Cours, stages et initiation pour progresser à tout niveau.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Enseignement" titre="L'académie" chapo="Cours, stages et initiation pour progresser à tout niveau." />
      <EnConstruction />
    </>
  );
}
