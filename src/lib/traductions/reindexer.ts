import type { FichierTraductions } from "@/lib/i18n";

/**
 * Une liste extensible de constants.ts (enseignants…) a perdu ou gagné des
 * éléments : les traductions « NOM.rang.cle » suivent leur élément.
 * `provenance[j]` est l'ancien rang du nouvel élément j (null : ajouté) ;
 * les traductions d'un élément retiré sont supprimées.
 *
 * Modifie `traductions` et `origines` en place ; vrai si quelque chose a changé.
 */
export function reindexerTraductions(
  nom: string,
  provenance: (number | null)[],
  traductions: FichierTraductions,
  origines: Record<string, Record<string, string>>,
): boolean {
  const motif = new RegExp(`^${nom}\\.(\\d+)\\.(.+)$`);
  let change = false;

  const deplacer = (table: Record<string, string> | undefined) => {
    if (!table) return;
    const deplaces: Record<string, string> = {};
    for (const [cle, texte] of Object.entries(table)) {
      const m = cle.match(motif);
      if (!m) continue;
      delete table[cle];
      const rang = provenance.indexOf(Number(m[1]));
      if (rang !== -1) deplaces[`${nom}.${rang}.${m[2]}`] = texte;
      if (rang !== Number(m[1])) change = true;
    }
    Object.assign(table, deplaces);
  };

  for (const dico of Object.values(traductions)) deplacer(dico.constantes);
  for (const table of Object.values(origines)) deplacer(table);
  return change;
}
