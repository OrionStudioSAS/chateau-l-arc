import Image from "next/image";
import { Lien as Link } from "@/components/ui/lien";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { Editable } from "@/components/cms/editable";
import { atoutsJuniors, formulesJuniors, noteJuniors } from "@/lib/academie";

import { PictoAcademie } from "@/components/sections/academie-pictos";
import { i18n } from "@/lib/i18n/serveur";

export async function AcademieJuniors() {
  const { T, tr, euros } = await i18n();
  const { ACADEMIE_JUNIORS_IMAGE, ACADEMIE_JUNIORS_SURTITRE, ACADEMIE_JUNIORS_TITRE } = T;
  return (
    <section id="juniors" className="scroll-mt-28 bg-sable-100 py-14 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Editable path="L'Académie · École juniors.ACADEMIE_JUNIORS_SURTITRE" as="div">
            <Surtitre aligne="gauche" className="text-or-600">
              {ACADEMIE_JUNIORS_SURTITRE}
            </Surtitre>
          </Editable>
          <Editable path="L'Académie · École juniors.ACADEMIE_JUNIORS_TITRE" as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            {ACADEMIE_JUNIORS_TITRE}
          </Editable>

          <ul className="mt-6 flex max-w-md flex-wrap gap-2.5">
            {atoutsJuniors.map((atout) => (
              <li
                key={atout.libelle}
                className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12px] font-medium text-club-950"
              >
                <PictoAcademie nom={atout.picto} className="size-3.5 text-encre/60" />
                {tr(atout.libelle)}
              </li>
            ))}
          </ul>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {formulesJuniors.map((formule) => (
              <li key={formule.titre} className="flex flex-col rounded-sm bg-white p-6 lg:p-7">
                <h3 className="font-butler text-[24px] font-medium text-club-950">{tr(formule.titre)}</h3>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="font-butler text-[40px] font-medium leading-none text-club-950">
                    {euros(formule.prix)}
                  </span>
                  <span className="text-[13px] text-encre/50">{tr("/ an")}</span>
                </p>
                <p className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-club-950">
                  <PictoAcademie nom="horloge" className="size-3.5 text-or-600" />
                  {tr(formule.rythme)}
                </p>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-encre/60">
                  {tr(formule.description)}
                </p>
                <Link
                  href="/contact"
                  className="mt-6 flex items-center justify-center gap-2 rounded-sm bg-club-950 px-5 py-3 text-[13px] font-semibold text-sable-50 transition-colors hover:bg-club-800"
                >
                  Inscrire mon enfant <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-5 flex items-start gap-2 text-[12px] text-encre/55">
            <PictoAcademie nom="info" className="mt-px size-3.5 text-or-600" />
            {tr(noteJuniors)}
          </p>
        </div>

        <Editable path="L'Académie · École juniors.ACADEMIE_JUNIORS_IMAGE" image as="div" className="relative min-h-[320px] overflow-hidden rounded-sm lg:min-h-0">
          <Image
            src={ACADEMIE_JUNIORS_IMAGE}
            alt={tr("Seau de balles au practice, face à la Sainte-Victoire")}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </Editable>
      </Container>
    </section>
  );
}
