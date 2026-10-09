import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { headerActions } from "@/config/site";
import { cn } from "@/lib/cn";
import { proprietesLien } from "@/lib/liens";
import {
  carnets,
  euros,
  greenFees,
  locations,
  practice,
  type LigneLocation,
} from "@/lib/tarifs";

/** Ancre de section : décalée sous l'en-tête collant lors d'un saut. */
const ancre = "scroll-mt-28";

function TableauTarifs({ lignes, legende }: { lignes: LigneLocation[]; legende: string }) {
  return (
    <table className="w-full text-[14px]">
      <caption className="sr-only">{legende}</caption>
      <thead>
        <tr className="border-b border-encre/70 text-[11px] uppercase tracking-[0.14em]">
          <th scope="col" className="pb-3 text-left font-normal">
            <span className="sr-only">Prestation</span>
          </th>
          <th scope="col" className="w-24 pb-3 text-right font-normal text-encre/50 sm:w-32">
            Visiteurs
          </th>
          <th scope="col" className="w-24 pb-3 text-right font-semibold text-club-600 sm:w-32">
            Membres
          </th>
        </tr>
      </thead>
      <tbody>
        {lignes.map((ligne) => (
          <tr key={ligne.libelle} className="border-b border-encre/10 last:border-0">
            <th scope="row" className="py-4 text-left font-normal text-encre/85">
              {ligne.libelle}
            </th>
            <td className="py-4 text-right font-semibold text-encre">{euros(ligne.visiteurs)}</td>
            <td className="py-4 text-right font-semibold text-club-600">
              {ligne.membres === null ? (
                <>
                  <span aria-hidden="true" className="text-encre/30">
                    —
                  </span>
                  <span className="sr-only">Pas de tarif membre</span>
                </>
              ) : (
                euros(ligne.membres)
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Green fees, carnets, puis locations et practice (tarifs visiteurs et membres). */
export function TarifsGreenFees() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div id="green-fees" className={ancre}>
          <Surtitre aligne="gauche" className="text-or-600">
            Green fees
          </Surtitre>

          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {greenFees.map((formule) => {
              const fonce = Boolean(formule.miseEnAvant);
              return (
                <li
                  key={formule.libelle}
                  className={cn(
                    "flex flex-col rounded-sm p-7 lg:p-8",
                    fonce ? "bg-club-950 text-sable-50" : "border border-encre/10 bg-white",
                  )}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-or-500">
                    {formule.libelle}
                  </p>
                  <p className="mt-4 flex items-baseline gap-2">
                    <span
                      className={cn(
                        "font-butler text-[48px] font-medium leading-none",
                        fonce ? "text-sable-50" : "text-club-950",
                      )}
                    >
                      {euros(formule.prix)}
                    </span>
                    <span className={cn("text-[13px]", fonce ? "text-sable-50/60" : "text-encre/50")}>
                      / joueur
                    </span>
                  </p>
                  <p className={cn("mt-3 flex-1 text-[14px]", fonce ? "text-sable-50/80" : "text-encre/65")}>
                    {formule.detail}
                  </p>
                  <Link
                    href={headerActions.reservation.href}
                    {...proprietesLien(headerActions.reservation.href)}
                    className={cn(
                      "mt-6 flex items-center justify-center gap-2 rounded-sm px-5 py-3.5 text-[13px] font-semibold transition-colors",
                      fonce
                        ? "bg-or-500 text-white hover:bg-or-600"
                        : "border border-club-950/25 text-club-950 hover:bg-sable-50",
                    )}
                  >
                    Réserver un départ <span aria-hidden="true">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div id="carnets" className={cn("mt-16 lg:mt-20", ancre)}>
          <Surtitre aligne="gauche" className="text-or-600">
            Carnets · valables 12 mois
          </Surtitre>

          <ul className="mt-8 divide-y divide-encre/10 rounded-sm border border-encre/10 px-6 sm:px-8">
            {carnets.map((carnet) => (
              <li
                key={carnet.titre}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-6"
              >
                <div>
                  <p className="font-butler text-[22px] font-medium leading-tight text-club-950 sm:text-[26px]">
                    {carnet.titre}
                  </p>
                  <p className="mt-1 text-[13px] text-encre/55">{carnet.offre}</p>
                </div>
                <p className="flex items-baseline gap-4">
                  <span className="text-[12px] text-encre/50">
                    soit {euros(carnet.parPartie)} la partie
                  </span>
                  <span className="font-butler text-[28px] font-medium text-club-950 sm:text-[32px]">
                    {euros(carnet.prix)}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div id="locations" className={cn("mt-16 lg:mt-20", ancre)}>
          <Surtitre aligne="gauche" className="text-or-600">
            Locations &amp; practice
          </Surtitre>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-20">
            <TableauTarifs lignes={locations} legende="Locations : voiturettes, chariot et matériel" />
            <TableauTarifs lignes={practice} legende="Practice : seaux de balles" />
          </div>
        </div>
      </Container>
    </section>
  );
}
