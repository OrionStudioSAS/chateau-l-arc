import { historique, lireTexte } from "@/lib/contenu/depot";
import { cheminsContenu, type FichierStatut } from "@/lib/contenu/stockage";

export type EntreeHistorique = { date: string; changements: string[] };

/**
 * Dernières publications de contenu/statut.json qui concernent un écran.
 * Le statut des installations et le bandeau partagent ce fichier : chaque
 * écran ne garde que les versions où ses propres champs ont changé.
 */
export async function historiqueStatut(
  differences: (avant: FichierStatut, apres: FichierStatut) => string[],
  nombre = 10,
): Promise<EntreeHistorique[]> {
  const commits = await historique(cheminsContenu.statut, 30);
  const versions = await Promise.all(
    commits.map(async (commit) => {
      const texte = await lireTexte(cheminsContenu.statut, commit.sha);
      return texte ? (JSON.parse(texte) as FichierStatut) : null;
    }),
  );

  const entrees: EntreeHistorique[] = [];
  commits.forEach((commit, i) => {
    const version = versions[i];
    if (!version || entrees.length >= nombre) return;
    const precedente = versions[i + 1];
    // Version la plus ancienne lue : rien à comparer, on ne l'affiche que si
    // c'est vraiment la première publication du fichier.
    if (!precedente) {
      if (i === commits.length - 1 && commits.length < 30) {
        entrees.push({ date: commit.date, changements: ["Publication initiale"] });
      }
      return;
    }
    const changements = differences(precedente, version);
    if (changements.length) entrees.push({ date: commit.date, changements });
  });
  return entrees;
}
