import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { enseignants } from "@/lib/academie";
import { site } from "@/config/site";

/** TODO : image temporaire, à remplacer par les portraits des enseignants. */
const IMAGE_PROVISOIRE = "/images/academie.png";

export function AcademieStages() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ul className="grid gap-5 sm:grid-cols-2">
            {enseignants.map((enseignant) => (
              <li
                key={enseignant.nom}
                className="rounded-lg bg-white px-6 py-8 text-center"
              >
                <span className="relative mx-auto block size-20 overflow-hidden rounded-full bg-club-600/20">
                  <Image
                    src={IMAGE_PROVISOIRE}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                    style={{ objectPosition: enseignant.cadrage }}
                  />
                </span>

                <p className="mt-5 font-butler text-[19px] font-bold text-club-950">
                  {enseignant.nom}
                </p>
                <p className="mt-1 text-[13px] text-gris-500">{enseignant.titre}</p>
              </li>
            ))}
          </ul>

          <div>
            <Surtitre aligne="gauche" className="text-or-600">
              Stages &amp; initiations
            </Surtitre>

            <h2 className="mt-5 font-butler text-[32px] font-medium leading-[1.1] text-club-950 sm:text-[40px]">
              De 2 à 30 personnes
            </h2>

            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-encre/70">
              Initiations découvertes, ateliers thématiques et stages tous niveaux,
              toute l&apos;année. Réservation en ligne ou par téléphone.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/reserver"
                className="rounded-lg bg-or-500 px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-or-600"
              >
                Réserver en ligne
              </Link>

              <p className="text-[15px] text-encre/70">
                ou{" "}
                <a
                  href={site.contact.telephoneLien}
                  className="underline-offset-4 hover:underline"
                >
                  {site.contact.telephone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
