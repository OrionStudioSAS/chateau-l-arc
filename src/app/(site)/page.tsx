import Image from "next/image";

import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { CompetitionsApercu } from "@/components/sections/competitions-apercu";
import { ParcoursSignature } from "@/components/sections/parcours-signature";
import { Presentation } from "@/components/sections/presentation";
import { TarifsApercu } from "@/components/sections/tarifs-apercu";
import { site } from "@/config/site";

export default function Page() {
  return (
    <>
      {/* -mt-20 : la bannière remonte sous l'en-tête transparent (h-20). */}
      <section className="relative -mt-20 flex min-h-[80vh] flex-col justify-end bg-club-950 text-white">
        <Image
          src="/images/banner.jpg"
          alt=""
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover"
        />
        {/* Voile uniforme, puis dégradé plus dense en bas pour détacher le titre. */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        />

        <div className="@container relative w-full px-6 pb-4">
          <p className="text-[20px] font-medium uppercase tracking-[-0.2px] text-white/70">
            {site.heroAccroche}
          </p>
          {/* Taille exprimée en cqw : le titre occupe toute la largeur disponible
              quelle que soit celle de l'écran. Valeur calée sur les métriques de
              la serif de repli — à réajuster une fois Butler installée. */}
          <h1 className="mt-5 whitespace-nowrap font-butler text-[11cqw] font-bold uppercase leading-[0.86] tracking-[2px] text-white/70">
            Chateau l’Arc
          </h1>
        </div>
      </section>

      <ChiffresCles />

      <Presentation />

      <TarifsApercu />

      <ParcoursSignature />

      <CompetitionsApercu />
    </>
  );
}
