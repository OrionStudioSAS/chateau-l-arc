import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getActualite } from "@/lib/api/content";
import { formatDate } from "@/lib/format";

/**
 * Comme pour les compétitions : pas de `generateStaticParams`, qui ferait
 * échouer le build sur une liste vide. Rendu à la demande, données en cache.
 */
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/actualites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getActualite(slug);

  if (!article) return { title: "Actualité introuvable" };

  return {
    title: article.titre,
    description: article.chapo,
    alternates: { canonical: `/actualites/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.titre,
      description: article.chapo,
      publishedTime: article.publieLe,
    },
  };
}

export default async function Page({ params }: PageProps<"/actualites/[slug]">) {
  const { slug } = await params;
  const article = await getActualite(slug);

  if (!article) notFound();

  return (
    <article className="py-16">
      <Container className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.15em] text-club-600">
          {formatDate(article.publieLe)}
          {article.categorie ? ` · ${article.categorie}` : ""}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-club-950 sm:text-5xl">
          {article.titre}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-encre/70">{article.chapo}</p>
        <div
          className="mt-10 space-y-4 text-base leading-relaxed text-encre/80"
          dangerouslySetInnerHTML={{ __html: article.contenuHtml }}
        />
        <div className="mt-12">
          <ButtonLink href="/actualites" variant="secondary">
            Retour aux actualités
          </ButtonLink>
        </div>
      </Container>
    </article>
  );
}
