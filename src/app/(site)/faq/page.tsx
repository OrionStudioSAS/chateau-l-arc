import type { Metadata } from "next";

import { CentreAide } from "@/components/sections/centre-aide";
import { FaqContact } from "@/components/sections/faq-contact";
import { getGrilleTarifs } from "@/lib/api/content";
import { themesFaq, type ThemeFaq } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Parcours, réservations, tarifs, abonnements, académie, compétitions, accès : toutes les réponses aux questions courantes sur le Golf Château l'Arc.",
};

/** Données structurées FAQPage : les questions peuvent apparaître dans Google. */
const donneesStructurees = (themes: ThemeFaq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: themes.flatMap((theme) =>
    theme.questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.reponse },
    })),
  ),
});

export default async function Page() {
  const themes = themesFaq(await getGrilleTarifs());

  return (
    <>
      <script
        type="application/ld+json"
        // Contenu issu de lib/faq et de la grille tarifaire : aucune donnée saisie par un visiteur.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees(themes)).replace(/</g, "\\u003c") }}
      />
      <CentreAide themes={themes} />
      <FaqContact />
    </>
  );
}
