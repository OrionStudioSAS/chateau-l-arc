import { Lien as Link } from "@/components/ui/lien";
import type { Route } from "next";

import { Editable } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { lienAutorise } from "@/lib/admin/popup";
import { i18n } from "@/lib/i18n/serveur";

const traits = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const SECTION = "FAQ · Nous contacter";

/** « Notre équipe est là pour vous » : trois façons de joindre le club. */
export async function FaqContact() {
  const { T } = await i18n();
  const { FAQ_CONTACT_CANAUX, FAQ_CONTACT_SURTITRE, FAQ_CONTACT_TITRE } = T;
  // Textes et liens dans constants.ts (éditeur visuel) ; pictogrammes ici, dans le même ordre.
  const pictos = [
    <path key="telephone" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
    <g key="email">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </g>,
    <path key="formulaire" d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5M10 16h5" />,
  ];

  return (
    <section className="bg-sable-100 py-14 lg:py-20">
      <Container>
        <Editable path={`${SECTION}.FAQ_CONTACT_SURTITRE`} as="div">
          <Surtitre aligne="gauche" className="text-or-600">
            {FAQ_CONTACT_SURTITRE}
          </Surtitre>
        </Editable>
        <Editable path={`${SECTION}.FAQ_CONTACT_TITRE`} as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[44px]">
          {FAQ_CONTACT_TITRE}
        </Editable>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {FAQ_CONTACT_CANAUX.map((canal, index) => {
            const chemin = `${SECTION}.FAQ_CONTACT_CANAUX.${index}`;
            const lien = (
              <>
                <Editable path={`${chemin}.texteLien`}>{canal.texteLien}</Editable> <span aria-hidden="true">→</span>
              </>
            );
            const classeLien = "mt-4 text-[14px] font-semibold text-club-950 underline-offset-4 hover:underline";
            return (
              <li key={index} className="flex flex-col rounded-sm bg-white p-7">
                <span className="flex size-10 items-center justify-center rounded-full bg-sable-100 text-club-950">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" {...traits}>
                    {pictos[index] ?? pictos[2]}
                  </svg>
                </span>
                <Editable path={`${chemin}.titre`} as="h3" className="mt-5 font-butler text-[22px] font-medium text-club-950">
                  {canal.titre}
                </Editable>
                <Editable path={`${chemin}.texte`} as="p" className="mt-2 flex-1 break-words text-[14px] leading-relaxed text-encre/60">
                  {canal.texte}
                </Editable>
                {!lienAutorise(canal.lien) ? null : canal.lien.startsWith("/") ? (
                  <Link href={canal.lien as Route} className={classeLien}>
                    {lien}
                  </Link>
                ) : (
                  <a href={canal.lien} className={classeLien}>
                    {lien}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
