import { TexteEtGalerie, type PhotoGalerie } from "@/components/sections/texte-et-galerie";

/** TODO : images temporaires, à remplacer par les photos du parcours. */
const photos: PhotoGalerie[] = [
  { src: "/images/parcours.png", cadrage: "50% 40%" },
  { src: "/images/parcours.png", cadrage: "20% 30%" },
  { src: "/images/parcours.png", cadrage: "80% 35%" },
  { src: "/images/parcours.png", cadrage: "35% 70%" },
  { src: "/images/parcours.png", cadrage: "65% 60%" },
];

export function ParcoursDescription() {
  return (
    <TexteEtGalerie
      surtitre="Le parcours"
      titre="Un parcours qui récompense la précision"
      photos={photos}
      classeTexte="space-y-6"
    >
      <p className="font-bold text-encre">
        Dessiné en 1985 par Robert Trent Jones II, l&apos;un des plus grands
        architectes de golf au monde, le parcours du Château l&apos;Arc serpente entre
        pins, chênes et garrigue sur le domaine du château. Fairways travaillés,
        bunkers stratégiques et greens défendus, dans la pure tradition du golf
        américain.
      </p>

      <p>
        Du haut des départs, la vue s&apos;ouvre sur la montagne Sainte-Victoire, chère
        à Cézanne. Un parcours technique mais accessible, où chaque niveau de jeu
        trouve son plaisir grâce à six repères de départ.
      </p>
    </TexteEtGalerie>
  );
}
