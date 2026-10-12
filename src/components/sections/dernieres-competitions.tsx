import Link from "next/link";

import { Container } from "@/components/ui/container";
import { LienFleche } from "@/components/ui/lien-fleche";
import { Surtitre } from "@/components/ui/surtitre";
import { getCompetitionsAvecResultats } from "@/lib/api/content";
import { formatDateCourte } from "@/lib/format";

/**
 * Résultats publiés depuis le back-office (PDF + vainqueurs). Sur la page
 * Compétitions, les trois derniers et un lien vers la saison complète ; sur
 * /competitions/resultats, toute la saison.
 */
export async function DernieresCompetitions({
  saison,
  complet = false,
}: {
  saison: number;
  /** Toute la saison, sans titre de section ni lien. */
  complet?: boolean;
}) {
  const competitions = await getCompetitionsAvecResultats(complet ? 100 : 3);

  if (competitions.length === 0) {
    return complet ? (
      <section className="py-14 lg:py-20">
        <Container>
          <p className="text-[15px] text-encre/60">
            Les résultats de la saison seront publiés ici, dès le lendemain de chaque compétition.
          </p>
        </Container>
      </section>
    ) : null;
  }

  return (
    <section className="bg-sable-100 py-14 lg:py-20">
      <Container>
        {complet ? null : (
          <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <Surtitre aligne="gauche" className="text-or-600">
                Résultats
              </Surtitre>
              <h2 className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
                Derniers résultats
              </h2>
            </div>
            <LienFleche href="/competitions/resultats" className="text-[14px]">
              Tous les résultats {saison}
            </LienFleche>
          </div>
        )}

        <ul className="divide-y divide-encre/10 rounded-sm border border-encre/10 bg-white px-5 sm:px-8">
          {competitions.map((competition) => (
            <li
              key={competition.id}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 py-5 lg:grid-cols-[5rem_minmax(0,1fr)_auto]"
            >
              <p className="text-[13px] font-medium text-or-600">
                {formatDateCourte(competition.dateDebut)}
              </p>
              <div className="min-w-0">
                <h3 className="font-butler text-[20px] font-medium leading-tight text-club-950 sm:text-[22px]">
                  {competition.nom}
                </h3>
                {competition.vainqueurs ? (
                  <p className="mt-1 text-[13px] text-encre/60">
                    Vainqueurs : {competition.vainqueurs}
                  </p>
                ) : null}
              </div>
              <div className="col-span-2 flex flex-wrap items-center gap-x-6 gap-y-3 lg:col-span-1 lg:justify-end">
                <a
                  href={competition.resultatsUrl}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 text-[13px] text-encre/60 underline-offset-4 hover:text-club-950 hover:underline"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
                  </svg>
                  PDF officiel
                  <span className="sr-only"> — résultats de {competition.nom}</span>
                </a>
                <Link
                  href={`/competitions/${competition.slug}`}
                  className="inline-flex items-center gap-2 rounded-sm bg-club-950 px-5 py-3 text-[13px] font-semibold text-sable-50 transition-colors hover:bg-club-800"
                >
                  Voir le classement <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
