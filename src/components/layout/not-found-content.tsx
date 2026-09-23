import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function NotFoundContent() {
  return (
    <Container className="py-32 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-club-600">
        Erreur 404
      </p>
      <h1 className="mt-4 font-display text-4xl text-club-950">Page introuvable</h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-encre/65">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-10 flex justify-center">
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
      </div>
    </Container>
  );
}
