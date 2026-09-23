import { Container } from "@/components/ui/container";

/**
 * Bloc temporaire : chaque page reçoit son contenu définitif au fil des maquettes.
 */
export function EnConstruction({ note }: { note?: string }) {
  return (
    <Container className="py-20">
      <div className="rounded-3xl border border-dashed border-club-950/20 bg-sable-100/60 px-8 py-14 text-center">
        <p className="font-display text-2xl text-club-950">Page en préparation</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-encre/60">
          {note ?? "Le contenu et la mise en page seront intégrés à réception de la maquette."}
        </p>
      </div>
    </Container>
  );
}
