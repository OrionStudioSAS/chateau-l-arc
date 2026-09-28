import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Pro-shop",
  description: "Matériel, textile et conseil personnalisé au pro-shop du club.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="S'équiper" titre="Pro-shop" chapo="Matériel, textile et conseil personnalisé au pro-shop du club." />
      <EnConstruction />
    </>
  );
}
