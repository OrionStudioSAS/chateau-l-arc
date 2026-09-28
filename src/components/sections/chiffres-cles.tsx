import { Container } from "@/components/ui/container";

/**
 * Un chiffre clé. Le libellé est découpé en lignes explicites plutôt que laissé
 * au retour à la ligne automatique, pour que la coupure ne dépende pas de la
 * largeur de colonne. La seconde ligne est facultative.
 */
export type ChiffreCle = {
  valeur: string;
  ligne1: string;
  ligne2?: string;
};

/**
 * Jeu par défaut, affiché sous la bannière de l'accueil.
 * TODO : basculer sur la couche contenu si le club doit pouvoir les éditer.
 */
const chiffresAccueil: ChiffreCle[] = [
  { valeur: "1985", ligne1: "Création du", ligne2: "parcours" },
  { valeur: "18 trous", ligne1: "Parcours signés", ligne2: "Robert Trent Jones" },
  { valeur: "15 min", ligne1: "Depuis", ligne2: "Aix-en-Provence" },
  { valeur: "5 817 m", ligne1: "Longueur", ligne2: "de jeu" },
];

export function ChiffresCles({
  chiffres = chiffresAccueil,
}: {
  chiffres?: ChiffreCle[];
}) {
  return (
    <section>
      {/*
        À partir de lg, rangée répartie d'un bord à l'autre plutôt que quatre
        colonnes égales : le contenu étant aligné à gauche dans sa colonne, la
        dernière laissait un vide à droite et l'ensemble paraissait décalé.
      */}
      <Container className="grid gap-x-8 gap-y-12 py-20 sm:grid-cols-2 lg:flex lg:justify-between">
        {chiffres.map((chiffre) => (
          <div key={chiffre.valeur}>
            <p className="font-butler text-[56px] font-medium leading-none tracking-[-1px] text-encre">
              {chiffre.valeur}
            </p>
            <span aria-hidden="true" className="mt-5 block h-0.5 w-7 bg-or-500" />
            <p className="mt-4 text-[13px] font-normal uppercase leading-[1.7] text-encre/55">
              <span className="block">{chiffre.ligne1}</span>
              {chiffre.ligne2 ? <span className="block">{chiffre.ligne2}</span> : null}
            </p>
          </div>
        ))}
      </Container>
    </section>
  );
}
