import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { cn } from "@/lib/cn";

/**
 * Chapitres de la chronologie. Une image sur deux à gauche, le texte en face.
 * TODO : photos de 1950 (rue du hameau, noir et blanc) à fournir ; une vue
 * du château passée en noir et blanc tient la place.
 */
const etapes: {
  cle: string;
  date: React.ReactNode;
  titre: string;
  texte: string;
  note?: string;
  image: string;
  alt: string;
  noirEtBlanc?: boolean;
}[] = [
  {
    cle: "1620",
    date: "1620",
    titre: "La famille d'Agoult",
    texte:
      "Construction du Château l'Arc, point central du domaine, au cœur de la Provence véritable.",
    image: "/images/notre-histoire.png",
    alt: "Carte postale ancienne du Château l'Arc, à Fuveau",
  },
  {
    cle: "xxe",
    // Le « e » est en exposant, comme il se doit pour un siècle.
    date: (
      <>
        XX<sup>e</sup>
      </>
    ),
    titre: "L'atelier des artistes",
    texte:
      "Le château devient l'atelier préféré du peintre Bernard Buffet, puis le refuge estival de Pierre Bergé, Jean Cocteau et Yves Saint Laurent.",
    image: "/images/tarifs.png",
    alt: "Le grand salon du château",
  },
  {
    cle: "1950",
    date: "1950",
    titre: "Le cinéma s'invite",
    texte:
      "Fernandel y tourne « Uniformes et grandes manœuvres ». Suivront des scènes du film consacré à Yves Saint Laurent, Les Tuche 2 et Divorce Club.",
    note: "Décor de tournages depuis plus de 70 ans",
    image: "/images/banner.jpg",
    alt: "Le château entre les pins",
    noirEtBlanc: true,
  },
  {
    cle: "1985",
    date: "1985",
    titre: "Robert Trent Jones II",
    texte:
      "Le parcours 18 trous s'enroule autour du château, offrant des points de vue magnifiques sur la Sainte-Victoire.",
    image: "/images/parcours.png",
    alt: "Le parcours face à la montagne Sainte-Victoire",
  },
  {
    cle: "auj",
    date: "Auj.",
    titre: "Un lieu de vie",
    texte:
      "Club House dans la demeure historique, restaurant, réceptions et la Sainte-Victoire International School : le domaine vit toute l'année.",
    image: "/images/hp-dejeuner.png",
    alt: "La terrasse du restaurant",
  },
];

/** « Quatre siècles, cinq chapitres » : frise verticale alternée. */
export function FriseHistoire() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-or-600">Chronologie</Surtitre>
          <h2 className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            Quatre siècles, cinq chapitres
          </h2>
        </div>

        <ol className="relative mt-12 space-y-14 lg:mt-16 lg:space-y-20">
          {/* Fil central de la frise, à partir de 1024 px. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-encre/10 lg:block"
          />

          {etapes.map((etape, index) => {
            const imageAGauche = index % 2 === 0;
            return (
              <li
                key={etape.cle}
                className="relative grid items-center gap-6 lg:grid-cols-2 lg:gap-24"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-or-500 lg:block"
                />

                <div
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-sm",
                    imageAGauche ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  <Image
                    src={etape.image}
                    alt={etape.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className={cn("object-cover", etape.noirEtBlanc && "grayscale")}
                  />
                </div>

                <div className={imageAGauche ? "lg:order-2" : "lg:order-1"}>
                  <p className="font-butler text-[44px] font-medium leading-none text-or-500 sm:text-[56px]">
                    {etape.date}
                  </p>
                  <h3 className="mt-3 font-butler text-[26px] font-medium text-club-950 sm:text-[30px]">
                    {etape.titre}
                  </h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-encre/65">
                    {etape.texte}
                  </p>
                  {etape.note ? (
                    <p className="mt-4 flex items-center gap-2 text-[12px] text-encre/50">
                      <span aria-hidden="true" className="text-or-500">
                        ▤
                      </span>
                      {etape.note}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
