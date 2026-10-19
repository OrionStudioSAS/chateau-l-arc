import type { Metadata } from "next";

import { Banniere } from "@/components/layout/banniere";
import { AppelAdhesion } from "@/components/sections/appel-adhesion";
import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { DomaineAujourdhui } from "@/components/sections/domaine-aujourdhui";
import { FriseHistoire } from "@/components/sections/frise-histoire";
import { HistoireIntro } from "@/components/sections/histoire-intro";
import { VenirAuDomaine } from "@/components/sections/venir-au-domaine";
import { metadonnees } from "@/lib/seo";
import { i18n } from "@/lib/i18n/serveur";

export async function generateMetadata(): Promise<Metadata> {
  return metadonnees({
    titre: "Histoire du domaine",
    description: "Bâti en 1620 au pied de la Sainte-Victoire, le Château l'Arc a accueilli Bernard Buffet, Cocteau et le cinéma avant de devenir un golf en 1985.",
    chemin: "/histoire",
    image: "/og/histoire.jpg",
  });
}

export default async function Page() {
  const { T } = await i18n();
  const { HISTOIRE_BANNIERE_IMAGE, HISTOIRE_BANNIERE_TEXTE, HISTOIRE_BANNIERE_TITRE, HISTOIRE_CHIFFRES } = T;
  return (
    <>
      <Banniere
        image={HISTOIRE_BANNIERE_IMAGE}
        imageAlt="La façade du Château l'Arc, demeure du XVIIe siècle à Fuveau"
        filAriane={[{ label: "Accueil", href: "/" }, { label: "Notre histoire" }]}
        titre={HISTOIRE_BANNIERE_TITRE}
        texte={HISTOIRE_BANNIERE_TEXTE}
        cmsPaths={{
          titre: "Histoire · Bannière.HISTOIRE_BANNIERE_TITRE",
          texte: "Histoire · Bannière.HISTOIRE_BANNIERE_TEXTE",
          image: "Histoire · Bannière.HISTOIRE_BANNIERE_IMAGE",
        }}
        hauteur="min-h-[70svh]"
      />

      <ChiffresCles
        variante="bande"
        chiffres={HISTOIRE_CHIFFRES}
        cms="Histoire · Chiffres clés.HISTOIRE_CHIFFRES"
      />

      <HistoireIntro />

      <FriseHistoire />

      <DomaineAujourdhui />

      <VenirAuDomaine />

      <AppelAdhesion />
    </>
  );
}
