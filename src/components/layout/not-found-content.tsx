import { Lien as Link } from "@/components/ui/lien";

import { BoutonOr } from "@/components/ui/bouton-or";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { estPagePubliqueVisible } from "@/config/visibilite";
import { i18n } from "@/lib/i18n/serveur";

/** Pages vers lesquelles on relance le visiteur égaré. */
const departs = ([
  {
    href: "/le-parcours",
    titre: "Le parcours",
    texte: "18 trous, par 70, au cœur de la Provence.",
  },
  {
    href: "/tarifs",
    titre: "Tarifs",
    texte: "Green fees, abonnements et services sur place.",
  },
  {
    href: "/competitions",
    titre: "Compétitions",
    texte: "Calendrier, inscriptions et résultats.",
  },
  {
    href: "/academie",
    titre: "L'académie",
    texte: "Cours, stages et école de golf.",
  },
] satisfies { href: string; titre: string; texte: string }[]).filter((depart) =>
  estPagePubliqueVisible(depart.href),
);

export async function NotFoundContent() {
  const { tr } = await i18n();
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-encre/60">{tr("Erreur 404")}</Surtitre>

          {/* Décor : le titre accessible est le h1 ci-dessous. */}
          <p
            aria-hidden="true"
            className="mt-8 font-butler text-[120px] font-bold uppercase leading-[0.8] tracking-[2px] text-or-500 sm:text-[180px] lg:text-[220px]"
          >
            404
          </p>

          <h1 className="mt-10 font-butler text-[40px] font-medium leading-none tracking-[-1px] text-club-950 sm:text-[56px]">
            {tr("Balle perdue")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[18px] font-normal leading-relaxed tracking-[-0.2px] text-encre/70 sm:text-[20px]">
            {tr("La page que vous cherchez n'existe pas ou a été déplacée. Pas de pénalité : rejouez depuis l'un de ces départs.")}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <BoutonOr href="/">{tr("Retour à l'accueil")}</BoutonOr>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-sm border border-club-950/20 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-club-950 transition-colors hover:bg-white xl:px-5"
            >
              {tr("Nous contacter")}
            </Link>
          </div>
        </div>

        <ul className="mt-20 grid gap-4 sm:grid-cols-2">
          {departs.map((depart, index) => (
            <li key={depart.href}>
              <Link
                href={depart.href}
                className="group flex h-full flex-col rounded-sm bg-white p-6 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(15,42,29,0.35)]"
              >
                <span className="text-[12px] uppercase tracking-[0.2em] text-or-600">
                  {tr("Départ")} {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-4 font-butler text-[24px] font-medium leading-tight text-club-950">
                  {tr(depart.titre)}
                </span>
                <span className="mt-2 flex-1 text-[15px] leading-relaxed text-encre/65">
                  {tr(depart.texte)}
                </span>
                <span className="mt-6 text-[16px] font-semibold text-club-950 underline-offset-4 group-hover:underline">
                  {tr("Y aller")} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
