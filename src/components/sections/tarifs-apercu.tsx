import Link from "next/link";

import { Container } from "@/components/ui/container";
import { LienFleche } from "@/components/ui/lien-fleche";
import { Surtitre } from "@/components/ui/surtitre";
import { getFormulesAccueil } from "@/lib/api/content";

/** Bloc « Green fees » de l'accueil : trois cartes puis un lien vers la page tarifs. */
export async function TarifsApercu() {
  const formules = await getFormulesAccueil();

  return (
    <section className="py-20">
      <Container>
        <div className="text-center">
          <Surtitre filet="gris" className="text-encre/60">
            Tarifs
          </Surtitre>

          <h2 className="mt-6 font-butler text-[64px] font-medium leading-[1.1] text-club-950">
            Green fees
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-[18px] font-normal text-encre/70">
            Des tarifs simples, toute l&apos;année. Basse saison du 15 novembre au 15 avril.
          </p>
        </div>

        <ul className="mt-14 grid gap-7 md:grid-cols-3">
          {formules.map((formule) => (
            <li
              key={formule.id}
              className="flex flex-col items-center rounded-lg bg-white px-8 py-10 text-center shadow-[0_2px_18px_rgba(16,24,40,0.07)]"
            >
              <p className="text-[20px] font-medium tracking-[-0.2px] text-encre">
                {formule.titre}
              </p>

              <p className="mt-5 font-butler text-[48px] font-bold leading-none text-or-500">
                {formule.prix}
              </p>

              <p className="mt-6 text-[12px] font-normal leading-relaxed tracking-[-0.2px] text-encre/60">
                {formule.detail}
              </p>

              <Link
                href="/reserver"
                className="mt-6 rounded-lg bg-club-800 px-7 py-3 text-[18px] font-medium text-sable-50 transition-colors hover:bg-club-950"
              >
                Réserver
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14 text-center">
          <LienFleche href="/tarifs">Voir tous les tarifs et abonnements</LienFleche>
        </div>
      </Container>
    </section>
  );
}
