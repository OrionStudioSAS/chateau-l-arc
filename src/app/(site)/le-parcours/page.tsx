import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { ExplorerParcours } from "@/components/sections/explorer-parcours";
import { InfosPratiques } from "@/components/sections/infos-pratiques";
import { ParcoursDescription } from "@/components/sections/parcours-description";
import { ReperesDepart } from "@/components/sections/reperes-depart";
import { ZoneEntrainement } from "@/components/sections/zone-entrainement";
import { PARCOURS_PAGE_BANNIERE_ACCROCHE, PARCOURS_PAGE_BANNIERE_IMAGE, PARCOURS_PAGE_BANNIERE_TEXTE, PARCOURS_PAGE_BANNIERE_TITRE, PARCOURS_PAGE_CHIFFRES } from "@/constants";

export const metadata: Metadata = {
  title: "Le parcours",
  description:
    "18 trous entre pins et garrigue, face à la montagne Sainte-Victoire : le parcours du Golf Château l'Arc, dessiné par Robert Trent Jones II.",
};

export default function Page() {
  return (
    <>
      <Banniere
        image={PARCOURS_PAGE_BANNIERE_IMAGE}
        filAriane={[{ label: "Accueil", href: "/" }, { label: "Parcours" }]}
        accroche={PARCOURS_PAGE_BANNIERE_ACCROCHE}
        titre={PARCOURS_PAGE_BANNIERE_TITRE}
        texte={PARCOURS_PAGE_BANNIERE_TEXTE}
        cmsPaths={{
          accroche: "Le parcours · Bannière.PARCOURS_PAGE_BANNIERE_ACCROCHE",
          titre: "Le parcours · Bannière.PARCOURS_PAGE_BANNIERE_TITRE",
          texte: "Le parcours · Bannière.PARCOURS_PAGE_BANNIERE_TEXTE",
          image: "Le parcours · Bannière.PARCOURS_PAGE_BANNIERE_IMAGE",
        }}
      />

      <ChiffresCles
        variante="bande"
        chiffres={PARCOURS_PAGE_CHIFFRES}
        cms="Le parcours · Chiffres clés.PARCOURS_PAGE_CHIFFRES"
      />

      <ParcoursDescription />

      <ReperesDepart />

      <ExplorerParcours />

      <ZoneEntrainement />

      <InfosPratiques />

      {/* Emplacement du widget Instagram (intégré par Orion). */}

      <AppelAdhesion />
    </>
  );
}
