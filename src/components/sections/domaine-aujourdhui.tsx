import Image from "next/image";
import type { Route } from "next";

import { Container } from "@/components/ui/container";
import { LienFleche } from "@/components/ui/lien-fleche";
import { Surtitre } from "@/components/ui/surtitre";

/**
 * TODO : photo de la salle de réception (voûtée) à fournir, et lien du site
 * de la SVIS ; sans lien, la carte s'affiche sans « En savoir plus ».
 */
const cartes: {
  label: string;
  titre: string;
  texte: string;
  image: string;
  href?: Route;
}[] = [
  {
    label: "Club House",
    titre: "Le château, côté golf",
    texte:
      "Grand salon, bar et terrasse panoramique sur la Sainte-Victoire, au cœur de la demeure historique.",
    image: "/images/hp-milieu-droite.png",
    href: "/restaurant",
  },
  {
    label: "Réceptions",
    titre: "Soirées & événements",
    texte: "Soirées privées, concerts, séminaires : les salons du château se privatisent.",
    image: "/images/hp-amis.png",
    href: "/groupe-privatisation",
  },
  {
    label: "Éducation",
    titre: "Sainte-Victoire International School",
    texte:
      "École bilingue avec internat, du CP à la terminale, avec un cursus sport-études golf.",
    image: "/images/hp-svis.png",
  },
];

export function DomaineAujourdhui() {
  return (
    <section className="bg-sable-100 py-14 lg:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-16">
          <div>
            <Surtitre aligne="gauche" className="text-or-600">
              Aujourd&apos;hui
            </Surtitre>
            <h2 className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
              Le domaine aujourd&apos;hui
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-encre/65">
            Golfeurs ou non, le domaine accueille toute l&apos;année : déjeuner, célébrer,
            apprendre.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
          {cartes.map((carte) => (
            <li key={carte.titre} className="flex flex-col overflow-hidden rounded-sm bg-white">
              <div className="relative aspect-[4/3]">
                <Image
                  src={carte.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-or-600">
                  {carte.label}
                </p>
                <h3 className="mt-3 font-butler text-[24px] font-medium leading-tight text-club-950">
                  {carte.titre}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-encre/60">
                  {carte.texte}
                </p>
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
