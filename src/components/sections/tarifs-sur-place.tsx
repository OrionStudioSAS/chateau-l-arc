import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { surPlace } from "@/lib/tarifs";

export function TarifsSurPlace() {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-or-600">Sur place</Surtitre>
          <h2 className="mt-6 font-butler text-[36px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            Locations &amp; practice
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {surPlace.map((bloc) => (
            <section
              key={bloc.titre}
              className="h-fit rounded-lg bg-sable-100 px-6 py-6"
            >
              <h3 className="text-[15px] font-semibold text-club-950">{bloc.titre}</h3>

              <dl className="mt-4 divide-y divide-encre/10">
                {bloc.lignes.map((ligne) => (
                  <div
                    key={ligne.libelle}
                    className="flex items-baseline justify-between gap-4 py-3"
                  >
                    <dt className="text-[14px] text-encre/80">{ligne.libelle}</dt>
                    <dd className="text-[14px] font-semibold text-club-950">
                      {ligne.prix}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </Container>
    </section>
  );
}
