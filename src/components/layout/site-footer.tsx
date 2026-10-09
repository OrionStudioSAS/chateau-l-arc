import Link from "next/link";

import {
  liensInstitutionnels,
  liensLegaux,
  reseaux,
  servicesContact,
  site,
} from "@/config/site";

const lienPied =
  "text-[15px] text-sable-50/85 underline-offset-4 transition-colors hover:text-sable-50 hover:underline";

const telSansEspaces = (numero: string) => numero.replace(/[^+\d]/g, "");

export function SiteFooter() {
  return (
    <footer className="bg-club-800 text-sable-50">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
              <ul className="space-y-3">
                {reseaux.map((reseau) => (
                  <li key={reseau.label}>
                    {reseau.url ? (
                      <a
                        href={reseau.url}
                        rel="noreferrer noopener"
                        target="_blank"
                        className={lienPied}
                      >
                        {reseau.label}
                      </a>
                    ) : (
                      // TODO : lien inactif tant que l'URL du compte n'est pas fournie.
                      <span className="text-[15px] text-sable-50/50">
                        {reseau.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <ul className="space-y-3">
                {liensInstitutionnels.map((lien) => (
                  <li key={lien.href}>
                    <Link href={lien.href} className={lienPied}>
                      {lien.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-3">
                {liensLegaux.map((lien) => (
                  <li key={lien.href}>
                    <Link href={lien.href} className={lienPied}>
                      {lien.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* TODO : remplacer par la carte définitive (capture statique ou
                composant cartographique), pour éviter un embed tiers ici. */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${site.contact.adresse} ${site.contact.codePostalVille}`,
              )}`}
              rel="noreferrer noopener"
              target="_blank"
              className="mt-8 flex h-[180px] max-w-[375px] sm:h-[225px] items-center justify-center rounded-sm border border-sable-50/20 bg-sable-50/5 px-6 text-center text-sm text-sable-50/70 transition-colors hover:border-sable-50/40 hover:text-sable-50"
            >
              Voir le domaine sur la carte
            </a>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {servicesContact.map((service) => (
                <div
                  key={service.nom}
                  className="rounded-sm border border-sable-50/25 px-5 py-4 sm:py-5"
                >
                  <p className="text-[19px] font-semibold">{service.nom}</p>
                  <p className="mt-2 text-[15px] text-sable-50/85 sm:mt-4">
                    {service.horaires}
                  </p>
                  <p className="mt-2 text-[15px] text-sable-50/85 sm:mt-4">
                    <a
                      href={`tel:${telSansEspaces(service.telephone)}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {service.telephone}
                    </a>
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-sm bg-sauge-200 px-6 py-6 text-club-950">
              <p className="text-[20px] font-bold uppercase tracking-[0.02em]">
                Devenir membre
              </p>

              <address className="mt-6 text-[15px] not-italic leading-relaxed text-club-950/80">
                {site.contact.adresse}
                <br />
                {site.contact.codePostalVille}
              </address>

              {/* Téléphone et e-mail l'un sous l'autre en mobile : l'adresse
                  e-mail, longue, ne se coupe plus au milieu de la ligne. */}
              <p className="mt-6 flex flex-col gap-2 text-[15px] text-club-950/80 sm:flex-row sm:flex-wrap sm:gap-x-2">
                <a
                  href={site.contact.telephoneLien}
                  className="self-start underline underline-offset-4"
                >
                  {site.contact.telephone}
                </a>
                <span aria-hidden="true" className="hidden sm:inline">
                  -
                </span>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="self-start break-all underline underline-offset-4"
                >
                  {site.contact.email}
                </a>
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={site.contact.telephoneLien}
                  className="rounded-sm bg-club-950 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.06em] text-sable-50 transition-colors hover:bg-club-800"
                >
                  Nous appeler
                </a>
                <Link
                  href="/devenir-membre"
                  className="rounded-sm bg-white px-5 py-3 text-[12px] font-medium uppercase tracking-[0.06em] text-club-950 transition-colors hover:bg-sable-50"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 max-w-3xl lg:max-w-none text-[14px] font-medium uppercase tracking-[-0.14px] text-sable-50/70 sm:text-[17px] lg:text-[20px] lg:tracking-[-0.2px]">
          {site.heroAccroche}
        </p>

        {/* Même calage que la bannière : le titre occupe toute la largeur. */}
        <div className="@container mt-4">
          <p className="whitespace-nowrap font-butler text-[11cqw] font-bold uppercase leading-[0.86] tracking-[2px] text-sable-50/35">
            Chateau l’Arc
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-[15px] text-sable-50/85">
          <p>Château L&apos;Arc - Golf Club Provence</p>
          <p>
            <span aria-hidden="true" className="text-or-500">
              ♥
            </span>{" "}
            Design &amp; Made by Orion
          </p>
        </div>
      </div>
    </footer>
  );
}
