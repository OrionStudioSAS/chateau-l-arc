import type { Metadata } from "next";

import { CentreAide } from "@/components/sections/centre-aide";
import { FaqContact } from "@/components/sections/faq-contact";
import { themesFaq } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Parcours, réservations, tarifs, abonnements, académie, compétitions, accès : toutes les réponses aux questions courantes sur le Golf Château l'Arc.",
};

/** Données structurées FAQPage : les questions peuvent apparaître dans Google. */
const donneesStructurees = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: themesFaq.flatMap((theme) =>
    theme.questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.reponse },
    })),
  ),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // Contenu statique, issu de lib/faq : aucune donnée saisie par un visiteur.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees).replace(/</g, "\\u003c") }}
      />
      <CentreAide />
      <FaqContact />
    </>
  );
}
