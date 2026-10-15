import { Container } from "@/components/ui/container";
import { ChampVideo } from "@/components/cms/champ-video";
import { Editable } from "@/components/cms/editable";
import { Surtitre } from "@/components/ui/surtitre";
import {
  ENTRAINEMENT_PARAGRAPHES,
  ENTRAINEMENT_SURTITRE,
  ENTRAINEMENT_TITRE,
  ENTRAINEMENT_VIDEO,
} from "@/constants";

const SECTION = "Le parcours · Zone d'entraînement";

export function ZoneEntrainement() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <Editable path={`${SECTION}.ENTRAINEMENT_SURTITRE`} as="div">
              <Surtitre aligne="gauche" className="text-encre/60">
                {ENTRAINEMENT_SURTITRE}
              </Surtitre>
            </Editable>

            <Editable path={`${SECTION}.ENTRAINEMENT_TITRE`} as="h2" className="mt-6 font-butler text-[40px] font-medium leading-[1.05] text-club-950 sm:text-[64px]">
              {ENTRAINEMENT_TITRE}
            </Editable>
          </div>

          {/* Paragraphes sans interligne supplémentaire entre eux, comme sur la
              maquette : le texte forme un bloc continu. */}
          <div className="text-[18px] font-normal leading-relaxed text-encre/70">
            {ENTRAINEMENT_PARAGRAPHES.map((paragraphe, index) => (
              <Editable key={index} path={`${SECTION}.ENTRAINEMENT_PARAGRAPHES.${index}`} as="p">
                {paragraphe}
              </Editable>
            ))}
          </div>
        </div>

        {/* Version « sans cookie » de YouTube : rien n'est déposé tant que la
            lecture n'est pas lancée. */}
        <div className="relative mt-14 aspect-video w-full overflow-hidden rounded-sm bg-club-950">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ENTRAINEMENT_VIDEO}`}
            title="Vidéo de la zone d'entraînement du Golf Château l'Arc"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <ChampVideo path="Le parcours · Zone d'entraînement.ENTRAINEMENT_VIDEO" identifiant={ENTRAINEMENT_VIDEO} />
      </Container>
    </section>
  );
}
