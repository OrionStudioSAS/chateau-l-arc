import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { Editable } from "@/components/cms/editable";
import { REPERES_DETAILS, REPERES_NOTE, REPERES_SURTITRE, REPERES_TITRE } from "@/constants";
import { REPERES } from "@/lib/reperes";

const SECTION = "Le parcours · Repères de départ";

export function ReperesDepart() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="text-center">
          <Editable path={`${SECTION}.REPERES_SURTITRE`} as="div">
            <Surtitre filet="gris" className="text-encre/60">
              {REPERES_SURTITRE}
            </Surtitre>
          </Editable>

          <Editable path={`${SECTION}.REPERES_TITRE`} as="h2" className="mt-6 font-butler text-[40px] font-medium leading-[1.1] text-club-950 sm:text-[64px]">
            {REPERES_TITRE}
          </Editable>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {REPERES.map((repere, index) => (
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

              <Editable path={`${SECTION}.REPERES_DETAILS.${index}.distance`} as="p" className="mt-3 font-butler text-[24px] font-medium leading-none text-club-950">
                {REPERES_DETAILS[index]?.distance}
              </Editable>

              <Editable path={`${SECTION}.REPERES_DETAILS.${index}.public`} as="p" className="mt-3 text-[13px] font-normal text-gris-500">
                {REPERES_DETAILS[index]?.public}
              </Editable>
            </li>
          ))}
        </ul>

        <Editable path={`${SECTION}.REPERES_NOTE`} as="p" className="mt-8 text-center text-[15px] font-normal text-gris-500">
          {REPERES_NOTE}
        </Editable>
      </Container>
    </section>
  );
}
