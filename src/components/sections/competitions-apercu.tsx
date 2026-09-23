import { Container } from "@/components/ui/container";
import { LienFleche } from "@/components/ui/lien-fleche";
import { Surtitre } from "@/components/ui/surtitre";
import { getProchainesCompetitions } from "@/lib/api/content";
import { formatJour, formatMoisCourt } from "@/lib/format";
import { tonsPastille } from "@/lib/competitions";

export async function CompetitionsApercu() {
  const competitions = await getProchainesCompetitions(3);

  return (
    <section className="py-20">
      <Container>
        <div className="text-center">
          <Surtitre filet="gris" className="text-encre/60">
            La vie du club
          </Surtitre>

          <h2 className="mt-6 font-butler text-[40px] font-medium leading-[1.1] text-club-950 sm:text-[64px]">
            Prochaines compétitions
          </h2>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {competitions.map((competition) => (
              <li
                key={competition.id}
                className="flex items-center gap-5 rounded-lg bg-sable-100 p-6"
              >
                <p className="flex size-[72px] shrink-0 flex-col items-center justify-center rounded-lg bg-club-950">
                  <span className="text-[12px] font-medium uppercase text-or-500">
                    {formatMoisCourt(competition.dateDebut)}
                  </span>
                  <span className="font-butler text-[34px] font-bold leading-none text-sable-50">
                    {formatJour(competition.dateDebut)}
                  </span>
                </p>

                <div className="min-w-0">
                  <h3 className="font-butler text-[21px] font-bold leading-tight text-club-950">
                    {competition.nom}
                  </h3>

                  <p className="mt-2 text-[12px] font-medium leading-relaxed text-gris-500">
                    {[competition.formule, competition.depart]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <p
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-[10px] font-medium ${tonsPastille[competition.etat.ton]}`}
                  >
                    {competition.etat.libelle}
                  </p>

                  <p className="mt-3">
                    <LienFleche href={`/competitions/${competition.slug}`}>
                      {competition.etat.action}
                    </LienFleche>
                  </p>
                </div>
              </li>
          ))}
        </ul>

        <div className="mt-14 text-center">
          <LienFleche href="/competitions">
            Voir le calendrier complet des compétitions
          </LienFleche>
        </div>
      </Container>
    </section>
  );
}
