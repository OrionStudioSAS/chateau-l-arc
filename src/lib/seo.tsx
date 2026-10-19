import type { Metadata } from "next";

import { reseaux, site, urlItineraire } from "@/config/site";
import type { CompetitionAvecEtat } from "@/lib/api/types";
import { infoLangue, LANGUE_PRINCIPALE, languesPubliees } from "@/lib/i18n/langues";
import { cheminLocal } from "@/lib/i18n/chemins";
import { i18n } from "@/lib/i18n/serveur";

/**
 * SEO : métadonnées par page et données structurées (JSON-LD, schema.org).
 *
 * Chaque page déclare son titre, sa description et son chemin : la balise
 * canonique, Open Graph et Twitter en découlent, sans jamais hériter de ceux
 * d'une autre page.
 */

/** Image de partage par défaut (1200 × 630, cf. scripts/generer-og.mjs). */
export const IMAGE_PARTAGE = "/og/accueil.jpg";

export async function metadonnees({
  titre,
  titreAbsolu,
  description,
  chemin,
  image = IMAGE_PARTAGE,
  indexable = true,
}: {
  /** Titre court : le gabarit ajoute « | Château l'Arc Golf Club ». */
  titre?: string;
  /** Titre complet, sans gabarit (accueil). */
  titreAbsolu?: string;
  description: string;
  /** Chemin de la page, ex. « /tarifs ». */
  chemin: string;
  image?: string;
  /** Faux : page encore en construction ou sans contenu propre (noindex, follow). */
  indexable?: boolean;
}): Promise<Metadata> {
  // Titre, description et adresses dans la langue de la page ; les versions
  // des autres langues publiées sont déclarées en hreflang.
  const { langue, tr } = await i18n();
  const titreLocal = titre ? tr(titre) : undefined;
  const titreAbsoluLocal = titreAbsolu ? tr(titreAbsolu) : undefined;
  const descriptionLocale = tr(description);
  const adresse = cheminLocal(chemin, langue);
  const titrePartage = titreAbsoluLocal ?? `${titreLocal} | ${site.nomMarque}`;
  return {
    title: titreAbsoluLocal ? { absolute: titreAbsoluLocal } : titreLocal,
    description: descriptionLocale,
    alternates: {
      canonical: adresse,
      ...(indexable
        ? {
            languages: {
              ...Object.fromEntries(languesPubliees.map((l) => [l.code, cheminLocal(chemin, l.code)])),
              "x-default": cheminLocal(chemin, LANGUE_PRINCIPALE),
            },
          }
        : {}),
    },
    openGraph: {
      type: "website",
      locale: infoLangue(langue).locale,
      alternateLocale: languesPubliees.filter((l) => l.code !== langue).map((l) => l.locale),
      siteName: site.nomMarque,
      url: adresse,
      title: titrePartage,
      description: descriptionLocale,
      // Dimensions connues seulement pour les images de partage générées (/og/).
      images: [image.startsWith("/og/") ? { url: image, width: 1200, height: 630, alt: titrePartage } : { url: image, alt: titrePartage }],
    },
    twitter: { card: "summary_large_image", title: titrePartage, description: descriptionLocale, images: [image] },
    // Page non indexable, ou langue pas encore publiée (traduction en cours).
    ...(indexable && infoLangue(langue).publiee ? {} : { robots: { index: false, follow: true } }),
  };
}

/** Adresse du domaine, partagée par toutes les données structurées. */
const adresse = {
  "@type": "PostalAddress",
  streetAddress: site.contact.adresse,
  postalCode: "13710",
  addressLocality: "Fuveau",
  addressRegion: "Provence-Alpes-Côte d'Azur",
  addressCountry: "FR",
};

const lieu = () => ({
  "@type": "Place",
  name: site.nomMarque,
  address: adresse,
  geo: { "@type": "GeoCoordinates", ...site.contact.coordonnees },
});

const absolu = (chemin: string) => new URL(chemin, site.url).toString();

