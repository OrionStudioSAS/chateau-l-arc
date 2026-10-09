import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";

/** TODO : photo temporaire, à remplacer par la vue aérienne du parcours. */
const IMAGE_PROVISOIRE = "/images/parcours.png";

type Picto = "compas" | "montagne" | "drapeau";

const atouts: { titre: string; texte: string; picto: Picto }[] = [
  {
    titre: "Dessiné par Robert Trent Jones II",
    texte: "L'un des plus grands architectes de golf au monde, en 1985.",
    picto: "compas",
  },
  {
    titre: "Face à la montagne Sainte-Victoire",
    texte: "La montagne chère à Cézanne accompagne la partie, trou après trou.",
    picto: "montagne",
  },
  {
    titre: "Par 70 · 5 817 m",
    texte: "Un parcours technique et varié, exigeant pour les bons joueurs, accessible à tous.",
    picto: "drapeau",
  },
];

function Pictogramme({ nom }: { nom: Picto }) {
  const chemins: Record<Picto, React.ReactNode> = {
    compas: (
      <>
        <circle cx="12" cy="5" r="2" />
        <path d="M11 7 6 20m7-13 5 13M8 15h8" />
      </>
    ),
    montagne: <path d="M3 19 9 9l3 5 3-3 6 8H3Z" />,
    drapeau: <path d="M6 21V4m0 0h11l-2 4 2 4H6" />,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="mt-0.5 size-5 shrink-0 text-or-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {chemins[nom]}
    </svg>
  );
}

export function ParcoursSignature() {
  return (
    <section className="bg-sable-100 py-14 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm lg:aspect-[5/4]">
          <Image
            src={IMAGE_PROVISOIRE}
            alt="Le parcours entre pins et garrigue, la Sainte-Victoire en toile de fond"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <Surtitre aligne="gauche" className="text-or-600">
            Le parcours
          </Surtitre>
          <h2 className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            Entre pins et garrigue, un tracé de caractère
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-encre/70">
            Le parcours serpente dans un environnement préservé, entre pins parasols,
            garrigue et vignes, avec la Sainte-Victoire en toile de fond.
          </p>

          <ul className="mt-8 divide-y divide-encre/10 border-y border-encre/10">
            {atouts.map((atout) => (
              <li key={atout.titre} className="flex gap-4 py-4">
                <Pictogramme nom={atout.picto} />
                <div>
                  <p className="text-[15px] font-semibold text-club-950">{atout.titre}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-encre/60">{atout.texte}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/le-parcours"
              className="inline-flex items-center gap-2 rounded-sm bg-club-950 px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-sable-50 transition-colors hover:bg-club-800"
            >
              Explorer le parcours <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/le-parcours/scorecard"
              className="inline-flex items-center gap-2 rounded-sm border border-club-950/25 px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-club-950 transition-colors hover:bg-white"
            >
              Carte de score (PDF)
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
