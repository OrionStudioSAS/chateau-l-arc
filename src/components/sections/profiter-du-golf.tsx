import Image from "next/image";

import { Editable } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";
import { LienFleche } from "@/components/ui/lien-fleche";
import { Surtitre } from "@/components/ui/surtitre";
import { headerActions } from "@/config/site";
import { estPagePubliqueVisible } from "@/config/visibilite";
import { i18n } from "@/lib/i18n/serveur";

type Picto = "drapeau" | "membres" | "academie";

/** Textes et images dans constants.ts (éditeur visuel) ; liens et pictos ici, dans le même ordre. */
const destinations: { href: string; picto: Picto }[] = [
  { href: headerActions.reservation.href, picto: "drapeau" },
  { href: "/tarifs", picto: "membres" },
  { href: "/academie", picto: "academie" },
];


const CHEMIN = "Accueil · Bienvenue.PROFITER_CARTES";

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

export async function ProfiterDuGolf() {
  const { T } = await i18n();
  const { PROFITER_SURTITRE, PROFITER_TITRE, PROFITER_DESCRIPTION, PROFITER_CARTES } = T;
  const parcours = PROFITER_CARTES.map((carte, index) => ({
    ...carte,
    ...destinations[index],
    lien: { label: carte.lien, href: destinations[index]?.href ?? "/" },
  }));
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-16">
          <div>
            <Editable path="Accueil · Bienvenue.PROFITER_SURTITRE" as="div">
              <Surtitre aligne="gauche" className="text-or-600">
                {PROFITER_SURTITRE}
              </Surtitre>
            </Editable>
            <Editable path="Accueil · Bienvenue.PROFITER_TITRE" as="h2" className="mt-5 max-w-xl font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
              {PROFITER_TITRE}
            </Editable>
          </div>
          <Editable path="Accueil · Bienvenue.PROFITER_DESCRIPTION" as="p" className="text-[15px] leading-relaxed text-encre/65">
            {PROFITER_DESCRIPTION}
          </Editable>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
          {parcours.map((carte, index) => (
            <li
              key={carte.titre}
              className="flex flex-col overflow-hidden rounded-sm border border-encre/10 bg-white"
            >
              <Editable path={`${CHEMIN}.${index}.image`} image as="div" className="relative aspect-[16/10]">
                <Image
                  src={carte.image}
                  alt={carte.titre}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-white text-club-950 shadow-sm">
                  <Pictogramme nom={carte.picto} />
                </span>
              </Editable>

              <div className="flex flex-1 flex-col p-6">
                <Editable path={`${CHEMIN}.${index}.titre`} as="h3" className="font-butler text-[24px] font-medium leading-tight text-club-950">
                  {carte.titre}
                </Editable>
                <Editable path={`${CHEMIN}.${index}.texte`} as="p" className="mt-3 flex-1 text-[14px] leading-relaxed text-encre/60">
                  {carte.texte}
                </Editable>
                <Editable path={`${CHEMIN}.${index}.prix`} as="p" className="mt-5 font-butler text-[18px] text-encre/85">{carte.prix}</Editable>
                {estPagePubliqueVisible(carte.lien.href) && (
                  <p className="mt-4">
                    <LienFleche href={carte.lien.href} className="text-[14px]">
                      <Editable path={`${CHEMIN}.${index}.lien`}>{carte.lien.label}</Editable>
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
