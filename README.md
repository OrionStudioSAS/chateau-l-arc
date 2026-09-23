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

Squelette du mini back-office : barre latérale, sections et écran « Statut & bandeau ».
Seul le champ **Message du bandeau** est fonctionnel aujourd'hui — il alimente la barre
d'information en haut du site public (`AnnouncementBar`).

L'écriture passe par l'action serveur `publierBandeau` : elle vérifie la session, met à
jour la ligne dans Supabase puis invalide l'étiquette de cache `bandeau`, ce qui
rafraîchit le site public immédiatement.

### Accès et authentification

Les routes `/admin` sont protégées par Supabase Auth (e-mail + mot de passe) :

- `src/proxy.ts` (l'équivalent Next 16 de l'ancien middleware) rafraîchit la session et
  renvoie vers `/admin/connexion` tout visiteur non connecté ;
- le layout du tableau de bord revérifie la session côté serveur, car un contrôle dans le
  proxy seul ne protège pas les données ;
- la vérification repose sur `supabase.auth.getClaims()`, qui valide la signature du JWT —
  `getSession()` ne revalide pas le jeton et ne doit pas servir à autoriser.

**Être authentifié ne suffit pas.** L'inscription reste ouverte via la clé publishable,
donc l'accès dépend d'une liste blanche : la table `administrateurs`. Un compte absent de
cette table est déconnecté à la volée et ne peut rien écrire (les politiques RLS
l'exigent aussi côté base).

Pour ouvrir un accès :

1. créer l'utilisateur dans le tableau de bord Supabase
   (*Authentication → Users → Add user*) ;
2. l'inscrire dans la liste blanche :

```sql
insert into public.administrateurs (id, email)
select id, email from auth.users where email = 'adresse@du-club.fr';
```

### Base de données

Projet Supabase « chateau l'arc ». Tables :

| Table | Rôle | RLS |
| --- | --- | --- |
| `bandeau` | Ligne unique (`id = 'principal'`) : message, activation, lien, date de publication | Lecture publique, écriture réservée aux administrateurs |
| `administrateurs` | Comptes autorisés sur le back-office | Chaque compte ne voit que sa propre fiche |
| `competitions` | Calendrier des compétitions, brouillons compris | Le public ne voit que `statut = 'publie'` ; création, modification et suppression réservées aux administrateurs |

L'état affiché sur une compétition (« Inscriptions ouvertes », « Ouverture le 15/10 »,
« Résultats en attente »…) n'est pas stocké : il est déduit des dates par
`etatCompetition()` (`src/lib/competitions.ts`), appelé côté serveur avec une date
passée explicitement pour rester déterministe dans les scopes `use cache`.

Le site public lit le bandeau avec un client **sans cookies**
(`src/lib/supabase/public.ts`), seul compatible avec un scope `use cache` ; le
back-office utilise le client lié à la session (`src/lib/supabase/server.ts`).

## À faire

- Remplacer les coordonnées marquées `TODO` dans `src/config/site.ts`.
- Intégrer le blason du club à la place du lettrage de `src/components/layout/logo.tsx`.
- Confirmer les destinations des liens d'en-tête (`/informations-parcours`, `/devenir-membre`,
  `/reserver` — réservation interne ou plateforme externe ?).
- Aligner la palette de `src/app/globals.css` sur la charte (la typo est fixée :
  Bricolage Grotesque, chargée dans `src/app/layout.tsx`).
- Assainir le HTML éditorial (`dangerouslySetInnerHTML`) ou le recevoir déjà nettoyé.
- Définir l'endpoint d'envoi du formulaire de contact.
- Désactiver l'inscription publique dans Supabase (*Authentication → Sign In / Providers*)
  en complément de la liste blanche.
- Compléter le back-office : statut du golf, pop-up marketing, aide.
- Compétitions : dépôt de l'affiche et publication des résultats (PDF) — les deux
  supposent un bucket Supabase Storage.
- Mentions légales et politique de confidentialité.
