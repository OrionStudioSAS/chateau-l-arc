import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Devenir membre",
  description: "Formules d'abonnement, avantages et démarche d'adhésion au club.",
};

export default function Page() {
  return (
    <>
      <PageHero surtitre="Abonnements" titre="Devenir membre" chapo="Formules d'abonnement, avantages et démarche d'adhésion au club." />
      <EnConstruction />
    </>
  );
}
