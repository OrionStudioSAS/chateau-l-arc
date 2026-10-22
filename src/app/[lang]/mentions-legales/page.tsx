import type { Metadata } from "next";

import { Editable } from "@/components/cms/editable";
import {
  Encart,
  ListePuces,
  PageLegale,
  Paragraphes,
  Picto,
  Rubrique,
  type PictoLegal,
} from "@/components/sections/legal/page-legale";
import { Lien as Link } from "@/components/ui/lien";
import { i18n } from "@/lib/i18n/serveur";
import { metadonnees } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadonnees({
    titre: "Mentions légales",
    description: "Éditeur, directeur de la publication, hébergement, propriété intellectuelle, cookies et crédits du site du Château l'Arc Golf Club à Fuveau.",
    chemin: "/mentions-legales",
  });
}

const S = {
  banniere: "Mentions légales · Bannière",
  infos: "Mentions légales · Informations générales",
  responsabilite: "Mentions légales · Responsabilité",
  cookies: "Mentions légales · Cookies",
  propriete: "Mentions légales · Propriété intellectuelle",
  donnees: "Mentions légales · Protection des données personnelles",
  credits: "Mentions légales · Crédits",
};

const pictosInfos: PictoLegal[] = ["personne", "serveur", "repere", "telephone", "courrier"];

/** Lien cliquable pour un téléphone ou un e-mail des informations générales. */
const lienInfo = (valeur: string) =>
  /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(valeur)
    ? `mailto:${valeur}`
    : /^\+?[\d\s().]{8,}$/.test(valeur)
      ? `tel:${valeur.replace(/\(0\)|[^\d+]/g, "")}`
      : null;

/** Mentions légales & Crédits (maquette) : textes modifiables dans Pages › Mentions légales. */
export default async function Page() {
  const { T, tr } = await i18n();
  const rubriques = [
    { id: "informations", libelle: T.MENTIONS_INFOS_TITRE },
    { id: "responsabilite", libelle: T.MENTIONS_RESPONSABILITE_TITRE },
    { id: "cookies", libelle: T.MENTIONS_COOKIES_TITRE },
    { id: "propriete", libelle: T.MENTIONS_PROPRIETE_TITRE },
    { id: "donnees", libelle: T.MENTIONS_DONNEES_TITRE },
    { id: "credits", libelle: T.MENTIONS_CREDITS_TITRE },
  ];

  return (
    <PageLegale
      titre={T.MENTIONS_TITRE}
      surtitre={T.MENTIONS_SURTITRE}
      texte={T.MENTIONS_TEXTE}
      miseAJour={T.MENTIONS_MISE_A_JOUR}
      cms={{
        titre: `${S.banniere}.MENTIONS_TITRE`,
        surtitre: `${S.banniere}.MENTIONS_SURTITRE`,
        texte: `${S.banniere}.MENTIONS_TEXTE`,
        miseAJour: `${S.banniere}.MENTIONS_MISE_A_JOUR`,
      }}
      rubriques={rubriques}
    >
      <Rubrique id="informations" numero={1} titre={T.MENTIONS_INFOS_TITRE} cms={`${S.infos}.MENTIONS_INFOS_TITRE`}>
        <dl className="divide-y divide-encre/10 border border-encre/10 px-4">
          {T.MENTIONS_INFOS.map((info, i) => {
            const href = lienInfo(info.valeur.trim());
            return (
              <div key={i} className="flex items-center gap-3.5 py-3.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sable-100 text-club-950">
                  <Picto nom={pictosInfos[i] ?? "repere"} className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <Editable path={`${S.infos}.MENTIONS_INFOS.${i}.libelle`} as="dt" className="text-[10px] font-semibold uppercase tracking-[0.14em] text-encre/45">
                    {info.libelle}
                  </Editable>
                  <dd className="mt-0.5 text-[14px] font-medium text-club-950">
                    <Editable path={`${S.infos}.MENTIONS_INFOS.${i}.valeur`}>
                      {href ? (
                        <a href={href} className="underline-offset-2 hover:underline">
                          {info.valeur}
                        </a>
                      ) : (
                        info.valeur
                      )}
                    </Editable>
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </Rubrique>

      <Rubrique id="responsabilite" numero={2} titre={T.MENTIONS_RESPONSABILITE_TITRE} cms={`${S.responsabilite}.MENTIONS_RESPONSABILITE_TITRE`}>
        <Paragraphes texte={T.MENTIONS_RESPONSABILITE_TEXTE} cms={`${S.responsabilite}.MENTIONS_RESPONSABILITE_TEXTE`} />
      </Rubrique>

      <Rubrique id="cookies" numero={3} titre={T.MENTIONS_COOKIES_TITRE} cms={`${S.cookies}.MENTIONS_COOKIES_TITRE`}>
        <Paragraphes texte={T.MENTIONS_COOKIES_TEXTE} cms={`${S.cookies}.MENTIONS_COOKIES_TEXTE`} />
        <Encart picto="bouclier" cms={`${S.cookies}.MENTIONS_COOKIES_NOTE`}>
          {T.MENTIONS_COOKIES_NOTE}
        </Encart>
      </Rubrique>

      <Rubrique id="propriete" numero={4} titre={T.MENTIONS_PROPRIETE_TITRE} cms={`${S.propriete}.MENTIONS_PROPRIETE_TITRE`}>
        <Paragraphes texte={T.MENTIONS_PROPRIETE_TEXTE} cms={`${S.propriete}.MENTIONS_PROPRIETE_TEXTE`} />
      </Rubrique>

      <Rubrique id="donnees" numero={5} titre={T.MENTIONS_DONNEES_TITRE} cms={`${S.donnees}.MENTIONS_DONNEES_TITRE`}>
        <Paragraphes texte={T.MENTIONS_DONNEES_TEXTE} cms={`${S.donnees}.MENTIONS_DONNEES_TEXTE`} />
        <ListePuces elements={T.MENTIONS_DONNEES_LISTE} cms={`${S.donnees}.MENTIONS_DONNEES_LISTE`} />
        <p className="mt-5 text-[14px] text-encre/75">
          {tr("En savoir plus :")}{" "}
          <Link href="/politique-de-confidentialite" className="font-semibold text-club-950 underline underline-offset-4">
            {T.CONFIDENTIALITE_TITRE}
          </Link>
        </p>
      </Rubrique>

      <Rubrique id="credits" numero={6} titre={T.MENTIONS_CREDITS_TITRE} cms={`${S.credits}.MENTIONS_CREDITS_TITRE`}>
        <Paragraphes texte={T.MENTIONS_CREDITS_TEXTE} cms={`${S.credits}.MENTIONS_CREDITS_TEXTE`} />
        <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4 border border-encre/10 p-5">
          <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-md bg-encre text-[18px] text-white">
            ✦
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-butler text-[20px] font-medium text-club-950">Orion Studio</p>
            <dl className="mt-1 flex flex-wrap gap-x-8 gap-y-1 text-[12px]">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-encre/45">{tr("Conception graphique")}</dt>
                <dd className="text-club-950">Orion Studio</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-encre/45">{tr("Développement")}</dt>
                <dd className="text-club-950">Orion Studio</dd>
              </div>
            </dl>
          </div>
          <a href="https://orion-studio.io" target="_blank" rel="noopener" className="text-[13px] font-semibold text-club-950 hover:underline">
            orion-studio.io <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Rubrique>
    </PageLegale>
  );
}
