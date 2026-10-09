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

        <ul className="mt-8 grid grid-cols-3 items-center gap-x-6 gap-y-6 sm:gap-x-8 lg:grid-cols-7">
          {partenaires.map((partenaire) => {
            const logo = (
              <Image
                src={partenaire.logo}
                alt={partenaire.nom}
                width={200}
                height={200}
                sizes="(min-width: 1024px) 112px, 96px"
                className="h-24 w-24 max-w-full object-contain lg:h-28 lg:w-28"
              />
            );

            return (
              <li
                key={partenaire.logo}
                className="flex items-center justify-center last:col-start-2 lg:last:col-start-auto"
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
