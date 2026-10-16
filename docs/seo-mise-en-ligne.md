# SEO — ce qui est en place et check-list de mise en ligne

Domaine officiel : **https://www.chateaularcgolfclub.com** (avec www).

## En place dans le code

| Point | Détail |
| --- | --- |
| Titres et descriptions | Uniques par page, ciblés « golf 18 trous / Aix-en-Provence / Fuveau / Sainte-Victoire », 45 à 60 caractères pour les titres (gabarit « … \| Château l'Arc Golf Club »), 135 à 160 pour les descriptions. |
| Balise canonique | Propre à chaque page (`lib/seo.tsx`). L'ancienne version renvoyait toutes les pages vers l'accueil. |
| Open Graph et Twitter | Titre, description et image 1200 × 630 par page (`public/og/`, `scripts/generer-og.mjs`) ; affiche pour les compétitions. |
| Indexation | Pages encore en construction en `noindex, follow` (restaurant, devenir membre, mentions légales…), actualités de démonstration aussi. Retirer `indexable: false` et les ajouter au sitemap quand elles auront leur contenu. |
| Sitemap | `/sitemap.xml` : pages indexables et compétitions publiées, avec leurs images. |
| robots.txt | Ouvert, sauf `/admin`, `/api/` et l'aperçu de l'éditeur (`?edit`). Prévisualisations Vercel : tout fermé. |
| Hors domaine officiel | En-tête `X-Robots-Tag: noindex` sur toute autre adresse (`*.vercel.app`, prévisualisations) : pas de contenu dupliqué. Back-office toujours en noindex. |
| Données structurées | Accueil : `GolfCourse` + `SportsActivityLocation` (adresse, coordonnées, téléphone, équipements) et `WebSite`. Fil d'Ariane (`BreadcrumbList`) sur les pages à bannière. `SportsEvent` sur chaque compétition (date, lieu, droit de jeu). `FAQPage` sur la FAQ. |
| Structure | Un seul H1 par page, hiérarchie H1 → H2 → H3, `lang="fr"`, toutes les images avec un attribut `alt`, aucun lien interne cassé (audit automatisé). |
| Performance | Image de bannière (LCP) chargée en priorité, images en WebP aux bonnes tailles, police en `display: swap`, pas de fichier inutile embarqué côté serveur. |
| URL | Une seule version par page : « / » final supprimé en 301, ancien site redirigé en 301 (`docs/plan-redirections-301.md`). |
| Icônes | Favicon SVG, icône Apple 180 px, manifeste web avec icônes 192 et 512 px. |

## À faire à la mise en ligne

1. **Vercel → Settings → Domains** : ajouter `www.chateaularcgolfclub.com` (domaine principal) et `chateaularcgolfclub.com` en redirection permanente vers le www. Mettre à jour les DNS chez le registraire selon les indications de Vercel.
2. **Vercel → Environment Variables** : `NEXT_PUBLIC_SITE_URL=https://www.chateaularcgolfclub.com` (Production), puis redéployer.
3. **Google Search Console** : propriété de domaine `chateaularcgolfclub.com` (vérification DNS), ou balise meta via la variable `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. Soumettre `https://www.chateaularcgolfclub.com/sitemap.xml`. Même chose dans Bing Webmaster Tools (import depuis Search Console).
4. **Fiche Google Business Profile** : vérifier que l'URL du site pointe vers `https://www.chateaularcgolfclub.com/` (sans `/fr/`), et que le nom, l'adresse et le téléphone sont identiques à ceux du site.
5. **Contrôles** : test des résultats enrichis de Google sur l'accueil, `/competitions/<une-competition>` et `/faq` ; PageSpeed Insights sur l'accueil (mobile).
6. **Suivi les 4 premières semaines** : rapport « Pages » de Search Console (404 éventuels à rediriger), positions sur « golf Aix-en-Provence », « golf Fuveau », « golf Sainte-Victoire », « école de golf Aix ».

## À compléter côté contenu (impact SEO fort)

- Remplir les pages en construction (restaurant, séminaires et privatisation, devenir membre, proshop, mentions légales…) puis les rendre indexables.
- Renseigner les réseaux sociaux du club (`reseaux` dans `src/config/site.ts`) : ils alimentent `sameAs` des données structurées.
- Ajouter les horaires d'ouverture de l'accueil (données structurées `openingHours`).
- Brancher un vrai blog (rubrique Blog) : actualités régulières = signal de fraîcheur, et destination naturelle des anciennes actualités.
