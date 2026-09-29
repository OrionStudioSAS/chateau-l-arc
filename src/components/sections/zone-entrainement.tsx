import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";

/** TODO : image temporaire, à remplacer par la vue aérienne du practice. */
const IMAGE_PROVISOIRE = "/images/parcours.png";

export function ZoneEntrainement() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <Surtitre aligne="gauche" className="text-encre/60">
              Le practice
            </Surtitre>

            <h2 className="mt-6 font-butler text-[40px] font-medium leading-[1.05] text-club-950 sm:text-[64px]">
              Zone d&apos;Entraînement
            </h2>
          </div>

          {/* Paragraphes sans interligne supplémentaire entre eux, comme sur la
              maquette : le texte forme un bloc continu. */}
          <div className="text-[18px] font-normal leading-relaxed text-encre/70">
            <p>
              Situé au cœur du domaine, à quelques pas du club-house, le practice du
              Château l&apos;Arc vous accueille tous les jours pour l&apos;échauffement
              avant votre départ ou une vraie séance d&apos;entraînement, avec vue sur
              la montagne Sainte-Victoire.
            </p>
            {/* TODO : nombres de postes et nature du sol à confirmer par le club. */}
            <p>
              Ses [XX] postes de jeu, dont [XX] couverts pour jouer par tous les temps,
              vous permettent de travailler votre long jeu sur des tapis ou sur herbe [à
              confirmer]. Le seau de balles est à 4 € — et à 3 € avec un green fee ou
              pour les membres.
            </p>
            <p>
              À proximité, un green d&apos;approche entouré de bunkers vous aide à
              perfectionner votre petit jeu : sorties de bunker, chips et approches
              roulées. Un putting-green complète les installations pour régler votre
              dosage avant d&apos;attaquer le par 70 dessiné par Robert Trent Jones II.
            </p>
            <p>
              C&apos;est également ici que s&apos;entraînent l&apos;école de golf de
              l&apos;Académie et les équipes du club, encadrées par nos enseignants
              diplômés d&apos;État.
            </p>
          </div>
        </div>

        <div className="relative mt-14 aspect-[2/1] w-full overflow-hidden rounded-sm bg-club-950">
          <Image
            src={IMAGE_PROVISOIRE}
            alt=""
            fill
            sizes="(min-width: 1600px) 1400px, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
