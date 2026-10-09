import { ContainerEtroit } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { questionsTarifs } from "@/lib/tarifs";

/**
 * Questions fréquentes, en accordéon natif (<details>) : accessible au
 * clavier et lisible sans JavaScript. `name` commun : une seule réponse
 * ouverte à la fois. La première est dépliée, comme sur la maquette.
 */
export function QuestionsTarifs() {
  return (
    <section id="questions" className="scroll-mt-28 bg-white py-14 lg:py-20">
      <ContainerEtroit className="max-w-4xl">
        <Surtitre aligne="gauche" className="text-or-600">
          Questions fréquentes
        </Surtitre>
        <h2 className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
          Vos questions
        </h2>

        <div className="mt-10 divide-y divide-encre/10 border-b border-encre/10">
          {questionsTarifs.map((item, index) => (
            <details key={item.question} name="questions-tarifs" open={index === 0} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-medium text-club-950 [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full border border-encre/15 text-[15px] leading-none text-encre/60"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-encre/65">
                {item.reponse}
              </p>
            </details>
          ))}
        </div>
      </ContainerEtroit>
    </section>
  );
}
