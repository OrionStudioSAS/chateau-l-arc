import type { Metadata } from "next";

import { OrionTranslate, type GroupeResume, type LangueResume } from "@/components/admin/traductions/orion-translate";
import { equipeOrion } from "@/config/admin";
import { lireEtatTraductions } from "@/lib/traductions/depot";
import { avancement, estARevoir, estTraduit } from "@/lib/traductions/textes";

export const metadata: Metadata = { title: { absolute: "Orion Translate · Back-office" } };

// Dernière version publiée des traductions (GitHub), lue à chaque ouverture.
export const instant = false;

/** Orion Translate (maquette) : langues du site, avancement et ajout d'une langue. */
export default async function Page() {
  const { langues, traductions, origines, groupes } = await lireEtatTraductions();
  const textes = groupes.flatMap((g) => g.textes);

  const resumes: LangueResume[] = langues.map((langue) => {
    if (langue.principale) return { ...langue, total: textes.length, traduits: textes.length, pourcentage: 100, aRevoir: 0 };
    const dico = traductions[langue.code];
    return {
      ...langue,
      ...avancement(groupes, dico),
      aRevoir: textes.filter((t) => estARevoir(t, dico, origines[langue.code])).length,
    };
  });

  const resumesGroupes: GroupeResume[] = groupes.map((g) => ({
    id: g.id,
    titre: g.titre,
    categorie: g.categorie,
    total: g.textes.length,
    traduits: Object.fromEntries(
      langues
        .filter((l) => !l.principale)
        .map((l) => [l.code, g.textes.filter((t) => estTraduit(t, traductions[l.code])).length]),
    ),
  }));

  return (
    <OrionTranslate
      langues={resumes}
      groupes={resumesGroupes}
      lienOrion={equipeOrion[0]?.ecrire ?? "https://orion-studio.io"}
    />
  );
}
