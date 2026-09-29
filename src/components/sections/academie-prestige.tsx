import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { formulesPrestige, notePrestige } from "@/lib/academie";
import { cn } from "@/lib/cn";

export function AcademiePrestige() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-or-600">École de golf adultes</Surtitre>

          <h2 className="mt-6 font-butler text-[36px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            Les formules Prestige
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-[15px] text-gris-500">
            Cours collectifs (6 personnes max.) · 1h par jour · lundi, mardi, jeudi et
            vendredi · -10% pour les membres
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {formulesPrestige.map((formule) => (
            <li
              key={formule.titre}
              className={cn(
                "relative h-fit rounded-lg px-6 py-7 text-center",
                formule.miseEnAvant ? "bg-club-950 text-sable-50" : "bg-sable-100",
              )}
            >
              {formule.etiquette ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-or-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                  {formule.etiquette}
                </span>
              ) : null}

              <p
                className={cn(
                  "text-[15px] font-medium",
                  formule.miseEnAvant ? "text-sable-50" : "text-encre",
                )}
              >
                {formule.titre}
              </p>

              <p className="mt-3 font-butler text-[34px] font-bold leading-none text-or-500">
                {formule.prix}
              </p>

              <p
                className={cn(
                  "mt-2 text-[13px]",
                  formule.miseEnAvant ? "text-sable-50/70" : "text-gris-500",
                )}
              >
                {formule.periode}
              </p>

              <p
                className={cn(
                  "mt-3 text-[13px] leading-relaxed",
                  formule.miseEnAvant ? "text-sable-50/80" : "text-gris-500",
                )}
              >
                {formule.description}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-[13px] text-gris-500">{notePrestige}</p>
      </Container>
    </section>
  );
}
