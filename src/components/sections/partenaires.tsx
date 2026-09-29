import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { partenaires } from "@/config/site";

export function Partenaires() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="text-center">
          <Surtitre filet="gris" className="text-encre/60">
            Ils nous accompagnent
          </Surtitre>

          <h2 className="mt-6 font-butler text-[40px] font-medium leading-[1.1] text-club-950 sm:text-[64px]">
            Nos partenaires
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-10 lg:mt-14 lg:grid-cols-6">
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
                className="h-[60px] w-auto object-contain"
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
