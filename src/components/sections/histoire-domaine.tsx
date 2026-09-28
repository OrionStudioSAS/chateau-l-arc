import { TexteEtGalerie, type PhotoGalerie } from "@/components/sections/texte-et-galerie";

/**
 * TODO : images temporaires. La première reprend la photo ancienne de la
 * bannière, les autres alternent les visuels disponibles avec des cadrages
 * différents, en attendant les photos du club-house et du domaine.
 */
const photos: PhotoGalerie[] = [
  { src: "/images/notre-histoire.png", cadrage: "50% 40%" },
  { src: "/images/banner.jpg", cadrage: "55% 65%" },
  { src: "/images/parcours.png", cadrage: "30% 45%" },
  { src: "/images/banner.jpg", cadrage: "20% 35%" },
  { src: "/images/parcours.png", cadrage: "75% 55%" },
];

export function HistoireDomaine() {
  return (
    <TexteEtGalerie
      surtitre="Notre histoire"
      titre="Le Château, un lieu chargé d'histoire"
      photos={photos}
    >
      <p>
        Le Domaine de Château l&apos;Arc est un ensemble de plus de 100 ha aux portes
        d&apos;Aix-en-Provence et de Marseille.
      </p>
      <p>
        Faisant face à la montagne Sainte Victoire, c&apos;est dans un cadre
        exceptionnel que vous serez accueillis au Domaine Château l&apos;Arc.
      </p>
      <p>
        Bâti en 1620 par la Famille d&apos;Agoult, le Château l&apos;Arc est le point
        central du domaine. Devenu l&apos;atelier préféré du peintre Bernard BUFFET, le
        Château fut le refuge estival de Pierre BERGE, Jean COCTEAU ou Yves
        Saint-Laurent.
      </p>
      <p>
        Cette demeure de prestige abrite désormais le Club House du Golf et propose des
        espaces susceptibles d&apos;accueillir de nombreux évènements. Son grand salon,
        son bar ainsi que la grande terrasse avec vue panoramique sur la Sainte Victoire
        accueillent de nombreux évènements : soirées privées, concerts…
      </p>
      <p>
        Une école internationale bilingue, avec internat, dispensant des enseignements
        du CP à la terminale propose un cursus sport étude golf. La Sainte Victoire
        International School permet à ses étudiants d&apos;obtenir un baccalauréat
        international (
        <a
          href="https://www.ibo.org"
          rel="noreferrer noopener"
          target="_blank"
          className="underline-offset-4 hover:underline"
        >
          www.ibo.org
        </a>
        ) reconnu dans le monde entier.
      </p>
      <p>
        Le cinéma a également élu domicile au Château l&apos;Arc, notamment en servant
        de décor principal au film de Fernandel intitulé «&nbsp;Uniformes et grands
        manœuvres&nbsp;» (1950). Le film sur la vie d&apos;Yves Saint Laurent contient
        des scènes se déroulant au château. Depuis lors, de nombreux tournages ont eu
        lieu sur le domaine. Le dernier en date étant une scène du film «&nbsp;Les
        TUCHES 2&nbsp;» ou «&nbsp;Divorce Club&nbsp;» réalisé par Mickael Young.
      </p>
      <p>
        Le parcours de golf 18 trous, par 70 et 5817 m, dessiné par Robert Trent Jones
        II s&apos;enroule autour du Château l&apos;Arc offrant des points de vue
        magnifiques sur la montagne Sainte Victoire.
      </p>
      <p>
        Très facilement accessible, le domaine se situe à proximité immédiate de
        l&apos;aéroport de Marseille Provence (25 min), de la gare TGV (25 min) et de
        l&apos;autoroute A8 entre Marseille et Nice (5 min).
      </p>
    </TexteEtGalerie>
  );
}
