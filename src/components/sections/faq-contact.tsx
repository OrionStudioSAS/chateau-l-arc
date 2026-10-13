import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { site } from "@/config/site";

const traits = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** « Notre équipe est là pour vous » : trois façons de joindre le club. */
export function FaqContact() {
  const canaux = [
    {
      titre: "Par téléphone",
      texte: "L'accueil golf répond à vos questions.",
      lien: { label: site.contact.telephone, href: site.contact.telephoneLien },
      picto: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
    },
    {
      titre: "Par e-mail",
      texte: site.contact.email,
      lien: { label: "Écrire au club", href: `mailto:${site.contact.email}` },
      picto: (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </>
      ),
    },
    {
      titre: "Par formulaire",
      texte: "Adhésion, cours ou événement : la bonne équipe vous répond.",
      lien: { label: "Page Contact", href: "/contact" },
      picto: <path d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5M10 16h5" />,
    },
  ];

  return (
    <section className="bg-sable-100 py-14 lg:py-20">
      <Container>
        <Surtitre aligne="gauche" className="text-or-600">
          Vous n&apos;avez pas trouvé votre réponse ?
        </Surtitre>
        <h2 className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[44px]">
          Notre équipe est là pour vous
        </h2>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {canaux.map((canal) => (
            <li key={canal.titre} className="flex flex-col rounded-sm bg-white p-7">
              <span className="flex size-10 items-center justify-center rounded-full bg-sable-100 text-club-950">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" {...traits}>
                  {canal.picto}
                </svg>
              </span>
              <h3 className="mt-5 font-butler text-[22px] font-medium text-club-950">{canal.titre}</h3>
              <p className="mt-2 flex-1 break-words text-[14px] leading-relaxed text-encre/60">{canal.texte}</p>
              {canal.lien.href.startsWith("/") ? (
                <Link
                  href="/contact"
                  className="mt-4 text-[14px] font-semibold text-club-950 underline-offset-4 hover:underline"
                >
                  {canal.lien.label} <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <a
                  href={canal.lien.href}
                  className="mt-4 text-[14px] font-semibold text-club-950 underline-offset-4 hover:underline"
                >
                  {canal.lien.label} <span aria-hidden="true">→</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
