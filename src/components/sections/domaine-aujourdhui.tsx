import Image from "next/image";
import type { Route } from "next";

import { Container } from "@/components/ui/container";
import { LienFleche } from "@/components/ui/lien-fleche";
import { Surtitre } from "@/components/ui/surtitre";
import { Editable } from "@/components/cms/editable";
import { DOMAINE_CARTES, DOMAINE_SURTITRE, DOMAINE_TEXTE, DOMAINE_TITRE } from "@/constants";

const SECTION = "Histoire · Le domaine aujourd'hui";

/**
 * Textes et images dans constants.ts (éditeur visuel) ; liens ici, dans le
 * même ordre. TODO : lien du site de la SVIS (sans lien, pas de « En savoir plus »).
 */
const liens: (Route | undefined)[] = ["/restaurant", "/groupe-privatisation", undefined];
const cartes = DOMAINE_CARTES.map((carte, index) => ({ ...carte, href: liens[index] }));

export function DomaineAujourdhui() {
  return (
    <section className="bg-sable-100 py-14 lg:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-16">
          <div>
            <Editable path={`${SECTION}.DOMAINE_SURTITRE`} as="div">
              <Surtitre aligne="gauche" className="text-or-600">
                {DOMAINE_SURTITRE}
              </Surtitre>
            </Editable>
            <Editable path={`${SECTION}.DOMAINE_TITRE`} as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
              {DOMAINE_TITRE}
            </Editable>
          </div>
          <Editable path={`${SECTION}.DOMAINE_TEXTE`} as="p" className="text-[15px] leading-relaxed text-encre/65">
            {DOMAINE_TEXTE}
          </Editable>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
          {cartes.map((carte, index) => (
            <li key={index} className="flex flex-col overflow-hidden rounded-sm bg-white">
              <Editable path={`${SECTION}.DOMAINE_CARTES.${index}.image`} image as="div" className="relative aspect-[4/3]">
                <Image
                  src={carte.image}
                  alt={carte.titre}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </Editable>
              <div className="flex flex-1 flex-col p-6">
                <Editable path={`${SECTION}.DOMAINE_CARTES.${index}.label`} as="p" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-or-600">
                  {carte.label}
                </Editable>
                <Editable path={`${SECTION}.DOMAINE_CARTES.${index}.titre`} as="h3" className="mt-3 font-butler text-[24px] font-medium leading-tight text-club-950">
                  {carte.titre}
                </Editable>
                <Editable path={`${SECTION}.DOMAINE_CARTES.${index}.texte`} as="p" className="mt-3 flex-1 text-[14px] leading-relaxed text-encre/60">
                  {carte.texte}
                </Editable>
                {carte.href ? (
                  <p className="mt-5">
                    <LienFleche href={carte.href} className="text-[14px]">
                      En savoir plus
                    </LienFleche>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
