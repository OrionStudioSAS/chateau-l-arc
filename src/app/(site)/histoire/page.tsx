import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { EnConstruction } from "@/components/sections/en-construction";

export const metadata: Metadata = {
  title: "Histoire",
  description:
    "Le domaine, le château et le club-house : l'histoire du Golf Château l'Arc.",
};

export default function Page() {
  return (
    <>
      <PageHero
        surtitre="Le domaine"
        titre="Histoire"
        chapo="Le domaine, le château et le club-house : l'histoire du Golf Château l'Arc."
      />
      <EnConstruction />
    </>
  );
}
