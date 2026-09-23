import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { getTarifs } from "@/lib/api/content";
import { formatPrix } from "@/lib/format";
import type { Tarif } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "Tarifs & réservation",
  description:
    "Green-fees, abonnements et locations : les tarifs en vigueur au Golf Château l'Arc.",
};

const libellesCategories: Record<Tarif["categorie"], string> = {
  "green-fee": "Green-fees",
  abonnement: "Abonnements",
  academie: "Académie",
  location: "Locations",
};

export default async function Page() {
  const tarifs = await getTarifs();
  const categories = Object.keys(libellesCategories) as Tarif["categorie"][];

  return (
    <>
      <PageHero
        surtitre="Jouer ici"
        titre="Tarifs & réservation"
        chapo="Les montants ci-dessous sont provisoires : ils seront alimentés par l'API dès son ouverture."
      />
      <Container className="py-16">
        <div className="space-y-12">
          {categories.map((categorie) => {
            const lignes = tarifs.filter((tarif) => tarif.categorie === categorie);
            if (lignes.length === 0) return null;

            return (
              <section key={categorie}>
                <h2 className="font-display text-2xl text-club-950">
                  {libellesCategories[categorie]}
                </h2>
                <ul className="mt-6 divide-y divide-club-950/10 border-y border-club-950/10">
                  {lignes.map((tarif) => (
                    <li
                      key={tarif.id}
                      className="flex flex-wrap items-baseline justify-between gap-2 py-4"
                    >
                      <div>
                        <p className="text-base text-encre">{tarif.libelle}</p>
                        {tarif.detail ? (
                          <p className="text-sm text-encre/55">{tarif.detail}</p>
                        ) : null}
                      </div>
                      <p className="text-base text-club-800">
                        {formatPrix(tarif.prix)}
                        {tarif.prix > 0 && tarif.unite ? (
                          <span className="text-sm text-encre/55"> {tarif.unite}</span>
                        ) : null}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Container>
    </>
  );
}
