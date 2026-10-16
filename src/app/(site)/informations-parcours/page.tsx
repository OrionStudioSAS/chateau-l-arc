import type { Metadata } from "next";

import { ListeStatut } from "@/components/layout/liste-statut";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { getStatutInstallations } from "@/lib/api/content";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "État du parcours aujourd'hui",
  description: "Parcours, practice, voiturettes, restaurant : l'état des installations du golf de Château l'Arc, mis à jour chaque matin par l'accueil du club.",
  chemin: "/informations-parcours",
});

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