/** Le golf : terrain, club et lieu d'activité (page d'accueil). */
export async function jsonLdGolf() {
  const { tr, langue } = await i18n();
  return {
    "@context": "https://schema.org",
    "@type": ["GolfCourse", "SportsActivityLocation"],
    "@id": `${site.url}/#golf`,
    name: site.nomMarque,
    alternateName: [site.name, "Golf de Château l'Arc", "Golf Château l'Arc Fuveau"],
    description: tr(
      "Golf 18 trous par 70 (5 817 m) dessiné par Robert Trent Jones II en 1985, entre pins et garrigue, face à la montagne Sainte-Victoire, à 15 minutes d'Aix-en-Provence.",
    ),
    url: absolu(cheminLocal("/", langue)),
    logo: absolu("/icons/icone-512.png"),
    image: [absolu("/og/accueil.jpg"), absolu("/og/parcours.jpg")],
    telephone: "+33442298341",
    email: site.contact.email,
    address: adresse,
    geo: { "@type": "GeoCoordinates", ...site.contact.coordonnees },
    hasMap: urlItineraire,
    areaServed: ["Aix-en-Provence", "Marseille", "Fuveau", "Bouches-du-Rhône"],
    priceRange: "€€",
    currenciesAccepted: "EUR",
    amenityFeature: ["Practice", "Putting-green", "Club-house", "Restaurant", "Proshop", "École de golf"].map(
      (nom) => ({ "@type": "LocationFeatureSpecification", name: tr(nom), value: true }),
    ),
    sameAs: reseaux.map((r) => r.url).filter(Boolean),
  };
}

export async function jsonLdSiteWeb() {
  const { langue } = await i18n();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#site`,
    name: site.nomMarque,
    alternateName: site.name,
    inLanguage: languesPubliees.map((l) => l.locale.replace("_", "-")),
    url: absolu(cheminLocal("/", langue)),
    publisher: { "@id": `${site.url}/#golf` },
  };
}

/** Fil d'Ariane (BreadcrumbList), d'après celui affiché dans la bannière. */
export function jsonLdFilAriane(etapes: { label: string; href?: string }[], cheminCourant?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: etapes.map((etape, index) => {
      // La dernière étape (page courante) n'a pas de lien : son URL vient du chemin.
      const cible = etape.href ?? (index === etapes.length - 1 ? cheminCourant : undefined);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: etape.label,
        ...(cible ? { item: absolu(cible) } : {}),
      };
    }),
  };
}

/** Compétition (SportsEvent) : date, lieu, inscription, organisateur. */
export async function jsonLdCompetition(competition: CompetitionAvecEtat, description?: string) {
  const { tr, lien } = await i18n();
  const prix = competition.droitJeuMembres?.match(/\d+(?:[.,]\d+)?/)?.[0]?.replace(",", ".");
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: tr(competition.nom),
    sport: "Golf",
    startDate: competition.dateDebut,
    endDate: competition.dateFin ?? competition.dateDebut,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: lieu(),
    organizer: { "@type": "SportsOrganization", name: site.nomMarque, url: site.url },
    url: absolu(lien(`/competitions/${competition.slug}`)),
    ...(description ? { description } : {}),
    ...(competition.afficheUrl ? { image: [absolu(competition.afficheUrl)] } : { image: [absolu("/og/competitions.jpg")] }),
    ...(prix
      ? {
          offers: {
            "@type": "Offer",
            price: prix,
            priceCurrency: "EUR",
            url: absolu(lien(`/competitions/${competition.slug}`)),
            availability:
              competition.etat.cle === "ouverte" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
            ...(competition.inscriptionOuverture ? { validFrom: competition.inscriptionOuverture } : {}),
          },
        }
      : {}),
  };
}

/** Balise <script type="application/ld+json">, échappée contre l'injection HTML. */
export function JsonLd({ donnees }: { donnees: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees).replace(/</g, "\\u003c") }}
    />
  );
}
