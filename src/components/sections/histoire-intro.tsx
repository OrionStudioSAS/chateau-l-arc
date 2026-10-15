import { Editable } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import {
  HISTOIRE_INTRO_CITATION,
  HISTOIRE_INTRO_PARAGRAPHES,
  HISTOIRE_INTRO_SURTITRE,
} from "@/constants";

const SECTION = "Histoire · Le domaine";

/** « Le domaine » : citation à gauche, présentation à droite. */
export function HistoireIntro() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container className="grid gap-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <Editable path={`${SECTION}.HISTOIRE_INTRO_SURTITRE`} as="div">
            <Surtitre aligne="gauche" className="text-or-600">
              {HISTOIRE_INTRO_SURTITRE}
            </Surtitre>
          </Editable>
          <Editable
            path={`${SECTION}.HISTOIRE_INTRO_CITATION`}
            as="blockquote"
            className="mt-6 font-butler text-[26px] font-medium italic leading-[1.3] text-club-950 sm:text-[32px]"
          >
            {HISTOIRE_INTRO_CITATION}
          </Editable>
        </div>

        <div className="space-y-5 text-[15px] leading-relaxed text-encre/70 lg:pt-10">
          {HISTOIRE_INTRO_PARAGRAPHES.map((paragraphe, index) => (
            <Editable key={index} path={`${SECTION}.HISTOIRE_INTRO_PARAGRAPHES.${index}`} as="p">
              {paragraphe}
            </Editable>
          ))}
        </div>
      </Container>
    </section>
  );
}
