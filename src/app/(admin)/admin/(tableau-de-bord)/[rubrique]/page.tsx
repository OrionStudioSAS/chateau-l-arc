import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminEmptySection } from "@/components/admin/admin-empty-section";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { rubriquesAVenir } from "@/config/admin";

export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/admin/[rubrique]">): Promise<Metadata> {
  const { rubrique } = await params;
  const titre = rubriquesAVenir[rubrique]?.titre ?? "Back-office";
  return { title: { absolute: `${titre} · Back-office` } };
}

/** Rubriques de la navigation dont l'écran n'est pas encore maquetté. */
export default async function Page({ params }: PageProps<"/admin/[rubrique]">) {
  const { rubrique } = await params;
  const fiche = Object.hasOwn(rubriquesAVenir, rubrique) ? rubriquesAVenir[rubrique] : null;
  if (!fiche) notFound();

  return (
    <>
      <AdminPageHeader titre={fiche.titre} description={fiche.description} />
      <AdminEmptySection />
    </>
  );
}
