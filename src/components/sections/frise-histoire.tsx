import Image from "next/image";

import { Editable } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { cn } from "@/lib/cn";
import { i18n } from "@/lib/i18n/serveur";

/**
 * Chapitres de la chronologie. Une image sur deux à gauche, le texte en face.
 * TODO : photos de 1950 (rue du hameau, noir et blanc) à fournir ; une vue
 * du château passée en noir et blanc tient la place.
 */
const etapes: {
  cle: string;
  /** « XXe » : le suffixe d'un siècle s'affiche en exposant (cf. siecle). */
  date: string;
  note?: string;
  alt: string;
  noirEtBlanc?: boolean;
}[] = [
  {
    cle: "1620",
    date: "1620",
    alt: "Carte postale ancienne du Château l'Arc, à Fuveau",
  },
  {
    cle: "xxe",
    date: "XXe",
    alt: "Le grand salon du château",
  },
  {
    cle: "1950",
    date: "1950",
    note: "Décor de tournages depuis plus de 70 ans",
    alt: "Carte postale ancienne de la cour du château, décor de tournages",
    noirEtBlanc: true,
  },
  {
    cle: "1985",
    date: "1985",
    alt: "Le parcours face à la montagne Sainte-Victoire",
  },
  {
    cle: "auj",
    date: "Auj.",
    alt: "La terrasse du restaurant",
  },
];

const SECTION = "Histoire · Chronologie";

/** « XXe » → XX<sup>e</sup> (« 20th » → 20<sup>th</sup>) : le suffixe d'un siècle en exposant. */
function siecle(date: string): React.ReactNode {
  const m = date.match(/^([IVXLC]+|\d+)(e|er|th|st|nd|rd)$/);
  return m ? (
    <>
      {m[1]}
      <sup>{m[2]}</sup>
    </>
  ) : (
    date
  );
}

/** « Quatre siècles, cinq chapitres » : frise verticale alternée. */
export async function FriseHistoire() {
  const { T, tr } = await i18n();
  const { FRISE_CHAPITRES, FRISE_SURTITRE, FRISE_TITRE } = T;
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="text-center">
          <Editable path={`${SECTION}.FRISE_SURTITRE`} as="div">
            <Surtitre className="text-or-600">{FRISE_SURTITRE}</Surtitre>
          </Editable>
          <Editable path={`${SECTION}.FRISE_TITRE`} as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            {FRISE_TITRE}
          </Editable>
        </div>

        <ol className="relative mt-12 space-y-14 lg:mt-16 lg:space-y-20">
          {/* Fil central de la frise, à partir de 1024 px. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-encre/10 lg:block"
          />

          {etapes.map((etape, index) => {
            const imageAGauche = index % 2 === 0;
            const chapitre = FRISE_CHAPITRES[index];
            const chemin = `${SECTION}.FRISE_CHAPITRES.${index}`;
            if (!chapitre) return null;
            return (
              <li
                key={etape.cle}
                className="relative grid items-center gap-6 lg:grid-cols-2 lg:gap-24"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-or-500 lg:block"
                />

                <Editable
                  as="div"
                  image
                  path={`${chemin}.image`}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-sm",
                    imageAGauche ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  <Image
                    src={chapitre.image}
                    alt={tr(etape.alt)}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className={cn("object-cover", etape.noirEtBlanc && "grayscale")}
                  />
                </Editable>

                <div className={imageAGauche ? "lg:order-2" : "lg:order-1"}>
                  <p className="font-butler text-[44px] font-medium leading-none text-or-500 sm:text-[56px]">
                    {siecle(tr(etape.date))}
                  </p>
                  <Editable path={`${chemin}.titre`} as="h3" className="mt-3 font-butler text-[26px] font-medium text-club-950 sm:text-[30px]">
                    {chapitre.titre}
                  </Editable>
                  <Editable path={`${chemin}.texte`} as="p" className="mt-3 max-w-md text-[15px] leading-relaxed text-encre/65">
                    {chapitre.texte}
                  </Editable>
                  {etape.note ? (
                    <p className="mt-4 flex items-center gap-2 text-[12px] text-encre/50">
                      <span aria-hidden="true" className="text-or-500">
                        ▤
                      </span>
                      {tr(etape.note)}
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
