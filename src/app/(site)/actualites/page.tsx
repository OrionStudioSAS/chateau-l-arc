import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { getActualites } from "@/lib/api/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Toutes les actualités du Golf Château l'Arc.",
};

export default async function Page() {
  const actualites = await getActualites();

  return (
    <>
      <PageHero
        surtitre="Le club"
        titre="Actualités"
        chapo="Compétitions, travaux, rendez-vous : les nouvelles du domaine."
      />
      <Container className="py-16">
        <ul className="divide-y divide-club-950/10 border-y border-club-950/10">
          {actualites.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/actualites/${article.slug}`}
                className="group flex flex-col gap-2 py-8 sm:flex-row sm:gap-10"
              >
                <p className="shrink-0 text-xs uppercase tracking-[0.15em] text-club-600 sm:w-40 sm:pt-1">
                  {formatDate(article.publieLe)}
                </p>
                <div>
                  <h2 className="font-display text-2xl text-club-950 group-hover:underline">
                    {article.titre}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-encre/65">
                    {article.chapo}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
