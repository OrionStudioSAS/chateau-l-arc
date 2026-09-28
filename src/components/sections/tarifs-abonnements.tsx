import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import {
  abonnements,
  avantagesMembres,
  noteAbonnements,
  tarifsMembres,
} from "@/lib/tarifs";
import { cn } from "@/lib/cn";

export function TarifsAbonnements({ annee }: { annee: number }) {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-or-600">Devenir membre</Surtitre>
          <h2 className="mt-6 font-butler text-[36px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            Abonnements annuels {annee}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] text-gris-500">
            Accès illimité au parcours · 8 invitations inter-clubs par mois ·
            réductions membres
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {abonnements.map((abonnement) => (
            <li
              key={abonnement.titre}
              className={cn(
                "relative h-fit rounded-lg px-6 py-7 text-center",
                abonnement.miseEnAvant
                  ? "bg-club-950 text-sable-50"
                  : "border border-club-950/10 bg-white",
              )}
            >
              {abonnement.etiquette ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-or-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                  {abonnement.etiquette}
                </span>
              ) : null}

              <p
                className={cn(
                  "text-[15px] font-medium",
                  abonnement.miseEnAvant ? "text-sable-50" : "text-encre",
                )}
              >
                {abonnement.titre}
              </p>

              <p className="mt-3 font-butler text-[34px] font-bold leading-none text-or-500">
                {abonnement.prix}
              </p>

              <p
                className={cn(
                  "mt-2 text-[13px]",
                  abonnement.miseEnAvant ? "text-sable-50/70" : "text-gris-500",
                )}
              >
                par an
              </p>

              {abonnement.precision ? (
                <p className="mt-2 text-[12px] leading-snug text-gris-500">
                  {abonnement.precision}
                </p>
              ) : null}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-[13px] text-gris-500">{noteAbonnements}</p>

        <div className="mt-12 grid gap-10 rounded-lg border border-club-950/10 px-8 py-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-or-600">
              Vos avantages membres
            </h3>

            <ul className="mt-5 space-y-3">
              {avantagesMembres.map((avantage) => (
                <li key={avantage} className="flex gap-3 text-[14px] text-encre/80">
                  <span aria-hidden="true" className="text-club-600">
                    ✓
                  </span>
                  <span>{avantage}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-or-600">
              Tarifs membres sur place
            </h3>

            <dl className="mt-5 divide-y divide-encre/10">
              {tarifsMembres.map((ligne) => (
                <div
                  key={ligne.libelle}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <dt className="text-[14px] text-encre/80">{ligne.libelle}</dt>
                  <dd className="text-[14px] font-semibold text-club-950">
                    {ligne.prix}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
