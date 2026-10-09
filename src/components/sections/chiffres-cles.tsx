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
  { valeur: "18 trous", ligne1: "Par 70" },
  { valeur: "5 817 m", ligne1: "Longueur" },
  { valeur: "R. T. Jones II", ligne1: "Architecte" },
  { valeur: "1985", ligne1: "Création" },
  { valeur: "15 min", ligne1: "D'Aix-en-Provence" },
];

export function ChiffresCles({
  chiffres = chiffresAccueil,
  variante = "colonnes",
}: {
  chiffres?: ChiffreCle[];
  /**
   * « colonnes » : grands chiffres alignés à gauche, avec filet doré (page
   * Parcours). « bande » : bandeau sable compact, chiffres centrés (accueil).
   */
  variante?: "colonnes" | "bande";
}) {
  if (variante === "bande") {
    return (
      <section className="bg-sable-100">
        <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 text-center sm:grid-cols-3 lg:flex lg:justify-between lg:py-9">
          {chiffres.map((chiffre, index) => (
            <div
              key={chiffre.valeur}
              // Cinquième chiffre seul sur sa rangée en mobile : centré sur deux colonnes.
              className={index === chiffres.length - 1 && chiffres.length % 2 ? "col-span-2 sm:col-span-1" : undefined}
            >
              <p className="whitespace-nowrap font-butler text-[24px] font-medium leading-none tracking-[-0.5px] text-encre min-[400px]:text-[28px] sm:text-[34px]">
                {chiffre.valeur}
              </p>
              <p className="mt-2.5 text-[11px] font-normal uppercase tracking-[0.14em] text-encre/50">
                {chiffre.ligne1}
                {chiffre.ligne2 ? ` ${chiffre.ligne2}` : null}
              </p>
            </div>
          ))}
        </Container>
      </section>
    );
  }

  return (
    <section>
      {/*
        À partir de lg, rangée répartie d'un bord à l'autre plutôt que quatre
        colonnes égales : le contenu étant aligné à gauche dans sa colonne, la
        dernière laissait un vide à droite et l'ensemble paraissait décalé.
      */}
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:gap-x-8 sm:gap-y-12 lg:flex lg:justify-between lg:py-20">
        {chiffres.map((chiffre) => (
          <div key={chiffre.valeur}>
            <p className="font-butler text-[36px] font-medium leading-none tracking-[-1px] text-encre min-[400px]:text-[42px] sm:text-[56px]">
              {chiffre.valeur}
            </p>
            <span aria-hidden="true" className="mt-4 block h-0.5 w-7 bg-or-500 sm:mt-5" />
            <p className="mt-3 text-[12px] font-normal uppercase leading-[1.7] text-encre/55 sm:mt-4 sm:text-[13px]">
              <span className="block">{chiffre.ligne1}</span>
              {chiffre.ligne2 ? <span className="block">{chiffre.ligne2}</span> : null}
            </p>
          </div>
        ))}
      </Container>
    </section>
  );
}
