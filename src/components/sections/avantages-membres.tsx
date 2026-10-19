import Image from "next/image";
import { Lien as Link } from "@/components/ui/lien";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { pagesAVenir, site } from "@/config/site";
import { Editable } from "@/components/cms/editable";
import { i18n } from "@/lib/i18n/serveur";

const SECTION = "Tarifs · Avantages membres";

export async function AvantagesMembres() {
  const { T, tr } = await i18n();
  const { AVANTAGES_IMAGE, AVANTAGES_LISTE, AVANTAGES_SURTITRE, AVANTAGES_TITRE } = T;
  return (
    <section id="avantages" className="scroll-mt-28 bg-white py-14 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <Editable path={`${SECTION}.AVANTAGES_SURTITRE`} as="div">
            <Surtitre aligne="gauche" className="text-or-600">
              {AVANTAGES_SURTITRE}
            </Surtitre>
          </Editable>
          <Editable path={`${SECTION}.AVANTAGES_TITRE`} as="h2" className="mt-5 max-w-lg font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            {AVANTAGES_TITRE}
          </Editable>

          <ul className="mt-8 space-y-4">
            {AVANTAGES_LISTE.map((avantage, index) => (
              <li key={index} className="flex items-center gap-4 text-[15px] text-encre/80">
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sable-100 text-[12px] text-club-950"
                >
                  ✓
                </span>
                <Editable path={`${SECTION}.AVANTAGES_LISTE.${index}`}>{avantage}</Editable>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={pagesAVenir.devenirMembre}
              className="inline-flex items-center gap-2 rounded-sm bg-club-950 px-6 py-3.5 text-[13px] font-semibold text-sable-50 transition-colors hover:bg-club-800"
            >
              Demander une adhésion <span aria-hidden="true">→</span>
            </Link>
            <a
              href={site.contact.telephoneLien}
              className="inline-flex items-center gap-2 rounded-sm border border-club-950/25 px-6 py-3.5 text-[13px] font-semibold text-club-950 transition-colors hover:bg-sable-50"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              >
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
              {tr("Nous appeler")}
            </a>
          </div>
        </div>

        <Editable path={`${SECTION}.AVANTAGES_IMAGE`} image as="div" className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <Image
            src={AVANTAGES_IMAGE}
            alt={tr("Le parcours entre les pins, face à la montagne Sainte-Victoire")}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            data-parallax="0.07"
          />
        </Editable>
      </Container>
    </section>
  );
}
