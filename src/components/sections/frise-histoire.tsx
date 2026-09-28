import { Container } from "@/components/ui/container";

const etapes = [
  {
    date: "1620",
    titre: "La famille d'Agoult",
    texte:
      "Construction du Château l'Arc, point central du domaine, au cœur de la Provence véritable.",
  },
  {
    // Le « e » est en exposant, comme il se doit pour un siècle.
    date: <>XX<sup>e</sup></>,
    cle: "xxe",
    titre: "L'atelier des artistes",
    texte:
      "Le château devient l'atelier préféré du peintre Bernard Buffet, puis le refuge estival de Pierre Bergé, Jean Cocteau et Yves Saint Laurent.",
  },
  {
    date: "1950",
    titre: "Le cinéma s'invite",
    texte:
      "Fernandel y tourne « Uniformes et grandes manœuvres ». Suivront le biopic Yves Saint Laurent, Les Tuche 2 et Divorce Club de Michaël Youn.",
  },
  {
    date: "1985",
    titre: "Robert Trent Jones II",
    texte:
      "Le parcours 18 trous s'enroule autour du château, offrant des points de vue magnifiques sur la Sainte-Victoire.",
  },
  {
    date: "Auj.",
    titre: "Un lieu de vie",
    texte:
      "Club-house dans la demeure historique, restaurant, réceptions, et la Sainte-Victoire International School : le domaine vit toute l'année.",
  },
];

export function FriseHistoire() {
  return (
    <section className="bg-sable-100 py-20">
      <Container>
        <ol className="relative mx-auto max-w-3xl">
          {/* Filet vertical, passant derrière les pastilles de date. */}
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-10 top-6 w-px -translate-x-1/2 bg-or-500/40"
          />

          {etapes.map((etape) => (
            <li
              key={etape.cle ?? String(etape.date)}
              className="relative grid grid-cols-[80px_minmax(0,1fr)] gap-x-5 pb-12 last:pb-0"
            >
              <span className="relative z-10 flex h-fit justify-center">
                <span className="rounded-full bg-club-950 px-4 py-1.5 font-butler text-[14px] font-bold text-or-500">
                  {etape.date}
                </span>
              </span>

              <div>
                <h3 className="font-butler text-[22px] font-bold leading-tight text-club-800">
                  {etape.titre}
                </h3>
                <p className="mt-2 text-[16px] leading-relaxed text-encre/80">
                  {etape.texte}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
