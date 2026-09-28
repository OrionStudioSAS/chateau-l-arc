import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { formulesJuniors, noteJuniors } from "@/lib/academie";

export function AcademieJuniors() {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-or-600">École de golf juniors</Surtitre>

          <h2 className="mt-6 font-butler text-[36px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            Le golf dès 4 ans
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-[15px] text-gris-500">
            Le mercredi et le samedi · Groupes de 8 élèves maximum · Polo du club
            inclus · 30 séances par an
          </p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-3xl gap-5 md:grid-cols-2">
          {formulesJuniors.map((formule) => (
            <li
              key={formule.titre}
              className="rounded-lg bg-white px-8 py-8 text-center"
            >
              <p className="text-[15px] font-medium text-encre">{formule.titre}</p>

              <p className="mt-4 font-butler text-[34px] font-bold leading-none text-or-500">
                {formule.prix}
              </p>

              <p className="mt-3 text-[14px] font-medium text-encre">
                {formule.rythme}
              </p>

              <p className="mt-3 text-[13px] leading-relaxed text-gris-500">
                {formule.description}
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-block rounded-lg bg-club-950 px-6 py-3 text-[15px] font-medium text-sable-50 transition-colors hover:bg-club-800"
              >
                Inscrire mon enfant
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-[13px] text-gris-500">{noteJuniors}</p>
      </Container>
    </section>
  );
}
