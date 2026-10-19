import type { Metadata } from "next";

import { CentreAide } from "@/components/sections/centre-aide";
import { FaqContact } from "@/components/sections/faq-contact";
import { themesFaq, type ThemeFaq } from "@/lib/faq";
import { i18n } from "@/lib/i18n/serveur";
import { metadonnees } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadonnees({
    titre: "Questions fréquentes",
    description: "Réservation, tarifs, carte verte, abonnements, école de golf, compétitions, accès : toutes les réponses sur le golf de Château l'Arc à Fuveau.",
    chemin: "/faq",
  });
}

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
  const { T } = await i18n();
  const themes = themesFaq(T);

  return (
    <>
      <script
        type="application/ld+json"
        // Contenu de constants.ts (back-office) : aucune donnée saisie par un visiteur.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees(themes)).replace(/</g, "\\u003c") }}
      />
      <CentreAide themes={themes} />
      <FaqContact />
    </>
  );
}
