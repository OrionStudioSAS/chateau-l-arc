import Link from "next/link";

import { Container } from "@/components/ui/container";
import { LienFleche } from "@/components/ui/lien-fleche";
import { Surtitre } from "@/components/ui/surtitre";
import { getProchainesCompetitions } from "@/lib/api/content";
import { cn } from "@/lib/cn";
import { tonsPastille } from "@/lib/competitions";
import { formatJour, formatMoisCourt } from "@/lib/format";

export async function CompetitionsApercu() {
  const competitions = await getProchainesCompetitions(3);

  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <Surtitre aligne="gauche" className="text-or-600">
              Agenda du club
            </Surtitre>
            <h2 className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
              La saison au club
            </h2>
          </div>
          <LienFleche href="/competitions" className="text-[14px]">
            Voir tout le calendrier
          </LienFleche>
        </div>

        {competitions.length === 0 ? (
          <p className="mt-10 text-[15px] text-encre/60">
            Le calendrier de la saison sera bientôt en ligne.
          </p>
        ) : (
          <ul className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-3">
            {competitions.map((competition) => (
              <li
                key={competition.id}
                className="flex flex-col rounded-sm border border-encre/10 bg-white p-6"
              >
                <div className="flex items-start gap-4">
                  <p className="flex size-14 shrink-0 flex-col items-center justify-center rounded-sm bg-club-950 leading-none">
                    <span className="font-butler text-[22px] font-bold text-sable-50">
                      {formatJour(competition.dateDebut)}
                    </span>
                    <span className="mt-1 text-[10px] font-medium uppercase text-or-400">
                      {formatMoisCourt(competition.dateDebut)}
                    </span>
                  </p>

                  <div className="min-w-0">
                    <p
                      className={cn(
                        "inline-block rounded-full px-2.5 py-1 text-[11px] font-medium",
                        tonsPastille[competition.etat.ton],
                      )}
                    >
                      {competition.etat.libelle}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-gris-500">
                      {[competition.formule, competition.depart, competition.indexMaximum]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>

                <h3 className="mt-5 flex-1 font-butler text-[22px] font-medium leading-tight text-club-950">
                  {competition.nom}
                </h3>

                <Link
                  href={`/competitions/${competition.slug}`}
                  className={cn(
                    "mt-5 flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-[13px] font-semibold transition-colors",
                    competition.etat.cle === "ouverte"
                      ? "bg-club-950 text-sable-50 hover:bg-club-800"
                      : "border border-club-950/25 text-club-950 hover:bg-sable-50",
                  )}
                >
                  {competition.etat.action} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
