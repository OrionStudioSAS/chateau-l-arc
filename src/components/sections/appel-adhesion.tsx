import Image from "next/image";
import Link from "next/link";

import { site } from "@/config/site";

/** TODO : photo temporaire, à remplacer par la vue définitive (pins au couchant). */
const IMAGE_PROVISOIRE = "/images/parcours.png";

const telephone = `tel:${site.contact.telephone.replace(/[^+\d]/g, "")}`;

/**
 * Dernier appel de l'accueil, juste avant le pied de page : encart photo en
 * retrait des bords de l'écran, comme sur la maquette.
 */
export function AppelAdhesion() {
  return (
    <section className="bg-white px-3 pb-3 pt-14 sm:px-4 sm:pb-4 lg:pt-20">
      <div className="relative overflow-hidden bg-club-950 text-white">
        <Image
          src={IMAGE_PROVISOIRE}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "50% 70%" }}
          data-parallax="0.08"
          data-parallax-echelle="1.3"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-club-950/75" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-club-950/80 via-club-950/40 to-transparent"
        />

        <div className="relative mx-auto grid w-full max-w-[1600px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:px-[100px] lg:py-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-or-400">
              Saison 2027
            </p>
            <h2 className="mt-4 max-w-2xl font-butler text-[32px] font-medium leading-[1.12] sm:text-[44px]">
              Rejoignez le club et jouez toute l&apos;année face à la Sainte-Victoire.
            </h2>
            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/70">
              Abonnements individuels, couple, famille et jeunes · −5&nbsp;% en paiement
              comptant jusqu&apos;au 31 décembre.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/tarifs"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-or-500 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-or-600"
            >
              Voir les abonnements <span aria-hidden="true">→</span>
            </Link>
            <a
              href={telephone}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/35 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white/10"
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
              Appeler l&apos;accueil
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
