import { ContainerEtroit } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { Editable } from "@/components/cms/editable";
import { questionsTarifs } from "@/lib/tarifs";
import { i18n } from "@/lib/i18n/serveur";

/**
 * Questions fréquentes, en accordéon natif (<details>) : accessible au
 * clavier et lisible sans JavaScript. `name` commun : une seule réponse
 * ouverte à la fois. La première est dépliée, comme sur la maquette.
 */
export async function QuestionsTarifs() {
  const { T, tr } = await i18n();
  const { TARIFS_QUESTIONS_SURTITRE, TARIFS_QUESTIONS_TITRE } = T;
  return (
    <section id="questions" className="scroll-mt-28 bg-white py-14 lg:py-20">
      <ContainerEtroit className="max-w-4xl">
        <Editable path="Tarifs · Questions.TARIFS_QUESTIONS_SURTITRE" as="div">
          <Surtitre aligne="gauche" className="text-or-600">
            {TARIFS_QUESTIONS_SURTITRE}
          </Surtitre>
        </Editable>
        <Editable path="Tarifs · Questions.TARIFS_QUESTIONS_TITRE" as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
          {TARIFS_QUESTIONS_TITRE}
        </Editable>

        <div className="mt-10 divide-y divide-encre/10 border-b border-encre/10">
          {questionsTarifs.map((item, index) => (
            <details key={item.question} name="questions-tarifs" open={index === 0} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-medium text-club-950 [&::-webkit-details-marker]:hidden">
                {tr(item.question)}
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full border border-encre/15 text-[15px] leading-none text-encre/60"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-encre/65">
                {tr(item.reponse)}
              </p>
            </details>
          ))}
        </div>
      </ContainerEtroit>
    </section>
  );
}
