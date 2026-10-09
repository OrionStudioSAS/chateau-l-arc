import Image from "next/image";
import type { Route } from "next";

import { Container } from "@/components/ui/container";
import { LienFleche } from "@/components/ui/lien-fleche";
import { Surtitre } from "@/components/ui/surtitre";
import { headerActions } from "@/config/site";
import { estPagePubliqueVisible } from "@/config/visibilite";

type Picto = "drapeau" | "membres" | "academie";

const parcours: {
  titre: string;
  texte: string;
  prix: string;
  lien: { label: string; href: Route };
  image: string;
  picto: Picto;
}[] = [
  {
    titre: "Jouer une partie",
    texte: "18 trous ou 9 trous, réservation en ligne en deux minutes. Voiturette sur demande.",
    prix: "Dès 45 €",
    lien: { label: "Réserver un départ", href: headerActions.reservation.href },
    image: "/images/hp-jouer.png",
    picto: "drapeau",
  },
  {
    titre: "Rejoindre le club",
    texte: "Accès illimité au parcours, compétitions, practice et vie du club toute l'année.",
    prix: "Dès 540 € / an",
    lien: { label: "Voir les abonnements", href: "/tarifs" },
    image: "/images/hp-join.png",
    picto: "membres",
  },
  {
    titre: "L'Académie",
    texte: "Cours individuels, stages enfants et adultes, préparation à la carte verte.",
    prix: "Cours & stages toute l'année",
    lien: { label: "Découvrir l'Académie", href: "/academie" },
    image: "/images/hp-academie.png",
    picto: "academie",
  },
];

function Pictogramme({ nom }: { nom: Picto }) {
  const chemins: Record<Picto, React.ReactNode> = {
    drapeau: <path d="M6 21V4m0 0h11l-2 4 2 4H6" />,
    membres: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6m2 9a6 6 0 0 0-3-5.2" />
      </>
    ),
    academie: <path d="M2 9l10-5 10 5-10 5L2 9Zm4 2.5V16c2 2 10 2 12 0v-4.5M22 9v6" />,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {chemins[nom]}
    </svg>
  );
}

export function ProfiterDuGolf() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-16">
          <div>
            <Surtitre aligne="gauche" className="text-or-600">
              Bienvenue
            </Surtitre>
            <h2 className="mt-5 max-w-xl font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
              Comment souhaitez-vous profiter du golf&nbsp;?
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-encre/65">
            Joueur de passage, futur membre ou débutant : chaque golfeur trouve sa place au
            golf de Château l&apos;Arc.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
          {parcours.map((carte) => (
            <li
              key={carte.titre}
              className="flex flex-col overflow-hidden rounded-sm border border-encre/10 bg-white"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={carte.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-white text-club-950 shadow-sm">
                  <Pictogramme nom={carte.picto} />
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-butler text-[24px] font-medium leading-tight text-club-950">
                  {carte.titre}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-encre/60">
                  {carte.texte}
                </p>
                <p className="mt-5 font-butler text-[18px] text-encre/85">{carte.prix}</p>
                {estPagePubliqueVisible(carte.lien.href) && (
                  <p className="mt-4">
                    <LienFleche href={carte.lien.href} className="text-[14px]">
                      {carte.lien.label}
                    </LienFleche>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
