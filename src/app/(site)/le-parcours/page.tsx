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
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Parcours 18 trous près d'Aix",
  description: "Le parcours 18 trous par 70 (5 817 m) dessiné par Robert Trent Jones II à Fuveau : trou par trou, repères de départ, practice et infos pratiques.",
  chemin: "/le-parcours",
  image: "/og/parcours.jpg",
});

export default function Page() {
  return (
    <>
      <Banniere
        image={PARCOURS_PAGE_BANNIERE_IMAGE}
        imageAlt="Le parcours 18 trous du Château l'Arc, entre pins et garrigue"
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
