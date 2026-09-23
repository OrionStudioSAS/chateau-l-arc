import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getCompetition, getCompetitions } from "@/lib/api/content";
import { formatDate } from "@/lib/format";
import { tonsPastille } from "@/lib/competitions";

/** Les compétitions publiées au build sont prérendues ; les autres à la demande. */
export async function generateStaticParams() {
  const competitions = await getCompetitions();
  return competitions.map((competition) => ({ slug: competition.slug }));
}

export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/competitions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const competition = await getCompetition(slug);

  if (!competition) return { title: "Compétition introuvable" };

  return {
    title: competition.nom,
    description: competition.description,
    alternates: { canonical: `/competitions/${competition.slug}` },
  };
}

export default async function Page({ params }: PageProps<"/competitions/[slug]">) {
  const { slug } = await params;
  const competition = await getCompetition(slug);

  if (!competition) notFound();

  const informations = [
    { libelle: "Formule", valeur: competition.formule },
    { libelle: "Départ", valeur: competition.depart },
    { libelle: "Trous", valeur: competition.trous },
    { libelle: "Index maximum", valeur: competition.indexMaximum },
    { libelle: "Catégories", valeur: competition.categories },
    { libelle: "Droit de jeu — membres", valeur: competition.droitJeuMembres },
    { libelle: "Droit de jeu — visiteurs", valeur: competition.droitJeuVisiteurs },
    { libelle: "Inclus", valeur: competition.inclus },
    { libelle: "Inscription", valeur: competition.modeInscription },
    {
      libelle: "Places",
      valeur: competition.places ? `${competition.inscrits} / ${competition.places}` : undefined,
    },
    { libelle: "Sponsor", valeur: competition.sponsor },
  ].filter((ligne) => Boolean(ligne.valeur));

  return (
    <article className="py-20">
      <Container className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.15em] text-club-600">
          {formatDate(competition.dateDebut)}
          {competition.dateFin ? ` → ${formatDate(competition.dateFin)}` : ""}
        </p>

        <h1 className="mt-4 font-butler text-[40px] font-medium leading-tight text-club-950 sm:text-[48px]">
          {competition.nom}
        </h1>

        <span
          className={`mt-5 inline-block rounded-full px-3 py-1 text-[10px] font-medium ${tonsPastille[competition.etat.ton]}`}
        >
          {competition.etat.libelle}
        </span>

        {competition.description ? (
          <p className="mt-8 text-[18px] leading-relaxed text-encre/80">
            {competition.description}
          </p>
        ) : null}

        <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-club-950/10 pt-8 sm:grid-cols-2">
          {informations.map((ligne) => (
            <div key={ligne.libelle}>
              <dt className="text-[12px] font-normal uppercase tracking-[0.12em] text-gris-500">
                {ligne.libelle}
              </dt>
              <dd className="mt-1 text-base text-encre">{ligne.valeur}</dd>
            </div>
          ))}
        </dl>

        {competition.resultatsPublies && competition.resultatsUrl ? (
          <p className="mt-10">
            <a
              href={competition.resultatsUrl}
              className="text-[16px] font-semibold text-club-950 underline-offset-4 hover:underline"
            >
              Télécharger les résultats (PDF) <span aria-hidden="true">→</span>
            </a>
          </p>
        ) : null}

        <div className="mt-12">
          <ButtonLink href="/competitions" variant="secondary">
            Retour au calendrier
          </ButtonLink>
        </div>
      </Container>
    </article>
  );
}
