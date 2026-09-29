import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { BoutonOr } from "@/components/ui/bouton-or";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { cn } from "@/lib/cn";

/** TODO : image temporaire, à remplacer par les cinq photos définitives. */
const IMAGE_PROVISOIRE = "/images/banner.jpg";

type Carte = {
  label: string;
  titre: string;
  href?: Route;
  cadrage: string;
  /** Position dans la mosaïque, à partir de 1024 px. */
  grille: string;
  /** Titre agrandi sur la carte principale. */
  large?: boolean;
};

const cartes: Carte[] = [
  {
    label: "La table du golf",
    titre: "Déjeuner face au parcours",
    href: "/restaurant",
    cadrage: "50% 60%",
    grille: "lg:col-span-4 lg:row-span-2",
    large: true,
  },
  {
    label: "Practice & Académie",
    titre: "Travailler le swing et le reste",
    href: "/academie",
    cadrage: "70% 30%",
    grille: "lg:col-span-2",
  },
  {
    // TODO : destination à fournir (site de l'école, probablement externe).
    label: "Grandir au cœur du domaine",
    titre: "SVIS - École internationale",
    cadrage: "30% 40%",
    grille: "lg:col-span-2",
  },
  {
    label: "Proshop",
    titre: "S'équiper au club",
    href: "/proshop",
    cadrage: "40% 50%",
    grille: "lg:col-span-3",
  },
  {
    label: "Compétitions & association",
    titre: "Se retrouver entre amis",
    href: "/competitions",
    cadrage: "60% 45%",
    grille: "lg:col-span-3",
  },
];

function ContenuCarte({ carte }: { carte: Carte }) {
  return (
    <>
      <Image
        src={IMAGE_PROVISOIRE}
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 85vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        style={{ objectPosition: carte.cadrage }}
      />
      {/* Dégradé bas : le texte reste lisible quelle que soit la photo, y
          compris sur les petites cartes où le bloc de texte remonte haut. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/5"
      />

      <div className="relative mt-auto p-5 sm:p-8">
        <p className="text-[12px] font-normal uppercase tracking-[0.2em] text-white/90">
          {carte.label}
        </p>
        <p
          className={cn(
            // Taille d'abord : un `leading-*` placé avant serait supprimé par
            // tailwind-merge, qui traite les deux comme concurrents.
            carte.large ? "text-[28px] sm:text-[34px]" : "text-[24px] sm:text-[28px]",
            "mt-2 max-w-md font-butler font-medium leading-[1.15] text-white",
          )}
        >
          {carte.titre}
        </p>
      </div>
    </>
  );
}

export function ArtDeVivre() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <Surtitre aligne="gauche" className="text-encre/60">
              L&apos;art de vivre
            </Surtitre>

            <h2 className="mt-6 max-w-sm font-butler text-[40px] font-medium leading-[1.05] text-club-950 sm:text-[64px]">
              Bien plus qu&apos;un golf
            </h2>
          </div>

          <div className="lg:pt-10">
            {/* ml-auto : le bloc se cale à droite, aligné sur le bord du bouton,
                sans changer l'alignement du texte lui-même. */}
            <p className="max-w-md text-[18px] font-normal leading-relaxed text-encre/70 lg:ml-auto">
              Restaurant, practice, proshop, club-house et école internationale : le
              Château l&apos;Arc est un lieu de vie entre montagne Sainte-Victoire et
              Méditerranée.
            </p>

            <div className="mt-8 flex lg:justify-end">
              <BoutonOr href="/histoire">
                Visiter le domaine <span aria-hidden="true">→</span>
              </BoutonOr>
            </div>
          </div>
        </div>

        {/* Mobile : carrousel horizontal qui déborde jusqu'aux bords de l'écran.
            Tablette : grille de deux colonnes, la première carte en pleine largeur.
            À partir de 1024 px, mosaïque : la première carte occupe deux rangées,
            les deux suivantes se partagent la colonne de droite, les deux
            dernières une rangée. */}
        <div className="sans-barre -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:mt-14 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-6 lg:grid-rows-[220px_220px_290px]">
          {cartes.map((carte, index) => {
            const classes = cn(
              "group relative flex min-h-[340px] w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-sm sm:w-[60%] md:min-h-[280px] md:w-auto lg:min-h-0",
              index === 0 && "md:col-span-2",
              carte.grille,
            );

            return carte.href ? (
              <Link key={carte.titre} href={carte.href} className={classes}>
                <ContenuCarte carte={carte} />
              </Link>
            ) : (
              <div key={carte.titre} className={classes}>
                <ContenuCarte carte={carte} />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
