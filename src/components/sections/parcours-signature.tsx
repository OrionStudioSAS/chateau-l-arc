import Image from "next/image";

import { BoutonOr } from "@/components/ui/bouton-or";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";

/** TODO : image temporaire, à remplacer par la photo du parcours. */
const IMAGE_PROVISOIRE = "/images/banner.jpg";

const statistiques = [
  { label: "Longueur", valeur: "5 817 m" },
  { label: "Par", valeur: "70" },
  { label: "Trous", valeur: "18" },
  { label: "Année de création", valeur: "1985" },
];

export function ParcoursSignature() {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-encre/60">Golf</Surtitre>

          <h2 className="mt-6 font-butler text-[40px] font-medium leading-[1.1] text-encre sm:text-[64px]">
            Un parcours signé
            <br />
            Robert Trent Jones II
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] font-normal leading-relaxed text-encre/70">
            Dessiné en 1985 par l&apos;un des plus grands architectes de golf au monde, ce
            par 70 de 5&nbsp;817 mètres propose une expérience variée dans les valeurs du
            style américain.
          </p>
        </div>

        <div className="relative mt-14 overflow-hidden">
          <Image
            src={IMAGE_PROVISOIRE}
            alt=""
            fill
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="object-cover"
          />
          {/* Voile uniforme + dégradé latéral : le texte occupe la moitié gauche. */}
          <div aria-hidden="true" className="absolute inset-0 bg-black/35" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent"
          />

          <div className="relative flex min-h-[600px] flex-col justify-end p-8 text-white sm:p-12">
            <h3 className="max-w-lg font-butler text-[32px] font-medium leading-[1.15] tracking-[-0.5px] sm:text-[48px]">
              Entre pins et garrigue, face à la Sainte-Victoire
            </h3>

            <dl className="mt-8 flex w-fit flex-wrap gap-x-8 gap-y-4 border-y border-white/30 py-4">
              {statistiques.map((statistique) => (
                <div key={statistique.label}>
                  <dt className="text-[12px] font-normal uppercase tracking-[0.12em] text-white/75">
                    {statistique.label}
                  </dt>
                  <dd className="mt-1 font-butler text-[28px] font-normal">
                    {statistique.valeur}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 max-w-md text-[18px] font-normal leading-relaxed text-white/85">
              Créé en 1985, le parcours serpente entre pins et garrigue dans un
              environnement d&apos;exception, avec une vue fantastique sur la montagne
              Sainte-Victoire chère à Cézanne.
            </p>

            <BoutonOr href="/le-parcours" className="mt-8 w-fit">
              Explorer le parcours <span aria-hidden="true">→</span>
            </BoutonOr>
          </div>
        </div>
      </Container>
    </section>
  );
}
