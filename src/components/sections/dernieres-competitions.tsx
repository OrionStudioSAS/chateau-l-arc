import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { getCompetitionsAvecResultats } from "@/lib/api/content";
import { formatDateCourte } from "@/lib/format";

export async function DernieresCompetitions() {
  const competitions = await getCompetitionsAvecResultats(3);

  if (competitions.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-or-500">Résultats</Surtitre>

          <h2 className="mt-6 font-butler text-[40px] font-medium leading-[1.1] text-club-950 sm:text-[56px]">
            Dernières compétitions
          </h2>
        </div>

        <ul className="mt-12 space-y-4">
          {competitions.map((competition) => (
            <li
              key={competition.id}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg bg-sable-100 px-6 py-6"
            >
              <p className="text-[16px] font-semibold text-or-600">
                {formatDateCourte(competition.dateDebut)}
              </p>

              <p className="min-w-0 flex-1 text-[16px] text-encre/80">
                {competition.nom} — Résultats complets (PDF)
              </p>

              <a
                href={competition.resultatsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[16px] font-semibold text-club-950 underline-offset-4 hover:underline"
              >
                <span className="sr-only">
                  Résultats de {competition.nom} au format PDF —{" "}
                </span>
                Télécharger <span aria-hidden="true">↓</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
