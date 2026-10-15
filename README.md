# Golf Château l'Arc — site vitrine

Site vitrine dynamique du Golf Château l'Arc.
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · pnpm.

## Démarrer

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Le site tourne sur http://localhost:3000.

## Scripts

| Commande | Rôle |
| --- | --- |
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build de production |
| `pnpm start` | Serveur de production (après build) |
| `pnpm lint` | ESLint |

## Structure

```
src/
  app/
    layout.tsx         Document, polices, styles (racine)
    (site)/            Site public — bandeau, en-tête, pied de page
    (admin)/admin/     Back-office — barre latérale, actions serveur
    api/revalidate/    Webhook d'invalidation du cache
  components/
    admin/             Écrans et briques du back-office
    layout/            Bandeau, en-tête, pied de page, hero de page
    sections/          Blocs de page réutilisables
    ui/                Primitives (conteneur, bouton, titre de section)
  config/
    site.ts            Nom, coordonnées, navigation publique
    admin.ts           Sections du back-office
  lib/
    api/               Client HTTP, contrats de types, lectures mises en cache
    api/mock/          Jeux de données de démonstration
    format.ts          Dates et prix en fr-FR
```

## Contenu et API

La source de contenu n'est pas encore arrêtée. Tout passe par `src/lib/api/content.ts` :

- si `API_BASE_URL` est absent, les fonctions renvoient les données de `src/lib/api/mock/` ;
- sinon, elles appellent l'API via `src/lib/api/client.ts`.

Brancher l'API réelle revient donc à renseigner `API_BASE_URL` (et `API_TOKEN`), puis à
ajuster les chemins/mapping dans `content.ts` si la forme des réponses diffère des types
décrits dans `src/lib/api/types.ts`.

### Cache et invalidation

Le projet utilise le modèle Cache Components de Next 16 (`cacheComponents: true`) :
chaque lecture porte un `use cache`, un `cacheTag` et un `cacheLife`.

Pour rafraîchir après une publication, l'API appelle :

```bash
curl -X POST https://<domaine>/api/revalidate \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -H "content-type: application/json" \
  -d '{"tags":["actualites","actualite:mon-slug"]}'
```

## État des pages

| Route | État |
| --- | --- |
| `/` | Hero, accès, actualités (en attente de la maquette définitive) |
| `/le-parcours`, `/histoire`, `/academie` | Coquilles en attente de maquette |
| `/informations-parcours`, `/devenir-membre`, `/reserver` | Coquilles créées pour les liens de l'en-tête |
| `/tarifs` | Liste branchée sur la couche contenu (montants factices) |
| `/actualites`, `/actualites/[slug]` | Branchées sur la couche contenu |
| `/competitions`, `/competitions/[slug]` | Branchées sur la couche contenu (API : `/evenements`) |
| `/contact` | Coordonnées ; formulaire à brancher |
| `/admin` | Bandeau d'information (champ message) ; bloc « Statut du golf » à venir |
| `/admin/competitions` | Liste paginée, création et modification d'une compétition |
| `/admin/popup-marketing`, `/admin/aide` | Sections vides, en attente de maquette |

## Rythme et fonds des sections

Chaque section de l'accueil porte `py-20`, soit **80 px de padding en haut et en bas**.
Garder cette convention en ajoutant une section.

