import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Le parcours",
  description: "Trou par trou, les distances, les pars et les points de repère du parcours.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="18 trous" titre="Le parcours" chapo="Trou par trou, les distances, les pars et les points de repère du parcours." />
      <EnConstruction />
    </>
  );
}
