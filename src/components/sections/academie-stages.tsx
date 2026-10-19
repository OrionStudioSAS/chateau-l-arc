import Image from "next/image";

import { PictoAcademie } from "@/components/sections/academie-pictos";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { Editable } from "@/components/cms/editable";
import { site } from "@/config/site";
import { stages } from "@/lib/academie";
import { i18n } from "@/lib/i18n/serveur";

export async function AcademieStages() {
  const { T, tr } = await i18n();
  const { ACADEMIE_STAGES_IMAGE, ACADEMIE_STAGES_SURTITRE, ACADEMIE_STAGES_TEXTE, ACADEMIE_STAGES_TITRE } = T;
  return (
    <section id="stages" className="scroll-mt-28 bg-sable-100 py-14 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Editable path="L'Académie · Stages & initiations.ACADEMIE_STAGES_IMAGE" image as="div" className="relative aspect-[5/4] overflow-hidden rounded-sm">
          <Image
            src={ACADEMIE_STAGES_IMAGE}
            alt={tr("Vue aérienne du domaine et du practice")}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            data-parallax="0.07"
          />
        </Editable>

        <div>
          <Editable path="L'Académie · Stages & initiations.ACADEMIE_STAGES_SURTITRE" as="div">
            <Surtitre aligne="gauche" className="text-or-600">
              {ACADEMIE_STAGES_SURTITRE}
            </Surtitre>
          </Editable>
          <Editable path="L'Académie · Stages & initiations.ACADEMIE_STAGES_TITRE" as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            {ACADEMIE_STAGES_TITRE}
          </Editable>
          <Editable path="L'Académie · Stages & initiations.ACADEMIE_STAGES_TEXTE" as="p" className="mt-5 max-w-lg text-[15px] leading-relaxed text-encre/65">
            {ACADEMIE_STAGES_TEXTE}
          </Editable>

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
                  <p className="text-[14px] font-semibold text-club-950">{tr(stage.titre)}</p>
                  <p className="mt-0.5 text-[13px] text-encre/60">{tr(stage.texte)}</p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href={site.contact.telephoneLien}
            className="mt-8 inline-flex items-center gap-2 rounded-sm border border-club-950/25 bg-white px-5 py-3.5 text-[13px] font-semibold text-club-950 transition-colors hover:bg-sable-50"
          >
            <PictoAcademie nom="telephone" />
            {tr("Nous appeler")}
          </a>
        </div>
      </Container>
    </section>
  );
}
