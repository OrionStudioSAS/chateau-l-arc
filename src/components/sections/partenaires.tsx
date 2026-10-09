import Image from "next/image";

import { Container } from "@/components/ui/container";
import { partenaires } from "@/config/site";

export function Partenaires() {
  return (
    <section className="border-t border-encre/10 bg-white py-12 lg:py-14">
      <Container>
        {/* Bandeau discret : un simple intitulé au-dessus d'une rangée de logos. */}
        <h2 className="text-center text-[11px] font-normal uppercase tracking-[0.2em] text-encre/50">
          Ils accompagnent le club
        </h2>

        <ul className="mt-8 grid grid-cols-3 items-center gap-x-6 gap-y-6 sm:gap-x-8 lg:grid-cols-6">
          {partenaires.map((partenaire, index) => {
            const logo = (
              <Image
                src={partenaire.logo}
                alt={partenaire.nom}
                width={160}
                height={60}
                // Le visuel d'attente est un SVG : l'optimiseur d'images ne le
                // traite pas, on le sert tel quel.
                unoptimized
                className="h-[44px] w-auto object-contain lg:h-[52px]"
              />
            );

            return (
              <li
                key={`${partenaire.nom}-${index}`}
                className="flex items-center justify-center"
              >
                {partenaire.url ? (
                  <a
                    href={partenaire.url}
                    rel="noreferrer noopener"
                    target="_blank"
                    className="transition-opacity hover:opacity-70"
                  >
                    {logo}
                  </a>
                ) : (
                  logo
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
