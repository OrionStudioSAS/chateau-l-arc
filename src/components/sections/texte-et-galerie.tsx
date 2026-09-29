import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { cn } from "@/lib/cn";

export type PhotoGalerie = {
  src: string;
  /** `object-position`, pour varier les cadrages d'une même photo. */
  cadrage: string;
};

/**
 * Titre à gauche, texte à droite, puis une galerie de cinq photos : la
 * première occupe les deux rangées de la colonne de gauche, les quatre autres
 * se répartissent sur les deux colonnes suivantes.
 */
export function TexteEtGalerie({
  surtitre,
  titre,
  photos,
  classeTexte,
  children,
}: {
  surtitre: string;
  titre: string;
  photos: PhotoGalerie[];
  /** Espacement des paragraphes, propre à chaque section. */
  classeTexte?: string;
  children: React.ReactNode;
}) {
  // Mobile et tablette : la première photo en pleine largeur, les quatre
  // autres en grille 2 × 2, plutôt que cinq grandes photos empilées.
  const formats = [
    "col-span-2 aspect-[4/3] sm:aspect-[16/9]",
    "aspect-square sm:aspect-[4/3]",
    "aspect-square sm:aspect-[4/3]",
    "aspect-square sm:aspect-[4/3]",
    "aspect-square sm:aspect-[4/3]",
  ];

  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        {/* Colonnes inégales : le titre respire, le texte reste sur une
            colonne étroite. */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          {/* Le titre reste visible pendant le défilement du texte. `top-28`
              le place sous l'en-tête collant (h-20), avec un peu d'air. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Surtitre aligne="gauche" className="text-encre/60">
              {surtitre}
            </Surtitre>

            <h2 className="mt-6 font-butler text-[40px] font-medium leading-[1.05] text-club-950 sm:text-[64px]">
              {titre}
            </h2>
          </div>

          <div
            className={cn(
              "text-[18px] font-normal leading-relaxed text-encre/70",
              classeTexte,
            )}
          >
            {children}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-3 lg:grid-rows-[292px_292px]">
          {photos.slice(0, 5).map((photo, index) => (
            <div
              key={`${photo.src}-${photo.cadrage}`}
              className={cn(
                "relative overflow-hidden rounded-sm",
                formats[index],
                "lg:aspect-auto",
                index === 0 ? "lg:col-span-1 lg:row-span-2" : "",
              )}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes={index === 0 ? "(min-width: 1024px) 33vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover"
                style={{ objectPosition: photo.cadrage }}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
