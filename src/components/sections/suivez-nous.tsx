import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";

/** TODO : images temporaires, à remplacer par le flux Instagram du club. */
const publications = [
  { cadrage: "50% 30%" },
  { cadrage: "20% 60%" },
  { cadrage: "75% 40%" },
  { cadrage: "40% 75%" },
];

const COMPTE = "chateaularcgolfclub";

export function SuivezNous({
  image = "/images/tarifs.png",
}: {
  /** Visuel provisoire des vignettes, le temps du flux Instagram réel. */
  image?: string;
}) {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-or-600">Suivez-nous</Surtitre>

          <p className="mt-6 font-butler text-[28px] font-medium text-club-950 sm:text-[34px]">
            <a
              href={`https://www.instagram.com/${COMPTE}`}
              target="_blank"
              rel="noreferrer noopener"
              className="underline-offset-4 hover:underline"
            >
              @ {COMPTE}
            </a>
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {publications.map((publication) => (
            <li
              key={publication.cadrage}
              className="relative aspect-square overflow-hidden rounded-sm"
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
                style={{ objectPosition: publication.cadrage }}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
