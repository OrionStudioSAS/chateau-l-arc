
import { Editable } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { getStatutInstallations } from "@/lib/api/content";
import { libelleEtat, optionCourante } from "@/lib/statut";
import { cn } from "@/lib/cn";
import { i18n } from "@/lib/i18n/serveur";

type Picto = "carte" | "horloge" | "voiturette" | "tenue";

const SECTION = "Le parcours · Infos pratiques";

/** Textes dans constants.ts (éditeur visuel) ; pictogrammes ici, dans le même ordre. */
const pictos: Picto[] = ["carte", "horloge", "voiturette", "tenue"];

function Pictogramme({ nom }: { nom: Picto }) {
  const chemins: Record<Picto, React.ReactNode> = {
    carte: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 10h5M7 14h3M15 10h2" />
      </>
    ),
    horloge: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l2.5 2" />
      </>
    ),
    voiturette: (
      <>
        <path d="M3 14h18l-2-6H7L5 14m0 0v3m14-3v3M9 8V5h8" />
        <circle cx="7.5" cy="17.5" r="1.5" />
        <circle cx="16.5" cy="17.5" r="1.5" />
      </>
    ),
    tenue: <path d="M9 4 4 7l2 4 2-1v10h8V10l2 1 2-4-5-3a3 3 0 0 1-6 0Z" />,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[18px]"
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

/** « Avant de jouer » : règles pratiques et état du jour, tiré du back-office. */
export async function InfosPratiques() {
  const { T } = await i18n();
  const { INFOS_CARTES, INFOS_NOTE, INFOS_SURTITRE, INFOS_TITRE } = T;
  const infos = INFOS_CARTES.map((info, index) => ({ ...info, picto: pictos[index] ?? "carte" }));
  const installations = await getStatutInstallations();
  const parcours = installations.find((installation) => installation.cle === "parcours");
  const voiturettes = installations.find((installation) => installation.cle === "voiturette");

  const etat = [
    parcours ? `Parcours ${libelleEtat(parcours).toLowerCase()}` : null,
    voiturettes ? `voiturettes ${voiturettes.etat === "chemins" ? "sur les chemins" : libelleEtat(voiturettes).toLowerCase()}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <Editable path={`${SECTION}.INFOS_SURTITRE`} as="div">
          <Surtitre aligne="gauche" className="text-or-600">
            {INFOS_SURTITRE}
          </Surtitre>
        </Editable>
        <Editable path={`${SECTION}.INFOS_TITRE`} as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
          {INFOS_TITRE}
        </Editable>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {infos.map((info, index) => (
            <li key={index} className="rounded-sm border border-encre/10 bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-sable-100 text-or-600">
                <Pictogramme nom={info.picto} />
              </span>
              <Editable path={`${SECTION}.INFOS_CARTES.${index}.titre`} as="h3" className="mt-5 text-[15px] font-semibold text-club-950">{info.titre}</Editable>
              <Editable path={`${SECTION}.INFOS_CARTES.${index}.texte`} as="p" className="mt-2 text-[14px] leading-relaxed text-encre/60">{info.texte}</Editable>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-sm bg-sable-100 px-5 py-4 text-[13px]">
          <p className="flex items-center gap-3 text-encre/70">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4 shrink-0 text-or-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
            </svg>
            <Editable path={`${SECTION}.INFOS_NOTE`}>{INFOS_NOTE}</Editable>
          </p>

          {etat ? (
            <p className="flex items-center gap-2 font-semibold text-club-950">
              <span
                aria-hidden="true"
                className={cn(
                  "block size-2 rounded-full",
                  !parcours || optionCourante(parcours).ton === "vert"
                    ? "bg-emerald-500"
                    : optionCourante(parcours).ton === "rouge"
                      ? "bg-red-600"
                      : "bg-amber-500",
                )}
              />
              {etat}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
