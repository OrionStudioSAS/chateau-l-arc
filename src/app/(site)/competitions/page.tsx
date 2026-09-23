import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { getCompetitions } from "@/lib/api/content";
import { formatDate } from "@/lib/format";
import { tonsPastille } from "@/lib/competitions";

export const metadata: Metadata = {
  title: "Compétitions",
  description:
    "Calendrier des compétitions du Golf Château l'Arc : formules, inscriptions et résultats.",
};

export default async function Page() {
  const competitions = await getCompetitions();

  return (
    <>
      <PageHero
        surtitre="Agenda"
        titre="Compétitions"
        chapo="Le calendrier du club, des inscriptions à la remise des prix."
      />
      <Container className="py-20">
        {competitions.length === 0 ? (
          <p className="text-encre/60">Aucune compétition programmée pour le moment.</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {competitions.map((competition) => (
              <li key={competition.id}>
                <Link
                  href={`/competitions/${competition.slug}`}
                  className="group flex h-full flex-col rounded-lg bg-sable-100 p-6 transition-colors hover:bg-sable-300/40"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-club-600">
                    {formatDate(competition.dateDebut)}
                    {competition.dateFin
                      ? ` → ${formatDate(competition.dateFin)}`
                      : ""}
                  </p>
                  <h2 className="mt-3 font-butler text-[21px] font-bold text-club-950 group-hover:underline">
                    {competition.nom}
                  </h2>
                  <p className="mt-2 text-[12px] font-medium text-gris-500">
                    {[competition.formule, competition.depart, competition.trous]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <span
                    className={`mt-4 inline-block w-fit rounded-full px-3 py-1 text-[10px] font-medium ${tonsPastille[competition.etat.ton]}`}
                  >
                    {competition.etat.libelle}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
