import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { abonnements, euros, remiseComptant } from "@/lib/tarifs";

/** Abonnements annuels, avec le prix remisé en paiement comptant. */
export function TarifsAbonnements({ annee }: { annee: number }) {
  const pourcentage = Math.round(remiseComptant.taux * 100);

  return (
    <section id="abonnements" className="scroll-mt-28 bg-sable-100 py-14 lg:py-20">
      <Container>
        <Surtitre aligne="gauche" className="text-or-600">
          Abonnements {annee}
        </Surtitre>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <h2 className="font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            Devenez membre du club
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <p className="rounded-sm bg-or-500 px-4 py-2.5 text-[13px] font-medium text-white">
              −{pourcentage}&nbsp;% en paiement comptant jusqu&apos;au {remiseComptant.jusquau}
            </p>
            <a
              href={site.contact.telephoneLien}
              className="flex items-center gap-2 rounded-sm border border-club-950/25 bg-white px-4 py-2.5 text-[13px] font-semibold text-club-950 transition-colors hover:bg-sable-50"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              >
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
              Nous appeler
            </a>
          </div>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {abonnements.map((abonnement) => {
            const fonce = Boolean(abonnement.miseEnAvant);
            return (
              <li
                key={abonnement.titre}
                className={cn(
                  "rounded-sm px-6 py-6 lg:px-8",
                  fonce ? "bg-club-950 text-sable-50" : "bg-white",
                )}
              >
                <p className={cn("text-[14px] font-semibold", fonce ? "text-sable-50" : "text-club-950")}>
                  {abonnement.titre}
                </p>
                <p className="mt-3 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-butler text-[34px] font-medium leading-none",
                      fonce ? "text-sable-50" : "text-club-950",
                    )}
                  >
                    {euros(abonnement.prix)}
                  </span>
                  <span className={cn("text-[13px]", fonce ? "text-sable-50/60" : "text-encre/50")}>
                    / an
                  </span>
                </p>
                <p className={cn("mt-2 text-[12px]", fonce ? "text-or-400" : "text-or-600")}>
                  soit {euros(Math.round(abonnement.prix * (1 - remiseComptant.taux)))} en paiement
                  comptant
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
