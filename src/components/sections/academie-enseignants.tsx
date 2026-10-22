import Image from "next/image";

import { PictoAcademie } from "@/components/sections/academie-pictos";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { Editable } from "@/components/cms/editable";
import { site } from "@/config/site";
import { i18n } from "@/lib/i18n/serveur";

const initiales = (nom: string) =>
  nom
    .split(" ")
    .map((partie) => partie[0])
    .join("")
    .toUpperCase();

const SECTION = "L'Académie · Enseignants";

/**
 * « Nos enseignants » : la liste se gère dans le back-office (Pages ›
 * L'Académie : ajout, retrait, photo). Sans photo, les initiales du pro.
 */
export async function AcademieEnseignants() {
  const { T, tr } = await i18n();
  const { ACADEMIE_ENSEIGNANTS, ACADEMIE_ENSEIGNANTS_SURTITRE, ACADEMIE_ENSEIGNANTS_TITRE } = T;
  const enseignants = ACADEMIE_ENSEIGNANTS.filter((e) => e.nom.trim());
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <Editable path={`${SECTION}.ACADEMIE_ENSEIGNANTS_SURTITRE`} as="div">
          <Surtitre aligne="gauche" className="text-or-600">
            {ACADEMIE_ENSEIGNANTS_SURTITRE}
          </Surtitre>
        </Editable>
        <Editable path={`${SECTION}.ACADEMIE_ENSEIGNANTS_TITRE`} as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
          {ACADEMIE_ENSEIGNANTS_TITRE}
        </Editable>

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {enseignants.map((enseignant, index) => {
            const chemin = `${SECTION}.ACADEMIE_ENSEIGNANTS.${ACADEMIE_ENSEIGNANTS.indexOf(enseignant)}`;
            return (
              <li
                key={`${enseignant.nom}-${index}`}
                className="flex items-center gap-6 rounded-sm border border-encre/10 p-6 sm:p-8"
              >
                <Editable
                  path={`${chemin}.photo`}
                  image
                  as="span"
                  className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden bg-sable-100 font-butler text-[30px] text-club-950 sm:size-28"
                >
                  {enseignant.photo ? (
                    <Image src={enseignant.photo} alt={enseignant.nom} fill sizes="112px" className="object-cover" />
                  ) : (
                    <span aria-hidden="true">{initiales(enseignant.nom)}</span>
                  )}
                </Editable>
                <div>
                  <Editable path={`${chemin}.nom`} as="h3" className="font-butler text-[24px] font-medium text-club-950 sm:text-[28px]">
                    {enseignant.nom}
                  </Editable>
                  <p className="mt-1 flex items-center gap-2 text-[13px] text-encre/65">
                    <PictoAcademie nom="diplome" className="size-3.5 text-or-600" />
                    <Editable path={`${chemin}.titre`}>{enseignant.titre}</Editable>
                  </p>
                  {/* Réservation auprès du pro par e-mail, sinon l'accueil du club. */}
                  <a
                    href={enseignant.email?.trim() ? `mailto:${enseignant.email.trim()}` : site.contact.telephoneLien}
                    className="mt-4 inline-flex rounded-sm border border-club-950/25 px-4 py-2.5 text-[13px] font-semibold text-club-950 transition-colors hover:bg-sable-50"
                  >
                    {tr("Réserver un cours")}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
