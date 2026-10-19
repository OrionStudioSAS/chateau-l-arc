import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { ContainerEtroit } from "@/components/ui/container";
import { TexteRiche, texteBrut } from "@/components/ui/texte-riche";
import { getCompetition } from "@/lib/api/content";
import { libelleEtat, tonsPastille } from "@/lib/competitions";
import { i18n } from "@/lib/i18n/serveur";
import type { CompetitionAvecEtat } from "@/lib/api/types";
import { JsonLd, jsonLdCompetition, jsonLdFilAriane, metadonnees } from "@/lib/seo";

/**
 * Pas de `generateStaticParams` : avec Cache Components, elle doit renvoyer au
 * moins un résultat, ce qui ferait échouer le build dès que la liste est vide
 * (aucune compétition publiée, base injoignable). Les pages sont donc rendues
 * à la demande, les données restant mises en cache par `getCompetition`.
 */
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/competitions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const competition = await getCompetition(slug);

  const { tr, locale } = await i18n();
  if (!competition) return { title: tr("Compétition introuvable"), robots: { index: false } };

  return metadonnees({
    titre: `${tr(competition.nom)} — ${dateLongue(competition.dateDebut, locale)}`,
    description: await descriptionCompetition(competition),
    chemin: `/competitions/${competition.slug}`,
    image: competition.afficheUrl ?? "/og/competitions.jpg",
  });
}

/** « 8 novembre 2026 » / « 8 November 2026 ». */
const dateLongue = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso.slice(0, 10)}T12:00:00Z`),
  );

/** Description : celle du club, sinon une phrase composée à partir de la fiche. */
async function descriptionCompetition(competition: CompetitionAvecEtat): Promise<string> {
  const { tr, locale } = await i18n();
  if (competition.description) return texteBrut(tr(competition.description)).slice(0, 158);
  const details = [competition.formule, competition.trous, competition.categories]
    .filter((v): v is string => Boolean(v))
    .map(tr)
    .join(", ");
  return `${tr(competition.nom)}, ${tr("compétition de golf au Château l'Arc (Fuveau) le")} ${dateLongue(competition.dateDebut, locale)}${details ? ` : ${details}` : ""}. ${tr("Inscriptions et résultats en ligne.")}`;
}

export default async function Page({ params }: PageProps<"/[lang]/competitions/[slug]">) {
  const { slug } = await params;
  const competition = await getCompetition(slug);

  if (!competition) notFound();
  const { tr, locale, lien: lienLocal } = await i18n();

  const informations = [
    { libelle: tr("Formule"), valeur: competition.formule ? tr(competition.formule) : undefined },
    { libelle: tr("Départ"), valeur: competition.depart ? tr(competition.depart) : undefined },
    { libelle: tr("Trous"), valeur: competition.trous ? tr(competition.trous) : undefined },
    { libelle: tr("Index maximum"), valeur: competition.indexMaximum ? tr(competition.indexMaximum) : undefined },
    { libelle: tr("Catégories"), valeur: competition.categories ? tr(competition.categories) : undefined },
    { libelle: tr("Droit de jeu — membres"), valeur: competition.droitJeuMembres ? tr(competition.droitJeuMembres) : undefined },
    { libelle: tr("Droit de jeu — visiteurs"), valeur: competition.droitJeuVisiteurs ? tr(competition.droitJeuVisiteurs) : undefined },
    { libelle: tr("Inclus"), valeur: competition.inclus ? tr(competition.inclus) : undefined },
    { libelle: tr("Inscription"), valeur: competition.modeInscription ? tr(competition.modeInscription) : undefined },
    {
      libelle: tr("Places"),
      valeur: competition.places ? `${competition.inscrits} / ${competition.places}` : undefined,
    },
    { libelle: tr("Sponsor"), valeur: competition.sponsor ? tr(competition.sponsor) : undefined },
  ].filter((ligne) => Boolean(ligne.valeur));

  return (
    <article className="py-14 lg:py-20">
      <JsonLd
        donnees={[
          await jsonLdCompetition(competition, await descriptionCompetition(competition)),
          jsonLdFilAriane(
            [
              { label: tr("Accueil"), href: lienLocal("/") },
              { label: tr("Compétitions"), href: lienLocal("/competitions") },
              { label: tr(competition.nom) },
            ],
            lienLocal(`/competitions/${competition.slug}`),
          ),
        ]}
      />
      <ContainerEtroit>
        <p className="text-xs uppercase tracking-[0.15em] text-club-600">
          {dateLongue(competition.dateDebut, locale)}
          {competition.dateFin ? ` → ${dateLongue(competition.dateFin, locale)}` : ""}
        </p>

        <h1 className="mt-4 font-butler text-[40px] font-medium leading-tight text-club-950 sm:text-[48px]">
          {tr(competition.nom)}
        </h1>

        <span
          className={`mt-5 inline-block rounded-full px-3 py-1 text-[10px] font-medium ${tonsPastille[competition.etat.ton]}`}
        >
          {libelleEtat(competition, tr, locale)}
        </span>

        {competition.afficheUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={competition.afficheUrl}
            alt={`${tr("Affiche")} — ${tr(competition.nom)}`}
            className="mt-8 w-full max-w-sm rounded-sm"
          />
        ) : null}

        {competition.description ? (
          <TexteRiche
            source={tr(competition.description)}
            className="mt-8 text-[18px] leading-relaxed text-encre/80 [&_h3]:font-butler [&_h3]:text-[22px] [&_h3]:text-club-950"
          />
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

        {competition.reglementUrl ? (
          <p className="mt-10">
            <a
              href={competition.reglementUrl}
              target="_blank"
              rel="noopener"
              className="text-[16px] font-semibold text-club-950 underline-offset-4 hover:underline"
            >
              {tr("Télécharger le règlement (PDF)")} <span aria-hidden="true">→</span>
            </a>
          </p>
        ) : null}

        {competition.resultatsPublies && competition.resultatsUrl ? (
          <p className="mt-10">
            <a
              href={competition.resultatsUrl}
              className="text-[16px] font-semibold text-club-950 underline-offset-4 hover:underline"
            >
              {tr("Télécharger les résultats (PDF)")} <span aria-hidden="true">→</span>
            </a>
          </p>
        ) : null}

        <div className="mt-12">
          <ButtonLink href="/competitions" variant="secondary">
            {tr("Retour au calendrier")}
          </ButtonLink>
        </div>
      </ContainerEtroit>
    </article>
  );
}