Le fond général du site est `--color-sable-50` (#F9F6F0) et toutes les sections en
héritent. Seule la section de présentation (« Le plus beau golf entre Aix et Marseille »)
est sur fond blanc.

## En-tête et bandeau

Seul l'en-tête est `sticky top-0` : en haut de page il se place naturellement sous le
bandeau, puis se bloque en haut de la fenêtre dès que celui-ci a défilé. Le bandeau reste
en flux normal et sort de l'écran au scroll.

L'en-tête est transparent tant que la page n'a pas défilé, mais uniquement sur les pages
listées dans `routesHeroSombre` (`src/config/site.ts`) — ailleurs il serait illisible sur
fond clair. Le hero concerné remonte sous l'en-tête via `-mt-20`, compensé par son padding
haut ; en changer la hauteur suppose d'ajuster les deux.

## Back-office (`/admin`)

Mini back-office pour l'équipe du club : statut du golf et bandeau, compétitions
(avec PDF de résultats), pop-up marketing. **Il n'y a pas de base de données** : comme
pour Orion admin, le dépôt GitHub fait office de stockage.

### Contenu stocké dans le dépôt

| Fichier | Contenu |
| --- | --- |
| `contenu/statut.json` | Bandeau d'information + état des installations (menu « Parcours ouvert ») |
| `contenu/competitions.json` | Calendrier des compétitions, brouillons compris |
| `contenu/popup.json` | Pop-up marketing (une seule) |
| `contenu/fichiers/` | PDF de résultats et affiches déposés, servis par `/fichiers/…` |

Chaque publication du back-office est **un commit** sur `main`, fait par l'API REST de
GitHub (`src/lib/contenu/depot.ts`) : plusieurs fichiers partent dans le même commit, et
une publication concurrente est rejouée sur la nouvelle version. L'action invalide
ensuite l'étiquette de cache concernée.

Le site lit ces fichiers **sur GitHub** (`lireContenu`, `src/lib/contenu/stockage.ts`),
dans des scopes `use cache` : une publication est donc visible tout de suite, sans
attendre de redéploiement. Les fichiers déposés le sont aussi, via la route
`src/app/fichiers/[...chemin]`. Si GitHub ne répond pas, le site sert la copie
embarquée au dernier build. `vercel.json` évite un build Vercel pour un commit qui ne
touche que `contenu/`.

Le dépôt étant public, tout ce qui est saisi dans le back-office (brouillons compris)
y est lisible.

### Accès et authentification

Les comptes sont déclarés dans la variable d'environnement `ADMIN_COMPTES` : une
entrée par compte, séparées par des virgules, au format `email:scrypt:<sel>:<empreinte>`.
Le mot de passe n'est jamais stocké, seulement son empreinte scrypt. Pour créer
une entrée :

```bash
node scripts/creer-compte-admin.mjs
```

La session est un cookie signé (HMAC-SHA256, 7 jours) avec `ADMIN_SECRET_SESSION`.
Retirer une entrée d'`ADMIN_COMPTES` coupe l'accès, y compris aux sessions ouvertes ;
changer `ADMIN_SECRET_SESSION` déconnecte tout le monde.

- `src/proxy.ts` renvoie vers `/admin/connexion` tout visiteur sans session valide ;
- le layout du tableau de bord et chaque action serveur revérifient la session et
  l'existence du compte, car un contrôle dans le proxy seul ne protège pas les données.

### Variables d'environnement (Vercel → Settings → Environment Variables)

| Variable | Rôle |
| --- | --- |
| `GITHUB_TOKEN` | Jeton *fine-grained* limité au dépôt, permission **Contents : Read and write** |
| `ADMIN_COMPTES` | Comptes du back-office (cf. ci-dessus) |
| `ADMIN_SECRET_SESSION` | Clé aléatoire d'au moins 32 caractères (`openssl rand -base64 32`) |
| `GITHUB_DEPOT`, `GITHUB_BRANCHE` | Facultatives : `OrionStudioSAS/chateau-l-arc` et `main` par défaut |

En local, sans `GITHUB_TOKEN`, le jeton de la GitHub CLI (`gh auth token`) est utilisé,
et une clé de session de développement remplace `ADMIN_SECRET_SESSION`. Attention :
même en local, une publication écrit sur la branche du dépôt (`GITHUB_BRANCHE` pour
travailler sur une autre).

### Statistiques de l'accueil

Mesure d'audience maison, sans service payant ni cookie : le composant
`SuiviAnalytics` envoie chaque page vue et certains clics (inscriptions, pop-up,
liens `tel:`, réservation, éléments `data-suivi="…"`) à `POST /api/suivi`, qui
incrémente des compteurs par jour dans Redis (Upstash, offre gratuite). Le visiteur
n'est identifié que par une empreinte de son IP et de son navigateur, salée par une
clé qui change chaque jour : rien n'est stocké en clair et personne n'est suivi d'un
jour à l'autre. Seule la production est comptée (pas les prévisualisations Vercel).

L'accueil du back-office lit ces compteurs (`src/lib/analytics/statistiques.ts`).
Pour l'activer : Vercel → Storage → Create Database → **Upstash for Redis** (offre
gratuite), relié au projet ; Vercel ajoute seul `KV_REST_API_URL` et `KV_REST_API_TOKEN`.

L'état affiché sur une compétition (« Inscriptions ouvertes », « Ouverture le 15/10 »,
« Résultats en attente »…) n'est pas stocké : il est déduit des dates par
`etatCompetition()` (`src/lib/competitions.ts`), appelé côté serveur avec une date
passée explicitement pour rester déterministe dans les scopes `use cache`.

## À faire

- Remplacer les coordonnées marquées `TODO` dans `src/config/site.ts`.
- Intégrer le blason du club à la place du lettrage de `src/components/layout/logo.tsx`.
- Confirmer les destinations des liens d'en-tête (`/informations-parcours`, `/devenir-membre`,
  `/reserver` — réservation interne ou plateforme externe ?).
- Aligner la palette de `src/app/globals.css` sur la charte (la typo est fixée :
  Bricolage Grotesque, chargée dans `src/app/layout.tsx`).
- Assainir le HTML éditorial (`dangerouslySetInnerHTML`) ou le recevoir déjà nettoyé.
- Définir l'endpoint d'envoi du formulaire de contact.
- Compétitions : dépôt de l'affiche depuis le back-office.
- Mentions légales et politique de confidentialité.
