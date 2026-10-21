import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditeurTraductions } from "@/components/admin/traductions/editeur-traductions";
import { equipeOrion } from "@/config/admin";
import { lireEtatTraductions } from "@/lib/traductions/depot";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/admin/orion-translate/[langue]">): Promise<Metadata> {
  const { langue } = await params;
  return { title: { absolute: `Traduction (${langue}) · Orion Translate · Back-office` } };
}

/** « Gérer » une langue : traduction champ par champ, rubrique par rubrique. */
export default async function Page({ params, searchParams }: PageProps<"/admin/orion-translate/[langue]">) {
  const [{ langue: code }, { groupe }] = await Promise.all([params, searchParams]);
  const { langues, traductions, origines, groupes } = await lireEtatTraductions();
  const langue = langues.find((l) => l.code === code && !l.principale);
  if (!langue) notFound();

  return (
    <EditeurTraductions
      langue={langue}
      groupes={groupes}
      dico={traductions[code] ?? { constantes: {}, interface: {} }}
      origines={origines[code] ?? {}}
      groupeInitial={typeof groupe === "string" ? groupe : null}
      lienOrion={equipeOrion[0]?.ecrire ?? "https://orion-studio.io"}
    />
  );
}
