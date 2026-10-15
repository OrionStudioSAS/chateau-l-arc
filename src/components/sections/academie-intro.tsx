import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { Editable } from "@/components/cms/editable";
import { ACADEMIE_INTRO_CARTES, ACADEMIE_INTRO_SURTITRE, ACADEMIE_INTRO_TEXTE, ACADEMIE_INTRO_TITRE } from "@/constants";

import { PictoAcademie, type NomPicto } from "@/components/sections/academie-pictos";

const SECTION = "L'Académie · Une école pour chaque golfeur";

/** Textes dans constants.ts (éditeur visuel) ; ancres et pictos ici, dans le même ordre. */
const cibles: { ancre: string; picto: NomPicto }[] = [
  { ancre: "juniors", picto: "juniors" },
  { ancre: "prestige", picto: "adultes" },
  { ancre: "stages", picto: "groupe" },
];
const parcours = ACADEMIE_INTRO_CARTES.map((carte, index) => ({ ...carte, ...(cibles[index] ?? cibles[0]) }));

/** « Une école pour chaque golfeur » : trois portes d'entrée vers les sections. */
export function AcademieIntro() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-16">
          <div>
            <Editable path="L'Académie · Une école pour chaque golfeur.ACADEMIE_INTRO_SURTITRE" as="div">
              <Surtitre aligne="gauche" className="text-or-600">
                {ACADEMIE_INTRO_SURTITRE}
              </Surtitre>
            </Editable>
            <Editable path="L'Académie · Une école pour chaque golfeur.ACADEMIE_INTRO_TITRE" as="h2" className="mt-5 max-w-xl font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
              {ACADEMIE_INTRO_TITRE}
            </Editable>
          </div>
          <Editable path={`${SECTION}.ACADEMIE_INTRO_TEXTE`} as="p" className="text-[15px] leading-relaxed text-encre/65">
            {ACADEMIE_INTRO_TEXTE}
          </Editable>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
          {parcours.map((carte, index) => (
            <li key={index} className="flex flex-col rounded-sm border border-encre/10 p-7">
              <span className="flex size-11 items-center justify-center rounded-full bg-sable-100 text-club-950">
                <PictoAcademie nom={carte.picto} className="size-5" />
              </span>
              <Editable path={`${SECTION}.ACADEMIE_INTRO_CARTES.${index}.label`} as="p" className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-or-600">
                {carte.label}
              </Editable>
              <Editable path={`${SECTION}.ACADEMIE_INTRO_CARTES.${index}.titre`} as="h3" className="mt-2 font-butler text-[24px] font-medium leading-tight text-club-950">
                {carte.titre}
              </Editable>
              <Editable path={`${SECTION}.ACADEMIE_INTRO_CARTES.${index}.texte`} as="p" className="mt-3 flex-1 text-[14px] leading-relaxed text-encre/60">{carte.texte}</Editable>
              <a
                href={`#${carte.ancre}`}
                className="mt-6 text-[14px] font-semibold text-club-950 underline-offset-4 hover:underline"
              >
                <Editable path={`${SECTION}.ACADEMIE_INTRO_CARTES.${index}.lien`}>{carte.lien}</Editable> <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
