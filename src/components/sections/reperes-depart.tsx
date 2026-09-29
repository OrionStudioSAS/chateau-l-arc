import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { REPERES } from "@/lib/reperes";

/** Publics et distances par repère. Les couleurs viennent de lib/reperes. */
const details: Record<string, { distance: string; public: string }> = {
  blanc: { distance: "5\u202f817\u00a0m", public: "Compétition messieurs" },
  jaune: { distance: "~5\u202f400\u00a0m", public: "Messieurs" },
  bleu: { distance: "~5\u202f200\u00a0m", public: "Compétition dames" },
  rouge: { distance: "~4\u202f700\u00a0m", public: "Dames" },
  violet: { distance: "~4\u202f700\u00a0m", public: "Seniors · loisir" },
  orange: { distance: "~3\u202f500\u00a0m", public: "Débutants · jeunes" },
};

export function ReperesDepart() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="text-center">
          <Surtitre filet="gris" className="text-encre/60">
            Six repères de départ
          </Surtitre>

          <h2 className="mt-6 font-butler text-[40px] font-medium leading-[1.1] text-club-950 sm:text-[64px]">
            Un parcours pour chaque niveau
          </h2>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {REPERES.map((repere) => (
            <li
              key={repere.nom}
              className="rounded-lg bg-sable-100 px-4 py-6 text-center"
            >
              <span
                aria-hidden="true"
                className={`mx-auto block size-[22px] rounded-full ${
                  "bordure" in repere ? "ring-1 ring-inset ring-encre/15" : ""
                }`}
                style={{ backgroundColor: repere.couleur }}
              />

              <p className="mt-4 text-[16px] font-semibold text-club-950">
                {repere.nom}
              </p>

              <p className="mt-3 font-butler text-[24px] font-medium leading-none text-club-950">
                {details[repere.cle].distance}
              </p>

              <p className="mt-3 text-[13px] font-normal text-gris-500">
                {details[repere.cle].public}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-[15px] font-normal text-gris-500">
          Slope et SSS par repère disponibles sur la carte de score
        </p>
      </Container>
    </section>
  );
}
