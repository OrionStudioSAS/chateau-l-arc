import { Container } from "@/components/ui/container";

export function PageHero({
  surtitre,
  titre,
  chapo,
}: {
  surtitre?: string;
  titre: string;
  chapo?: string;
}) {
  return (
    <section className="border-b border-club-950/10 bg-sable-100">
      <Container className="py-16 sm:py-20">
        {surtitre ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-club-600">
            {surtitre}
          </p>
        ) : null}
        <h1 className="mt-3 max-w-3xl font-display text-4xl text-club-950 sm:text-5xl">
          {titre}
        </h1>
        {chapo ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-encre/70">
            {chapo}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
