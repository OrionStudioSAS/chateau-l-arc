import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact & accès",
  description: `Coordonnées, horaires et accès au ${site.name}.`,
};

export default function Page() {
  return (
    <>
      <PageHero
        surtitre="Nous joindre"
        titre="Contact & accès"
        chapo="Accueil, réservations, séminaires : une seule adresse pour toutes vos demandes."
      />
      <Container className="grid gap-12 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-club-950">Coordonnées</h2>
          <address className="mt-6 space-y-3 text-base not-italic leading-relaxed text-encre/75">
            <p>
              {site.contact.adresse}
              <br />
              {site.contact.codePostalVille}
            </p>
            <p>
              <a className="text-club-800 underline-offset-4 hover:underline" href={`tel:${site.contact.telephone.replace(/[^+\d]/g, "")}`}>
                {site.contact.telephone}
              </a>
            </p>
            <p>
              <a className="text-club-800 underline-offset-4 hover:underline" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </p>
          </address>
        </div>
        <div className="rounded-3xl border border-dashed border-club-950/20 bg-sable-100/60 px-8 py-14 text-center">
          <p className="font-display text-2xl text-club-950">Formulaire à venir</p>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-encre/60">
            Le formulaire de contact sera branché sur l&apos;API dès que l&apos;endpoint
            d&apos;envoi sera défini.
          </p>
        </div>
      </Container>
    </>
  );
}
