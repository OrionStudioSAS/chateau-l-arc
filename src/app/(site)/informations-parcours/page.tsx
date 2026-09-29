import type { Metadata } from "next";

import { ListeStatut } from "@/components/layout/liste-statut";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { getStatutInstallations } from "@/lib/api/content";

export const metadata: Metadata = {
  title: "Informations sur le parcours",
  description:
    "État du parcours, du practice et des installations du Golf Château l'Arc, mis à jour par l'accueil du club.",
};

export default async function Page() {
  const statut = await getStatutInstallations();

  return (
    <>
      <PageHero
        surtitre="Conditions du jour"
        titre="Informations sur le parcours"
        chapo="État du parcours et des installations, mis à jour par l'accueil du club."
      />

      <Container className="py-14 lg:py-20">
        <div className="mx-auto max-w-xl overflow-hidden rounded-xl bg-white shadow-[0_2px_18px_rgba(16,24,40,0.07)]">
          <ListeStatut installations={statut} />
        </div>
      </Container>
    </>
  );
}
