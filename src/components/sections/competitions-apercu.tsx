import { Lien as Link } from "@/components/ui/lien";

import { Editable } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";
import { LienFleche } from "@/components/ui/lien-fleche";
import { Surtitre } from "@/components/ui/surtitre";
import { getProchainesCompetitions } from "@/lib/api/content";
import { cn } from "@/lib/cn";
import { libelleEtat, tonsPastille } from "@/lib/competitions";
import { i18n } from "@/lib/i18n/serveur";

export async function CompetitionsApercu() {
  const { T, tr, locale } = await i18n();
  const { COMPETITIONS_SURTITRE, COMPETITIONS_TITRE } = T;
  const competitions = await getProchainesCompetitions(3);

  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <Editable path="Accueil · Compétitions.COMPETITIONS_SURTITRE" as="div">
              <Surtitre aligne="gauche" className="text-or-600">
                {COMPETITIONS_SURTITRE}
              </Surtitre>
            </Editable>
            <Editable path="Accueil · Compétitions.COMPETITIONS_TITRE" as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
              {COMPETITIONS_TITRE}
            </Editable>
          </div>
          <LienFleche href="/competitions" className="text-[14px]">
            {tr("Voir tout le calendrier")}
          </LienFleche>
        </div>

        {competitions.length === 0 ? (
          <p className="mt-10 text-[15px] text-encre/60">
            {tr("Le calendrier de la saison sera bientôt en ligne.")}
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
                      {new Intl.DateTimeFormat(locale, { day: "2-digit", timeZone: "UTC" }).format(new Date(`${competition.dateDebut.slice(0, 10)}T12:00:00Z`))}
                    </span>
                    <span className="mt-1 text-[10px] font-medium uppercase text-or-400">
                      {new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(new Date(`${competition.dateDebut.slice(0, 10)}T12:00:00Z`)).replace(".", "")}
                    </span>
                  </p>

                  <div className="min-w-0">
                    <p
                      className={cn(
                        "inline-block rounded-full px-2.5 py-1 text-[11px] font-medium",
                        tonsPastille[competition.etat.ton],
                      )}
                    >
                      {libelleEtat(competition, tr, locale)}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-gris-500">
                      {[competition.formule, competition.depart, competition.indexMaximum]
                        .filter((v): v is string => Boolean(v))
                        .map(tr)
                        .join(" · ")}
                    </p>
                  </div>
                </div>

                <h3 className="mt-5 flex-1 font-butler text-[22px] font-medium leading-tight text-club-950">
                  {tr(competition.nom)}
                </h3>

                <Link
                  href={`/competitions/${competition.slug}`}
                  data-suivi={competition.etat.cle === "ouverte" ? "inscription" : undefined}
                  className={cn(
                    "mt-5 flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-[13px] font-semibold transition-colors",
                    competition.etat.cle === "ouverte"
                      ? "bg-club-950 text-sable-50 hover:bg-club-800"
                      : "border border-club-950/25 text-club-950 hover:bg-sable-50",
                  )}
                >
                  {tr(competition.etat.action)} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
