
import { Banniere } from "@/components/layout/banniere";
import { ArtDeVivre } from "@/components/sections/art-de-vivre";
import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { CompetitionsApercu } from "@/components/sections/competitions-apercu";
import { Partenaires } from "@/components/sections/partenaires";
import { ParcoursSignature } from "@/components/sections/parcours-signature";
import { Presentation } from "@/components/sections/presentation";
import { TarifsApercu } from "@/components/sections/tarifs-apercu";
import { site } from "@/config/site";

export default function Page() {
  return (
    <>
      <Banniere
        image="/images/banner.jpg"
        accroche={site.heroAccroche}
        titre="Chateau l’Arc"
      />

      <ChiffresCles />

      <Presentation />

      <TarifsApercu />

      <ParcoursSignature />

      <CompetitionsApercu />

      <ArtDeVivre />

      <Partenaires />
    </>
  );
}
