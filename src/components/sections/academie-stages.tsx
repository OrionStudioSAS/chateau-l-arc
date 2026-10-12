import Image from "next/image";

import { PictoAcademie } from "@/components/sections/academie-pictos";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { site } from "@/config/site";
import { stages } from "@/lib/academie";

export function AcademieStages() {
  return (
    <section id="stages" className="scroll-mt-28 bg-sable-100 py-14 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="relative aspect-[5/4] overflow-hidden rounded-sm">
          <Image
            src="/images/hp-milieu-droite.png"
            alt="Vue aérienne du domaine et du practice"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            data-parallax="0.07"
          />
        </div>

        <div>
          <Surtitre aligne="gauche" className="text-or-600">
            Stages &amp; initiations
          </Surtitre>
          <h2 className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            De 2 à 30 personnes
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-encre/65">
            Toute l&apos;année, entre amis, en famille ou entre collègues : réservez en
            ligne ou par téléphone.
          </p>

          <ul className="mt-6 space-y-4">
            {stages.map((stage) => (
              <li key={stage.titre} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-[12px] text-club-950"
                >
                  ✓
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-club-950">{stage.titre}</p>
                  <p className="mt-0.5 text-[13px] text-encre/60">{stage.texte}</p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href={site.contact.telephoneLien}
            className="mt-8 inline-flex items-center gap-2 rounded-sm border border-club-950/25 bg-white px-5 py-3.5 text-[13px] font-semibold text-club-950 transition-colors hover:bg-sable-50"
          >
            <PictoAcademie nom="telephone" />
            Nous appeler
          </a>
        </div>
      </Container>
    </section>
  );
}
