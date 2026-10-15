import { Editable } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";

export function PageHero({
  surtitre,
  titre,
  chapo,
  cms,
}: {
  surtitre?: string;
  titre: string;
  chapo?: string;
  /** Chemins dans constants.ts (éditeur visuel du back-office). */
  cms?: { surtitre?: string; titre?: string; chapo?: string };
}) {
  return (
    <section className="border-b border-club-950/10 bg-sable-100">
      <Container className="py-16 sm:py-20">
        {surtitre ? (
          <Editable path={cms?.surtitre ?? ""} as="p" className="text-xs font-semibold uppercase tracking-[0.2em] text-club-600">
            {surtitre}
          </Editable>
        ) : null}
        <Editable path={cms?.titre ?? ""} as="h1" className="mt-3 max-w-3xl font-display text-4xl text-club-950 sm:text-5xl">
          {titre}
        </Editable>
        {chapo ? (
          <Editable path={cms?.chapo ?? ""} as="p" className="mt-5 max-w-2xl text-lg leading-relaxed text-encre/70">
            {chapo}
          </Editable>
        ) : null}
      </Container>
    </section>
  );
}
