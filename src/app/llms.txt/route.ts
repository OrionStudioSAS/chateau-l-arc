import { cacheLife, cacheTag } from "next/cache";

import { site, urlReservation } from "@/config/site";
import { estPagePubliqueVisible } from "@/config/visibilite";
import { getCompetitions, getGrilleTarifs, tags } from "@/lib/api/content";
import { euros, saisonsDe } from "@/lib/tarifs";

/**
 * llms.txt (https://llmstxt.org) : présentation du club et de ses pages pour
 * les assistants IA (ChatGPT, Perplexity, Gemini…), en Markdown. Tarifs et
 * compétitions viennent des mêmes contenus que le site, donc restent à jour
 * après chaque publication depuis le back-office.
 */
const absolu = (chemin: string) => new URL(chemin, site.url).toString();

const formatDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

const pages: { chemin: string; titre: string; description: string }[] = [
  { chemin: "/le-parcours", titre: "Le parcours", description: "18 trous par 70, trou par trou, repères de départ, practice et zone d'entraînement." },
  { chemin: "/tarifs", titre: "Tarifs", description: "Green fees, carnets, locations et abonnements annuels." },
  { chemin: "/academie", titre: "Académie", description: "École de golf juniors dès 4 ans, formules Prestige adultes, stages et initiations." },
  { chemin: "/competitions", titre: "Compétitions", description: "Calendrier de la saison et inscriptions en ligne." },
  { chemin: "/competitions/resultats", titre: "Résultats", description: "Résultats des compétitions passées." },
  { chemin: "/histoire", titre: "Histoire du domaine", description: "Le château depuis 1620 et la création du golf en 1985." },
  { chemin: "/faq", titre: "Questions fréquentes", description: "Réservation, niveau requis, tenue, tarifs, accès." },
  { chemin: "/contact", titre: "Contact et accès", description: "Coordonnées et itinéraire." },
];

async function contenu() {
  "use cache";
  cacheTag(tags.tarifs, tags.competitions);
  cacheLife("hours");

  const [grille, competitions] = await Promise.all([getGrilleTarifs(), getCompetitions()]);
  const saisons = saisonsDe(grille);
  const aVenir = competitions.filter((competition) => competition.etat.cle !== "terminee");

  const ligne = (libelle: string, detail: string | null, prix: string) =>
    `- ${libelle}${detail ? ` (${detail.replace(/\.$/, "")})` : ""} : ${prix}`;

  return [
    `# ${site.nomMarque}`,
    "",
    `> Golf 18 trous par 70 (5 817 m) dessiné par Robert Trent Jones II en 1985, au Domaine Château l'Arc à Fuveau (13710), entre Aix-en-Provence et Marseille, face à la montagne Sainte-Victoire. Ouvert à tous, toute l'année : membres comme visiteurs.`,
    "",
    "## Informations pratiques",
    "",
    `- Adresse : ${site.contact.adresse}, ${site.contact.codePostalVille}, France`,
    `- Téléphone de l'accueil : ${site.contact.telephone}`,
    `- E-mail : ${site.contact.email}`,
    `- Réservation des départs en ligne : ${urlReservation}`,
    "- Accès : 15 minutes d'Aix-en-Provence, 25 minutes de l'aéroport Marseille Provence et de la gare TGV d'Aix-en-Provence, 5 minutes de l'autoroute A8.",
    "- Sur place : practice, putting-green, club-house, restaurant, proshop, école de golf, salons de réception.",
    "",
    "## Pages",
    "",
    `- [Accueil](${absolu("/")}) : présentation du club.`,
    ...pages
      .filter((page) => estPagePubliqueVisible(page.chemin))
      .map((page) => `- [${page.titre}](${absolu(page.chemin)}) : ${page.description}`),
    "",
    "## Tarifs",
    "",
    `${saisons.haute.libelle} : ${saisons.haute.detail.toLowerCase()} ${saisons.basse.libelle} : ${saisons.basse.detail.toLowerCase()}`,
    "",
    "### Green fees (par joueur)",
    "",
    ...grille.greenFees.map((fee) => ligne(fee.libelle, fee.detail, euros(fee.prix))),
    "",
    "### Carnets",
    "",
    ...grille.carnets.map((carnet) => ligne(carnet.libelle, carnet.detail, euros(carnet.prix))),
    "",
    "### Locations et practice (visiteurs / membres)",
    "",
    ...grille.locations.map((location) =>
      ligne(
        location.libelle,
        location.detail,
        location.membres === null ? euros(location.prix) : `${euros(location.prix)} / ${euros(location.membres)}`,
      ),
    ),
    "",
    "### Abonnements annuels",
    "",
    ...grille.abonnements.map((abonnement) => ligne(abonnement.libelle, abonnement.detail, `${euros(abonnement.prix)} par an`)),
    `- Remise de ${Math.round(grille.remiseComptant.taux * 100)} % en paiement comptant jusqu'au ${grille.remiseComptant.jusquau}.`,
    "",
    ...(aVenir.length > 0 && estPagePubliqueVisible("/competitions")
      ? [
          "## Prochaines compétitions",
          "",
          ...aVenir.map(
            (competition) =>
              `- [${competition.nom}](${absolu(`/competitions/${competition.slug}`)}) : ${formatDate.format(new Date(`${competition.dateDebut.slice(0, 10)}T12:00:00`))}, ${competition.formule}, ${competition.etat.libelle.toLowerCase()}${competition.ouverteVisiteurs ? ", ouverte aux visiteurs" : ""}.`,
          ),
          "",
        ]
      : []),
    "## Optional",
    "",
    `- [Plan du site](${absolu("/sitemap.xml")})`,
    "",
  ].join("\n");
}

export async function GET() {
  return new Response(await contenu(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
