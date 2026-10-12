import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";

import { PictoAcademie, type NomPicto } from "@/components/sections/academie-pictos";

const parcours: { label: string; titre: string; texte: string; lien: string; ancre: string; picto: NomPicto }[] = [
  {
    label: "Juniors",
    titre: "Le golf dès 4 ans",
    texte: "Éveil par le jeu puis technique et premières compétitions, le mercredi et le samedi.",
    lien: "École juniors",
    ancre: "juniors",
    picto: "juniors",
  },
  {
    label: "Adultes",
    titre: "Les formules Prestige",
    texte: "Cours collectifs de 6 personnes maximum, une heure par jour, quatre jours par semaine.",
    lien: "Formules adultes",
    ancre: "prestige",
    picto: "adultes",
  },
  {
    label: "Groupes",
    titre: "Stages & initiations",
    texte: "De 2 à 30 personnes, toute l'année : découverte, ateliers thématiques, stages tous niveaux.",
    lien: "Stages & initiations",
    ancre: "stages",
    picto: "groupe",
  },
];

/** « Une école pour chaque golfeur » : trois portes d'entrée vers les sections. */
export function AcademieIntro() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-16">
          <div>
            <Surtitre aligne="gauche" className="text-or-600">
              Apprendre au Château l&apos;Arc
            </Surtitre>
            <h2 className="mt-5 max-w-xl font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
              Une école pour chaque golfeur
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-encre/65">
            Cours en petits groupes, stages pendant les vacances, initiations découverte :
            choisissez votre rythme.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
          {parcours.map((carte) => (
            <li key={carte.ancre} className="flex flex-col rounded-sm border border-encre/10 p-7">
              <span className="flex size-11 items-center justify-center rounded-full bg-sable-100 text-club-950">
                <PictoAcademie nom={carte.picto} className="size-5" />
              </span>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-or-600">
                {carte.label}
              </p>
              <h3 className="mt-2 font-butler text-[24px] font-medium leading-tight text-club-950">
                {carte.titre}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-encre/60">{carte.texte}</p>
              <a
                href={`#${carte.ancre}`}
                className="mt-6 text-[14px] font-semibold text-club-950 underline-offset-4 hover:underline"
              >
                {carte.lien} <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
