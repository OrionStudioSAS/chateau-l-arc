import Image from "next/image";

import { PictoAcademie } from "@/components/sections/academie-pictos";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { Editable } from "@/components/cms/editable";
import { ACADEMIE_PRESTIGE_IMAGE, ACADEMIE_PRESTIGE_SURTITRE, ACADEMIE_PRESTIGE_TEXTE, ACADEMIE_PRESTIGE_TITRE } from "@/constants";
import { atoutsPrestige, formulesPrestige, notePrestige } from "@/lib/academie";
import { cn } from "@/lib/cn";
import { euros } from "@/lib/tarifs";


export function AcademiePrestige() {
  return (
    <section id="prestige" className="scroll-mt-28 bg-white py-14 lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <Editable path="L'Académie · Formules Prestige.ACADEMIE_PRESTIGE_IMAGE" image as="div" className="relative aspect-[4/5] overflow-hidden rounded-sm lg:aspect-[3/4]">
            <Image
              src={ACADEMIE_PRESTIGE_IMAGE}
              alt="Cours collectif de golf au Château l'Arc"
              fill
              sizes="(min-width: 1024px) 26rem, 100vw"
              className="object-cover"
            />
          </Editable>

          <div>
            <Editable path="L'Académie · Formules Prestige.ACADEMIE_PRESTIGE_SURTITRE" as="div">
              <Surtitre aligne="gauche" className="text-or-600">
                {ACADEMIE_PRESTIGE_SURTITRE}
              </Surtitre>
            </Editable>
            <Editable path="L'Académie · Formules Prestige.ACADEMIE_PRESTIGE_TITRE" as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
              {ACADEMIE_PRESTIGE_TITRE}
            </Editable>
            <Editable path="L'Académie · Formules Prestige.ACADEMIE_PRESTIGE_TEXTE" as="p" className="mt-5 max-w-lg text-[15px] leading-relaxed text-encre/65">
              {ACADEMIE_PRESTIGE_TEXTE}
            </Editable>
            <ul className="mt-6 space-y-3">
              {atoutsPrestige.map((atout) => (
                <li key={atout.libelle} className="flex items-center gap-3 text-[14px] text-encre/80">
                  <span className="flex size-8 items-center justify-center rounded-full bg-sable-100 text-encre/60">
                    <PictoAcademie nom={atout.picto} />
                  </span>
                  {atout.libelle}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formulesPrestige.map((formule) => {
            const fonce = Boolean(formule.etiquette);
            return (
              <li
                key={formule.titre}
                className={cn(
                  "flex flex-col rounded-sm p-6 lg:p-7",
                  fonce ? "bg-club-950 text-sable-50" : "border border-encre/10 bg-white",
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-or-500">
                  {formule.titre}
                </p>
                {formule.etiquette ? (
                  <p className="mt-2 w-fit rounded-full bg-or-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                    {formule.etiquette}
                  </p>
                ) : null}
                <p className="mt-4 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-butler text-[40px] font-medium leading-none",
                      fonce ? "text-sable-50" : "text-club-950",
                    )}
                  >
                    {euros(formule.prix)}
                  </span>
                  <span className={cn("text-[13px]", fonce ? "text-sable-50/60" : "text-encre/50")}>
                    / mois
                  </span>
                </p>
                <p className={cn("mt-3 text-[14px] leading-relaxed", fonce ? "text-sable-50/80" : "text-encre/60")}>
                  {formule.description}
                </p>
                {formule.points ? (
                  <ul className="mt-3 space-y-1.5">
                    {formule.points.map((point) => (
                      <li key={point} className="flex gap-2 text-[13px] text-sable-50/85">
                        <span aria-hidden="true" className="text-or-400">
                          ✓
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[12px] text-encre/55">{notePrestige}</p>
      </Container>
    </section>
  );
}
