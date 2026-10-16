import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditeurVisuel } from "@/components/admin/pages/editeur";
import { pagesCms } from "@/config/pages-cms";
import { analyser, CHEMIN_CONSTANTES } from "@/lib/cms/constantes";
import { depotConfigure, lireTexte } from "@/lib/contenu/depot";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/admin/pages/[page]">): Promise<Metadata> {
  const { page } = await params;
  const fiche = pagesCms.find((p) => p.cle === page);
  return { title: { absolute: `${fiche?.titre ?? "Page"} · Pages · Back-office` } };
}

/** Éditeur visuel d'une page : la dernière version publiée de constants.ts fait foi. */
export default async function Page({ params }: PageProps<"/admin/pages/[page]">) {
  const { page } = await params;
  const fiche = pagesCms.find((p) => p.cle === page);
  if (!fiche) notFound();

  const contenu =
    (depotConfigure() ? await lireTexte(CHEMIN_CONSTANTES) : null) ??
    (await readFile(path.join(/* turbopackIgnore: true */ process.cwd(), CHEMIN_CONSTANTES), "utf8").catch(() => ""));

  return <EditeurVisuel page={fiche} sections={analyser(contenu)} />;
}
