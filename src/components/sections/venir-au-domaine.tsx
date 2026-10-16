import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { Editable } from "@/components/cms/editable";
import { VENIR_ACCES, VENIR_IMAGE, VENIR_SURTITRE, VENIR_TITRE_1, VENIR_TITRE_2 } from "@/constants";
import { site, urlItineraire } from "@/config/site";

type Picto = "avion" | "train" | "route";

const SECTION = "Histoire · Venir au domaine";

/** Textes dans constants.ts (éditeur visuel) ; pictogrammes ici, dans le même ordre. */
const pictos: Picto[] = ["avion", "train", "route"];
const acces = VENIR_ACCES.map((item, index) => ({ ...item, picto: pictos[index] ?? "route" }));

function Pictogramme({ nom }: { nom: Picto | "itineraire" | "repere" }) {
  const chemins = {
    avion: <path d="M3 14l7-2V6a2 2 0 0 1 4 0v6l7 2v2l-7-1v4l2 1.5V21l-4-1-4 1v-1.5L10 19v-4l-7 1v-2Z" />,
    train: (
      <>
        <rect x="6" y="3" width="12" height="14" rx="3" />
        <path d="M6 11h12M9 21l1.5-4m4.5 4-1.5-4M9.5 14h.01M14.5 14h.01" />
      </>
    ),
    route: <path d="M4 20 8 4m12 16L16 4M12 6v2m0 4v2m0 4v2" />,
    itineraire: <path d="m3 11 18-8-8 18-2-8-8-2Z" />,
    repere: (
      <>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {chemins[nom]}
    </svg>
  );
}

/** « Venir au domaine » : temps d'accès, itinéraire et photo du château. */
export function VenirAuDomaine() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <Editable path={`${SECTION}.VENIR_SURTITRE`} as="div">
            <Surtitre aligne="gauche" className="text-or-600">
              {VENIR_SURTITRE}
            </Surtitre>
          </Editable>
          <h2 className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            <Editable path={`${SECTION}.VENIR_TITRE_1`}>{VENIR_TITRE_1}</Editable>
            <br />
            <Editable path={`${SECTION}.VENIR_TITRE_2`}>{VENIR_TITRE_2}</Editable>
          </h2>

          <ul className="mt-8 max-w-md divide-y divide-encre/10 border-t border-encre/10">
            {acces.map((item, index) => (
              <li key={index} className="flex items-center gap-4 py-4">
                <span className="flex size-9 items-center justify-center rounded-full bg-sable-100 text-or-600">
                  <Pictogramme nom={item.picto} />
                </span>
                <Editable path={`${SECTION}.VENIR_ACCES.${index}.libelle`} className="flex-1 text-[14px] text-encre/80">{item.libelle}</Editable>
                <Editable path={`${SECTION}.VENIR_ACCES.${index}.duree`} className="font-butler text-[20px] text-club-950">{item.duree}</Editable>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={urlItineraire}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-sm bg-club-950 px-5 py-3.5 text-[13px] font-semibold text-sable-50 transition-colors hover:bg-club-800"
            >
              <Pictogramme nom="itineraire" />
              Itinéraire
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-sm border border-club-950/25 px-5 py-3.5 text-[13px] font-semibold text-club-950 transition-colors hover:bg-sable-50"
            >
              Nous contacter
            </Link>
          </div>
        </div>

        <Editable path={`${SECTION}.VENIR_IMAGE`} image as="div" className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <Image
            src={VENIR_IMAGE}
            alt="La façade du Château l'Arc et ses tours, à Fuveau"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            data-parallax="0.07"
          />
          <p className="absolute bottom-4 left-4 flex items-center gap-2 rounded-sm bg-white px-3 py-2 text-[12px] font-medium text-club-950 shadow-sm">
            <Pictogramme nom="repere" />
            {site.contact.adresse} · {site.contact.codePostalVille}
          </p>
        </Editable>
      </Container>
    </section>
  );
}
