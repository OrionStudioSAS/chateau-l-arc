import { Editable } from "@/components/cms/editable";
import { TexteEtGalerie, type PhotoGalerie } from "@/components/sections/texte-et-galerie";
import { i18n } from "@/lib/i18n/serveur";

const SECTION = "Le parcours · Présentation";

/** Cadrage de chaque photo de la galerie (les images sont dans constants.ts). */
const cadrages = ["50% 50%", "50% 50%", "50% 50%", "50% 50%", "50% 50%"];


export async function ParcoursDescription() {
  const { T } = await i18n();
  const { PARCOURS_PRESENTATION_PARAGRAPHES, PARCOURS_PRESENTATION_PHOTOS, PARCOURS_PRESENTATION_SURTITRE, PARCOURS_PRESENTATION_TITRE } = T;
  const photos: PhotoGalerie[] = PARCOURS_PRESENTATION_PHOTOS.map((src, index) => ({
    src,
    cadrage: cadrages[index] ?? "50% 50%",
    alt: `Le parcours de golf du Château l'Arc, entre pins et garrigue (photo ${index + 1})`,
  }));
  return (
    <TexteEtGalerie
      surtitre={PARCOURS_PRESENTATION_SURTITRE}
      titre={PARCOURS_PRESENTATION_TITRE}
      photos={photos}
      classeTexte="space-y-6"
      cms={{
        surtitre: `${SECTION}.PARCOURS_PRESENTATION_SURTITRE`,
        titre: `${SECTION}.PARCOURS_PRESENTATION_TITRE`,
        photos: `${SECTION}.PARCOURS_PRESENTATION_PHOTOS`,
      }}
    >
      {PARCOURS_PRESENTATION_PARAGRAPHES.map((paragraphe, index) => (
        <Editable
          key={index}
          path={`${SECTION}.PARCOURS_PRESENTATION_PARAGRAPHES.${index}`}
          as="p"
          className={index === 0 ? "font-bold text-encre" : undefined}
        >
          {paragraphe}
        </Editable>
      ))}
    </TexteEtGalerie>
  );
}
