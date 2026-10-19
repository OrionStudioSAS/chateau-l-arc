import Image from "next/image";
import { Lien as Link } from "@/components/ui/lien";
import type { Route } from "next";

import { Editable } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { site, urlItineraire } from "@/config/site";
import { lienAutorise } from "@/lib/admin/popup";
import { proprietesLien } from "@/lib/liens";
import { i18n } from "@/lib/i18n/serveur";

const traits = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Picto({ children, className = "size-4" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} shrink-0`} {...traits}>
      {children}
    </svg>
  );
}

const pictos = {
  drapeau: <path d="M6 21V4m0 0h11l-2 4 2 4H6" />,
  couverts: <path d="M7 3v8m-2-8v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1-3 4-3 7h3" />,
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17h.01" />
    </>
  ),
  repere: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  telephone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  horloge: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  itineraire: <path d="m3 11 18-8-8 18-2-8-8-2Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
};

/** Encarts de la bannière Contact : accueil golf et e-mail. */
export async function CoordonneesBanniere() {
  const { tr } = await i18n();
  const lignes = [
    { libelle: "Accueil golf", valeur: site.contact.telephone, href: site.contact.telephoneLien, picto: pictos.telephone },
    { libelle: "E-mail", valeur: site.contact.email, href: `mailto:${site.contact.email}`, picto: pictos.mail },
  ];
  return (
    <ul className="flex flex-col items-start gap-2 lg:items-end">
      {lignes.map((ligne) => (
        <li key={ligne.libelle}>
          <a href={ligne.href} className="flex items-center gap-3 bg-white px-4 py-2.5 text-club-950 shadow-sm transition-colors hover:bg-sable-50">
            <span className="flex size-7 items-center justify-center rounded-full bg-sable-100">
              <Picto className="size-3.5">{ligne.picto}</Picto>
            </span>
            <span>
              <span className="block text-[10px] uppercase tracking-[0.14em] text-encre/45">{tr(ligne.libelle)}</span>
              <span className="block text-[13px] font-medium">{ligne.valeur}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** « Autres demandes » : réservation, restaurant, accueil. */
export async function AutresDemandes() {
  const { T } = await i18n();
  const { CONTACT_AUTRES_CARTES, CONTACT_AUTRES_SURTITRE } = T;
  const section = "Contact · Autres demandes";
  const icones = [pictos.drapeau, pictos.couverts, pictos.question];
  return (
    <section className="bg-sable-100 py-14 lg:py-20">
      <Container>
        <Editable path={`${section}.CONTACT_AUTRES_SURTITRE`} as="div">
          <Surtitre aligne="gauche" className="text-or-600">
            {CONTACT_AUTRES_SURTITRE}
          </Surtitre>
        </Editable>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {CONTACT_AUTRES_CARTES.map((carte, index) => {
            const chemin = `${section}.CONTACT_AUTRES_CARTES.${index}`;
            const lien = (
              <>
                <Editable path={`${chemin}.texteLien`}>{carte.texteLien}</Editable> <span aria-hidden="true">→</span>
              </>
            );
            const classeLien = "mt-4 text-[13px] font-semibold text-club-950 underline-offset-4 hover:underline";
            return (
              <li key={index} className="flex flex-col bg-white p-6">
                <Picto className="size-5 text-club-950">{icones[index] ?? pictos.question}</Picto>
                <Editable path={`${chemin}.titre`} as="h3" className="mt-4 font-butler text-[22px] font-medium text-club-950">
                  {carte.titre}
                </Editable>
                <Editable path={`${chemin}.texte`} as="p" className="mt-1.5 flex-1 text-[13px] leading-relaxed text-encre/60">
                  {carte.texte}
                </Editable>
                {!lienAutorise(carte.lien) ? null : carte.lien.startsWith("/") ? (
                  <Link href={carte.lien as Route} className={classeLien}>
                    {lien}
                  </Link>
                ) : (
                  <a href={carte.lien} {...proprietesLien(carte.lien)} className={classeLien}>
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

/** « Venir au domaine » : adresse, accueil, horaires et itinéraire. */
export async function VenirContact() {
  const { T, tr } = await i18n();
  const { CONTACT_VENIR_BOUTON, CONTACT_VENIR_HORAIRES, CONTACT_VENIR_IMAGE, CONTACT_VENIR_SURTITRE, CONTACT_VENIR_TITRE } = T;
  const section = "Contact · Venir au domaine";
  const lignes = [
    { libelle: "Adresse", valeur: `${site.contact.adresse}, ${site.contact.codePostalVille}`, picto: pictos.repere },
    { libelle: "Accueil golf", valeur: site.contact.telephone, picto: pictos.telephone, href: site.contact.telephoneLien },
    { libelle: "Horaires", valeur: CONTACT_VENIR_HORAIRES, picto: pictos.horloge, chemin: `${section}.CONTACT_VENIR_HORAIRES` },
  ];
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <Editable path={`${section}.CONTACT_VENIR_SURTITRE`} as="div">
            <Surtitre aligne="gauche" className="text-or-600">
              {CONTACT_VENIR_SURTITRE}
            </Surtitre>
          </Editable>
          <Editable path={`${section}.CONTACT_VENIR_TITRE`} as="h2" className="mt-4 font-butler text-[34px] font-medium leading-tight text-club-950 sm:text-[42px]">
            {CONTACT_VENIR_TITRE}
          </Editable>
          <dl className="mt-6 divide-y divide-encre/10 border-b border-encre/10">
            {lignes.map((ligne) => (
              <div key={ligne.libelle} className="flex items-center gap-4 py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sable-100 text-club-950">
                  <Picto>{ligne.picto}</Picto>
                </span>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-encre/45">{tr(ligne.libelle)}</dt>
                  <dd className="text-[14px] text-club-950">
                    {ligne.href ? (
                      <a href={ligne.href} className="hover:underline">{ligne.valeur}</a>
                    ) : (
                      <Editable path={ligne.chemin ?? ""}>{ligne.valeur}</Editable>
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
          <a
            href={urlItineraire}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-sm bg-club-950 px-5 py-3 text-[14px] font-semibold text-sable-50 hover:bg-club-800"
          >
            <Picto className="size-3.5">{pictos.itineraire}</Picto>
            <Editable path={`${section}.CONTACT_VENIR_BOUTON`}>{CONTACT_VENIR_BOUTON}</Editable>
          </a>
        </div>
        <Editable path={`${section}.CONTACT_VENIR_IMAGE`} image as="div" className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <Image src={CONTACT_VENIR_IMAGE} alt={tr("Vue aérienne du domaine du Château l'Arc et de son parcours")} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          <p className="absolute bottom-4 left-4 flex items-center gap-2 bg-white px-3 py-2 text-[12px] font-medium text-club-950 shadow-sm">
            <Picto className="size-3.5">{pictos.repere}</Picto>
            {site.contact.adresse} · {site.contact.codePostalVille}
          </p>
        </Editable>
      </Container>
    </section>
  );
}
