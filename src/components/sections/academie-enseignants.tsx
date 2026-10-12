import { PictoAcademie } from "@/components/sections/academie-pictos";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { site } from "@/config/site";
import { enseignants } from "@/lib/academie";

const initiales = (nom: string) =>
  nom
    .split(" ")
    .map((partie) => partie[0])
    .join("")
    .toUpperCase();

/** « Nos enseignants » : initiales en attendant les portraits (cf. lib/academie). */
export function AcademieEnseignants() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <Surtitre aligne="gauche" className="text-or-600">
          Nos enseignants
        </Surtitre>
        <h2 className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
          Une équipe pour vous accompagner
        </h2>

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {enseignants.map((enseignant) => (
            <li
              key={enseignant.nom}
              className="flex items-center gap-6 rounded-sm border border-encre/10 p-6 sm:p-8"
            >
              <span
                aria-hidden="true"
                className="flex size-24 shrink-0 items-center justify-center bg-sable-100 font-butler text-[30px] text-club-950 sm:size-28"
              >
                {initiales(enseignant.nom)}
              </span>
              <div>
                <h3 className="font-butler text-[24px] font-medium text-club-950 sm:text-[28px]">
                  {enseignant.nom}
                </h3>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-encre/65">
                  <PictoAcademie nom="diplome" className="size-3.5 text-or-600" />
                  {enseignant.titre}
                </p>
                <a
                  href={site.contact.telephoneLien}
                  className="mt-4 inline-flex rounded-sm border border-club-950/25 px-4 py-2.5 text-[13px] font-semibold text-club-950 transition-colors hover:bg-sable-50"
                >
                  Réserver un cours
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
