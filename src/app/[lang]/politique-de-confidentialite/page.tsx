import type { Metadata } from "next";

import {
  CartesContact,
  Encart,
  ListePuces,
  PageLegale,
  Paragraphes,
  Rubrique,
  SousRubrique,
} from "@/components/sections/legal/page-legale";
import { i18n } from "@/lib/i18n/serveur";
import { metadonnees } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadonnees({
    titre: "Politique de confidentialité",
    description: "Comment le Château l'Arc Golf Club utilise, conserve et protège vos données personnelles, et comment exercer vos droits d'accès, de rectification et de suppression.",
    chemin: "/politique-de-confidentialite",
  });
}

const S = {
  banniere: "Confidentialité · Bannière",
  utilisation: "Confidentialité · Utilisation et conservation",
  contacts: "Confidentialité · Nous contacter.CONFIDENTIALITE_CONTACTS",
  consentement: "Confidentialité · Consentement et traitement",
  retrait: "Confidentialité · Retrait du consentement",
};

/** Politique de confidentialité (maquette) : textes modifiables dans Pages › Confidentialité. */
export default async function Page() {
  const { T } = await i18n();
  const ids = ["utilisation", "consentement", "retrait", "droit-acces", "abonnements"];

  return (
    <PageLegale
      titre={T.CONFIDENTIALITE_TITRE}
      surtitre={T.CONFIDENTIALITE_SURTITRE}
      texte={T.CONFIDENTIALITE_TEXTE}
      miseAJour={T.CONFIDENTIALITE_MISE_A_JOUR}
      cms={{
        titre: `${S.banniere}.CONFIDENTIALITE_TITRE`,
        surtitre: `${S.banniere}.CONFIDENTIALITE_SURTITRE`,
        texte: `${S.banniere}.CONFIDENTIALITE_TEXTE`,
        miseAJour: `${S.banniere}.CONFIDENTIALITE_MISE_A_JOUR`,
      }}
      rubriques={ids.map((id, i) => ({ id, libelle: T.CONFIDENTIALITE_SOMMAIRE[i] ?? "" }))}
    >
      <Rubrique id="utilisation" numero={1} titre={T.CONFIDENTIALITE_UTILISATION_TITRE} cms={`${S.utilisation}.CONFIDENTIALITE_UTILISATION_TITRE`}>
        <Paragraphes texte={T.CONFIDENTIALITE_UTILISATION_TEXTE} cms={`${S.utilisation}.CONFIDENTIALITE_UTILISATION_TEXTE`} />
        <CartesContact cartes={T.CONFIDENTIALITE_CONTACTS} cms={S.contacts} />
      </Rubrique>

      <Rubrique id="consentement" numero={2} titre={T.CONFIDENTIALITE_CONSENTEMENT_TITRE} cms={`${S.consentement}.CONFIDENTIALITE_CONSENTEMENT_TITRE`}>
        <Paragraphes texte={T.CONFIDENTIALITE_CONSENTEMENT_TEXTE} cms={`${S.consentement}.CONFIDENTIALITE_CONSENTEMENT_TEXTE`} />
        <ListePuces elements={T.CONFIDENTIALITE_CONSENTEMENT_LISTE} cms={`${S.consentement}.CONFIDENTIALITE_CONSENTEMENT_LISTE`} />
      </Rubrique>

      <Rubrique id="retrait" numero={3} titre={T.CONFIDENTIALITE_RETRAIT_TITRE} cms={`${S.retrait}.CONFIDENTIALITE_RETRAIT_TITRE`}>
        <SousRubrique id="droit-acces" numero="3.1" titre={T.CONFIDENTIALITE_ACCES_TITRE} cms={`${S.retrait}.CONFIDENTIALITE_ACCES_TITRE`} />
        <Paragraphes texte={T.CONFIDENTIALITE_ACCES_TEXTE} cms={`${S.retrait}.CONFIDENTIALITE_ACCES_TEXTE`} className="mt-3" />
        <CartesContact cartes={T.CONFIDENTIALITE_CONTACTS} cms={S.contacts} />
        <Encart picto="horloge" cms={`${S.retrait}.CONFIDENTIALITE_DELAI`}>
          {T.CONFIDENTIALITE_DELAI}
        </Encart>

        <SousRubrique id="abonnements" numero="3.2" titre={T.CONFIDENTIALITE_ABONNEMENTS_TITRE} cms={`${S.retrait}.CONFIDENTIALITE_ABONNEMENTS_TITRE`} />
        <Paragraphes texte={T.CONFIDENTIALITE_ABONNEMENTS_TEXTE} cms={`${S.retrait}.CONFIDENTIALITE_ABONNEMENTS_TEXTE`} className="mt-3" />
        <CartesContact cartes={T.CONFIDENTIALITE_CONTACTS} cms={S.contacts} />
      </Rubrique>
    </PageLegale>
  );
}
