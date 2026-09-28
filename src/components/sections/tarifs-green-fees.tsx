import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { carnets, greenFees } from "@/lib/tarifs";
import { cn } from "@/lib/cn";

export function TarifsGreenFees() {
  return (
    <section className="bg-sable-100 py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-or-600">Visiteurs</Surtitre>
          <h2 className="mt-6 font-butler text-[36px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            Green fees
          </h2>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {greenFees.map((formule) => (
            <li
              key={formule.titre}
              className={cn(
                "rounded-lg px-8 py-8 text-center",
                formule.miseEnAvant ? "bg-club-950 text-sable-50" : "bg-white",
              )}
            >
              <p
                className={cn(
                  "text-[15px] font-medium",
                  formule.miseEnAvant ? "text-sable-50" : "text-encre",
                )}
              >
                {formule.titre}
              </p>

              <p className="mt-4 font-butler text-[44px] font-bold leading-none text-or-500">
                {formule.prix}
              </p>

              <p
                className={cn(
                  "mt-4 text-[13px]",
                  formule.miseEnAvant ? "text-sable-50/70" : "text-gris-500",
                )}
              >
                {formule.precision}
              </p>

              <Link
                href="/reserver"
                className={cn(
                  "mt-6 inline-block rounded-lg px-6 py-3 text-[15px] font-medium transition-colors",
                  formule.miseEnAvant
                    ? "bg-or-500 text-white hover:bg-or-600"
                    : "bg-club-950 text-sable-50 hover:bg-club-800",
                )}
              >
                Réserver
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-20 text-center">
          <Surtitre className="text-or-600">La bonne affaire</Surtitre>
          <h2 className="mt-6 font-butler text-[36px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            Carnets de green fees
          </h2>
          <p className="mt-4 text-[15px] text-gris-500">
            Valables 12 mois · nominatifs · réservés aux particuliers
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {carnets.map((carnet) => (
            <li
              key={`${carnet.parcours}-${carnet.offre}`}
              className="rounded-lg border border-or-500/30 bg-white px-8 py-8 text-center"
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-or-600">
                {carnet.parcours}
              </p>
              <p className="mt-3 text-[15px] font-medium text-encre">{carnet.offre}</p>
              <p className="mt-4 font-butler text-[40px] font-bold leading-none text-or-500">
                {carnet.prix}
              </p>
              <p className="mt-3 text-[13px] text-gris-500">{carnet.unitaire}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
