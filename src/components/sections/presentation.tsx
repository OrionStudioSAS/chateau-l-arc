import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";

/**
 * Identifiant de la vidéo YouTube de présentation.
 * Tant qu'il est vide, une image tient la place du lecteur.
 * TODO : renseigner dès que la vidéo est fournie.
 */
const VIDEO_YOUTUBE_ID = "";

/** TODO : image temporaire, à remplacer par les six photos définitives. */
const IMAGE_PROVISOIRE = "/images/banner.jpg";

/**
 * Vignettes décoratives réparties autour du texte.
 * Positions en pourcentage du bloc de texte ; masquées sous 1024 px, où elles
 * chevaucheraient le contenu. Les cadrages diffèrent pour éviter six fois la
 * même image tant que les photos définitives ne sont pas là.
 */
const vignettes = [
  { cote: "gauche", x: "11%", y: "-4%", cadrage: "50% 30%" },
  { cote: "gauche", x: "5%", y: "38%", cadrage: "20% 60%" },
  { cote: "gauche", x: "13.5%", y: "80%", cadrage: "80% 40%" },
  { cote: "droite", x: "11%", y: "-6%", cadrage: "35% 70%" },
  { cote: "droite", x: "5%", y: "39%", cadrage: "65% 25%" },
  { cote: "droite", x: "13.5%", y: "84%", cadrage: "10% 50%" },
] as const;

export function Presentation() {
  return (
    <section className="overflow-hidden bg-white py-20">
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
          {vignettes.map((vignette) => (
            <span
              key={`${vignette.cote}-${vignette.y}`}
              className="absolute block overflow-hidden rounded-md shadow-[0_6px_18px_rgba(16,24,40,0.12)]"
              style={{
                top: vignette.y,
                [vignette.cote === "gauche" ? "left" : "right"]: vignette.x,
              }}
            >
              <Image
                src={IMAGE_PROVISOIRE}
                alt=""
                width={135}
                height={70}
                sizes="135px"
                className="h-[70px] w-[135px] object-cover"
                style={{ objectPosition: vignette.cadrage }}
              />
            </span>
          ))}
        </div>

        <Container className="relative max-w-xl text-center">
          <Surtitre className="text-encre/70">
            Le plus beau golf entre Aix et Marseille
          </Surtitre>

          <p className="mt-10 text-[20px] font-normal leading-[1.6] tracking-[-0.2px] text-encre/85">
            <strong className="font-bold text-encre">
              Le Château l&apos;Arc Golf Club fait indéniablement partie des plus beaux
              lieux golfiques de la région Provence Alpes Côte d&apos;Azur. Le parcours,
              créé en 1985 et dessiné par Robert Trent Jones II, est idéalement situé aux
              portes d&apos;Aix-En-Provence et Marseille.
            </strong>{" "}
            Ce par 70 de 5817 mètres propose une expérience golfique variée grâce à son
            dessin qui serpente entre pins et garrigue dans un environnement
            d&apos;exception puisqu&apos;il donne une vue fantastique sur la montagne
            Sainte-Victoire.
          </p>
        </Container>
      </div>

      <div className="mx-auto mt-20 w-full max-w-6xl px-5 sm:px-8">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-club-950">
          {VIDEO_YOUTUBE_ID ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_YOUTUBE_ID}`}
              title="Vidéo de présentation du Golf Château l'Arc"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <Image
              src={IMAGE_PROVISOIRE}
              alt=""
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
