import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";

/** « Le domaine » : citation à gauche, présentation à droite. */
export function HistoireIntro() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container className="grid gap-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <Surtitre aligne="gauche" className="text-or-600">
            Le domaine
          </Surtitre>
          <blockquote className="mt-6 font-butler text-[26px] font-medium italic leading-[1.3] text-club-950 sm:text-[32px]">
            « Bâti en 1620 par la famille d&apos;Agoult, le Château l&apos;Arc est le cœur
            d&apos;un domaine de plus de cent hectares, face à la Sainte-Victoire. »
          </blockquote>
        </div>

        <div className="space-y-5 text-[15px] leading-relaxed text-encre/70 lg:pt-10">
          <p>
            Aux portes d&apos;Aix-en-Provence et de Marseille, le domaine accueille ses
            visiteurs dans un cadre exceptionnel. La demeure abrite aujourd&apos;hui le Club
            House du golf : grand salon, bar et grande terrasse avec vue panoramique sur la
            Sainte-Victoire.
          </p>
          <p>
            Autour du château s&apos;enroule le parcours 18 trous dessiné par Robert Trent
            Jones II, et le domaine vit toute l&apos;année : restaurant, réceptions, soirées
            privées, concerts et une école internationale.
          </p>
        </div>
      </Container>
    </section>
  );
}
