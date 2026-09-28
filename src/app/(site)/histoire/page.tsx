import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { FriseHistoire } from "@/components/sections/frise-histoire";
import { HistoireDomaine } from "@/components/sections/histoire-domaine";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "Le domaine, le château et le club : l'histoire du Golf Château l'Arc, un lieu pensé pour tous les passionnés de golf.",
};

export default function Page() {
  return (
    <>
      <Banniere
        image="/images/notre-histoire.png"
        accroche="Un lieu pensé pour tous les passionnés de golf"
        titre={"Notre\nHistoire"}
        retourLigne
        // Titre sur deux lignes : taille et interligne recalibrés en conséquence.
        tailleTitre="text-[10.2cqw]"
        interligneTitre="leading-[0.95]"
      />

      <HistoireDomaine />

      <FriseHistoire />
    </>
  );
}
