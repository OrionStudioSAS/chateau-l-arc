import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { Editable } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { ART_DE_VIVRE_CARTES, ART_DE_VIVRE_SURTITRE, ART_DE_VIVRE_TITRE, ART_DE_VIVRE_DESCRIPTION } from "@/constants";
import { estPagePubliqueVisible } from "@/config/visibilite";
import { cn } from "@/lib/cn";

type Carte = {
  label: string;
  titre: string;
  href?: Route;
  image: string;
  /** Position dans la mosaïque, à partir de 1024 px. */
  grille: string;
  /** Titre agrandi sur la carte principale. */
  large?: boolean;
};

/** Textes et images dans constants.ts (éditeur visuel) ; liens et mise en page ici, dans le même ordre. */
const dispositions: Omit<Carte, "label" | "titre" | "image">[] = [
  { href: "/restaurant", grille: "lg:col-span-7 lg:row-span-2", large: true },
  { href: "/academie", grille: "lg:col-span-5" },
  // TODO : destination à fournir (site de l'école, probablement externe).
  { grille: "lg:col-span-5" },
  { href: "/proshop", grille: "lg:col-span-6" },
  { href: "/competitions", grille: "lg:col-span-6" },
];

const cartes: Carte[] = ART_DE_VIVRE_CARTES.map((carte, index) => ({
  ...carte,
  ...(dispositions[index] ?? { grille: "lg:col-span-6" }),
}));

const CHEMIN = "Accueil · Art de vivre.ART_DE_VIVRE_CARTES";

function ContenuCarte({ carte, index }: { carte: Carte; index: number }) {
  return (
    <>
      <Editable path={`${CHEMIN}.${index}.image`} image as="div" className="absolute inset-0">
      <Image
        src={carte.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 85vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      </Editable>
      {/* Dégradé bas : le texte reste lisible quelle que soit la photo, y
          compris sur les petites cartes où le bloc de texte remonte haut. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/5"
      />

      <div className="relative mt-auto p-5 sm:p-8">
        <Editable path={`${CHEMIN}.${index}.label`} as="p" className="text-[12px] font-normal uppercase tracking-[0.2em] text-white/90">
          {carte.label}
        </Editable>
        <Editable
          path={`${CHEMIN}.${index}.titre`}
          as="p"
          className={cn(
            // Taille d'abord : un `leading-*` placé avant serait supprimé par
            // tailwind-merge, qui traite les deux comme concurrents.
            carte.large ? "text-[28px] sm:text-[34px]" : "text-[24px] sm:text-[28px]",
            "mt-2 max-w-md font-butler font-medium leading-[1.15] text-white",
          )}
        >
          {carte.titre}
        </Editable>
      </div>
    </>
  );
}

export function ArtDeVivre() {
  return (
    <section className="bg-sable-100 py-14 lg:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-16">
          <div>
            <Editable path="Accueil · Art de vivre.ART_DE_VIVRE_SURTITRE" as="div">
              <Surtitre aligne="gauche" className="text-or-600">
                {ART_DE_VIVRE_SURTITRE}
              </Surtitre>
            </Editable>

            <Editable path="Accueil · Art de vivre.ART_DE_VIVRE_TITRE" as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
              {ART_DE_VIVRE_TITRE}
            </Editable>
          </div>

          <Editable path="Accueil · Art de vivre.ART_DE_VIVRE_DESCRIPTION" as="p" className="text-[15px] leading-relaxed text-encre/65">
            {ART_DE_VIVRE_DESCRIPTION}
          </Editable>
        </div>

        {/* Mobile : carrousel horizontal qui déborde jusqu'aux bords de l'écran.
            Tablette : grille de deux colonnes, la première carte en pleine largeur.
            À partir de 1024 px, mosaïque : la première carte occupe deux rangées,
            les deux suivantes se partagent la colonne de droite, les deux
            dernières une rangée. */}
        <div className="sans-barre -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:mt-12 lg:grid-cols-12 lg:grid-rows-[220px_220px_290px]">
          {cartes.map((carte, index) => {
            const classes = cn(
              "group relative flex min-h-[340px] w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-sm sm:w-[60%] md:min-h-[280px] md:w-auto lg:min-h-0",
              index === 0 && "md:col-span-2",
              carte.grille,
            );

            return carte.href && estPagePubliqueVisible(carte.href) ? (
              <Link key={carte.titre} href={carte.href} className={classes}>
                <ContenuCarte carte={carte} index={index} />
              </Link>
            ) : (
              <div key={carte.titre} className={classes}>
                <ContenuCarte carte={carte} index={index} />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
