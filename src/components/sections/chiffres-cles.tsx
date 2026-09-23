import { Container } from "@/components/ui/container";

/**
 * Chiffres clés affichés sous la bannière.
 * TODO : basculer sur la couche contenu si le club doit pouvoir les éditer.
 * Les libellés sont découpés en deux lignes comme sur la maquette, plutôt que
 * laissés au retour à la ligne automatique.
 */
const chiffres = [
  { valeur: "1985", ligne1: "Création du", ligne2: "parcours" },
  { valeur: "18 trous", ligne1: "Parcours signés", ligne2: "Robert Trent Jones" },
  { valeur: "15 min", ligne1: "Depuis", ligne2: "Aix-en-Provence" },
  { valeur: "5 817 m", ligne1: "Longueur", ligne2: "de jeu" },
];

export function ChiffresCles() {
  return (
    <section>
      <Container className="grid gap-x-8 gap-y-12 py-20 sm:grid-cols-2 lg:grid-cols-4">
        {chiffres.map((chiffre) => (
          <div key={chiffre.valeur}>
            <p className="font-butler text-[56px] font-medium leading-none tracking-[-1px] text-encre">
              {chiffre.valeur}
            </p>
            <span aria-hidden="true" className="mt-5 block h-0.5 w-7 bg-or-500" />
            <p className="mt-4 text-[13px] font-normal uppercase leading-[1.7] text-encre/55">
              <span className="block">{chiffre.ligne1}</span>
              <span className="block">{chiffre.ligne2}</span>
            </p>
          </div>
        ))}
      </Container>
    </section>
  );
}
