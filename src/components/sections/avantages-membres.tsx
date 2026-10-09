import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { site } from "@/config/site";
import { avantagesMembres } from "@/lib/tarifs";

/** TODO : photo temporaire, à remplacer (vue sur la Sainte-Victoire depuis le parcours). */
const IMAGE_PROVISOIRE = "/images/parcours.png";

export function AvantagesMembres() {
  return (
    <section id="avantages" className="scroll-mt-28 bg-white py-14 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <Surtitre aligne="gauche" className="text-or-600">
            Avantages membres
          </Surtitre>
          <h2 className="mt-5 max-w-lg font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[48px]">
            Bien plus qu&apos;un accès au parcours
          </h2>

          <ul className="mt-8 space-y-4">
            {avantagesMembres.map((avantage) => (
              <li key={avantage} className="flex items-center gap-4 text-[15px] text-encre/80">
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sable-100 text-[12px] text-club-950"
                >
                  ✓
                </span>
                {avantage}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/devenir-membre"
              className="inline-flex items-center gap-2 rounded-sm bg-club-950 px-6 py-3.5 text-[13px] font-semibold text-sable-50 transition-colors hover:bg-club-800"
            >
              Demander une adhésion <span aria-hidden="true">→</span>
            </Link>
            <a
              href={site.contact.telephoneLien}
              className="inline-flex items-center gap-2 rounded-sm border border-club-950/25 px-6 py-3.5 text-[13px] font-semibold text-club-950 transition-colors hover:bg-sable-50"
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
              Nous appeler
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <Image
            src={IMAGE_PROVISOIRE}
            alt="Le parcours entre les pins, face à la montagne Sainte-Victoire"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            data-parallax="0.07"
          />
        </div>
      </Container>
    </section>
  );
}
