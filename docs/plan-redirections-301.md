# Plan de redirections 301 — ancien site → nouveau site

Domaine : **https://www.chateaularcgolfclub.com** (l'ancien et le nouveau site partagent le même domaine).

Les règles sont dans `src/config/redirections.ts` et servies par `next.config.ts` avec un vrai code **301**. Chaque ancienne URL est couverte avec et sans « / » final, en **un seul saut** vers une page qui répond 200 ; la chaîne de requête (`?utm_…`) est conservée. Table produite en testant chaque URL sur le build de production.

## Principes

- **Équivalent exact quand il existe** (`/fr/tarifs` → `/tarifs`, `/fr/histoire` → `/histoire`…).
- **Sinon, la page la plus proche du sujet** : les 18 pages « Trou n° X » vers `/le-parcours` (section Trou par trou) ; les fiches des anciennes compétitions vers `/competitions` ; chaque ancienne actualité vers la page de son thème (état du parcours, résultats, recrutement…).
- **Jamais l'accueil par défaut** pour une page qui a un équivalent : Google traite une redirection massive vers l'accueil comme une page introuvable (soft 404). Seul un filet `/fr/*` pour des URL inconnues mène à l'accueil.
- **PDF de l'ancienne plateforme** (`/models/golfcompetition/…`, `/models/gallerymedia/…`) : vers les résultats et le calendrier.
- **Espace membre** (`/connexion`, `/account/…`) : vers la réservation en ligne Prima Golf.

## Règles génériques (filets)

| Ancienne URL | Nouvelle URL |
| --- | --- |
| `/fr/parcours/*` | `/le-parcours` |
| `/fr/competitions/list/*`, `/fr/competitions/*` | `/competitions` |
| `/fr/actualites/*` (non listée ci-dessous) | `/competitions` |
| `/models/golfcompetition/*` (PDF départs et résultats) | `/competitions/resultats` |
| `/models/gallerymedia/*` (documents de l'AS) | `/competitions` |
| `/connexion/*`, `/account/*` | https://prima.golf/sainte-victoire/home |
| `/videos/*` | `/le-parcours` |
| `/fr/*` (toute autre ancienne page) | `/` |
| Toute URL du nouveau site avec « / » final | même URL sans « / » |

## Table complète (157 URL relevées sur l'ancien site, octobre 2026)

### Pages principales (13)

| Ancienne URL | Titre de l'ancienne page | Nouvelle URL |
| --- | --- | --- |
| `/` | Accueil | `/` (même adresse, nouvelle page) |
| `/fr/accueil-1` | Accueil | `/` |
| `/fr/contact` | Contact | `/contact` |
| `/fr/histoire` | Histoire | `/histoire` |
| `/fr/le-chateau-d-arc` | Le Château l'Arc | `/histoire` |
| `/fr/mentions-legales-credits` | Mentions légales & Crédits | `/` (page pas encore construite) |
| `/fr/nos-salles` | Nos salles | `/contact` (page Groupe & privatisation pas encore construite) |
| `/fr/nous-suivre` | Nous suivre | `/contact` |
| `/fr/organisation` | Nos Partenaires | `/` |
| `/fr/politique-de-confidentialite` | Politique de confidentialité | `/` (page pas encore construite) |
| `/fr/presentation-1` | Présentation | `/academie` |
| `/fr/s-inscrire` | S'inscrire | `/academie` |
| `/fr/tarifs` | Tarifs | `/tarifs` |

### Parcours et trou par trou (22)

| Ancienne URL | Titre de l'ancienne page | Nouvelle URL |
| --- | --- | --- |
| `/fr/actualites/actualites-publiques/parcours-point-au-17-novembre` | Actualités - Parcours I point au 17 novembre | `/informations-parcours` |
| `/fr/actualites/articles/parcours-point-au-17-novembre` | Actualités - Parcours I point au 17 novembre | `/informations-parcours` |
| `/fr/parcours` | Parcours | `/le-parcours` |
| `/fr/parcours/parcours/1` | Trou n° 1 - Trou n°1 | `/le-parcours` |
| `/fr/parcours/parcours/10` | Trou n° 10 - Trou n°10 | `/le-parcours` |
| `/fr/parcours/parcours/11` | Trou n° 11 - Trou n°11 | `/le-parcours` |
| `/fr/parcours/parcours/12` | Trou n° 12 - Trou n°12 | `/le-parcours` |
| `/fr/parcours/parcours/13` | Trou n° 13 - Trou n°13 | `/le-parcours` |
| `/fr/parcours/parcours/14` | Trou n° 14 - Trou n°14 | `/le-parcours` |
| `/fr/parcours/parcours/15` | Trou n° 15 - Trou n°15 | `/le-parcours` |
| `/fr/parcours/parcours/16` | Trou n° 16 - Trou n°16 | `/le-parcours` |
| `/fr/parcours/parcours/17` | Trou n° 17 - Trou n°17 | `/le-parcours` |
| `/fr/parcours/parcours/18` | Trou n° 18 - Trou n°18 | `/le-parcours` |
| `/fr/parcours/parcours/2` | Trou n° 2 - Trou n°2 | `/le-parcours` |
| `/fr/parcours/parcours/3` | Trou n° 3 - Trou n°3 | `/le-parcours` |
| `/fr/parcours/parcours/4` | Trou n° 4 - Trou n°4 | `/le-parcours` |
| `/fr/parcours/parcours/5` | Trou n° 5 - Trou n°5 | `/le-parcours` |
| `/fr/parcours/parcours/6` | Trou n° 6 - Trou n°6 | `/le-parcours` |
| `/fr/parcours/parcours/7` | Trou n° 7 - Trou n°7 | `/le-parcours` |
| `/fr/parcours/parcours/8` | Trou n° 8 - Trou n°8 | `/le-parcours` |
| `/fr/parcours/parcours/9` | Trou n° 9 - Trou n°9 | `/le-parcours` |
| `/fr/trou-par-trou` | Trou n° 1 - Trou n°1 | `/le-parcours` |

### Compétitions (74)

| Ancienne URL | Titre de l'ancienne page | Nouvelle URL |
| --- | --- | --- |
| `/fr/association-sportive` | L'association sportive | `/competitions` |
| `/fr/competitions` | Compétitions | `/competitions` |
| `/fr/competitions/academie-chateau-l-arc-1/` | Académie Chateau l'Arc | `/competitions` |
| `/fr/competitions/airbus-industrie/` | AIRBUS INDUSTRIE | `/competitions` |
| `/fr/competitions/aixperts/` | Aixperts | `/competitions` |
| `/fr/competitions/amicale-des-membres-37/` | AMICALE DES MEMBRES | `/competitions` |
| `/fr/competitions/amicale-des-seniors-de-provence-3/` | Amicale des Séniors de Provence | `/competitions` |
| `/fr/competitions/amicale-des-seniors-de-provence-4/` | Amicale des Seniors de Provence | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-18t-1/` | AS-Amicale des Membres 18t | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-18t-3/` | AS-Amicale des Membres 18t | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-18t-4/` | AS-Amicale des Membres 18t | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-18t-5/` | AS-Amicale des Membres 18t | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-18t-6/` | AS-Amicale des Membres 18t | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-18t-7/` | AS-Amicale des Membres 18t | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-18t-8/` | AS-Amicale des Membres 18t | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-27/` | AS-Amicale des Membres | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-28/` | AS - Amicale des membres | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-29/` | AS-Amicale des Membres | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-32/` | AS-Amicale des Membres | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-33/` | AS-Amicale des Membres | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-37/` | AS-Amicale des Membres | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-39/` | AS-Amicale des Membres | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-40/` | AS-Amicale des Membres | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-41/` | AS-Amicale des Membres | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-9t-7/` | AS-Amicale des Membres 9t | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-9t-8/` | AS-Amicale des Membres 9t | `/competitions` |
| `/fr/competitions/as-amicale-des-membres-copy-1/` | AS-Amicale des Membres (copy) | `/competitions` |
| `/fr/competitions/as-race-to-sainte-victoire-ep5-swc/` | AS-Race to Sainte Victoire ep5 / SWC | `/competitions` |
| `/fr/competitions/as-race-to-sainte-victoire-ep6/` | AS-Race to Sainte Victoire ep6 | `/competitions` |
| `/fr/competitions/as-race-to-sainte-victoire-ep7/` | AS-Race to Sainte Victoire ep7 | `/competitions` |
| `/fr/competitions/asaca/` | ASACA | `/competitions` |
| `/fr/competitions/asgca-chateau-l-arc-barbaroux-1/` | ASGCA - Château l'Arc / Barbaroux | `/competitions` |
| `/fr/competitions/asgca-chateau-l-arc-beauvallon-3/` | ASGCA - Château l'Arc / Beauvallon | `/competitions` |
| `/fr/competitions/asgca-chateau-l-arc-esterel-2/` | ASGCA - Château l'Arc / Esterel | `/competitions` |
| `/fr/competitions/asp/` | ASP | `/competitions` |
| `/fr/competitions/asptt-2/` | Asptt | `/competitions` |
| `/fr/competitions/competition-asp-1/` | Competition ASP | `/competitions` |
| `/fr/competitions/competition-classement-edg-1/` | Competition Classement EDG | `/competitions` |
| `/fr/competitions/competition-classement-edg-2/` | Competition Classement EDG | `/competitions` |
| `/fr/competitions/competition-classement-edg-3/` | Competition Classement EDG | `/competitions` |
| `/fr/competitions/competition-classement-edg-4/` | Competition Classement EDG | `/competitions` |
| `/fr/competitions/competition-classement-edg-5/` | Competition Classement EDG | `/competitions` |
| `/fr/competitions/competition-classement-edg-6/` | Competition Classement EDG | `/competitions` |
| `/fr/competitions/competition-classement-edg/` | Competition Classement EDG | `/competitions` |
| `/fr/competitions/competition-edg/` | Compétition EDG | `/competitions` |
| `/fr/competitions/coupe-du-club-house-by-beau-domaine/` | Coupe du Club House by Beau Domaine | `/competitions` |
| `/fr/competitions/dolce-vita/` | DOLCE VITA | `/competitions` |
| `/fr/competitions/drapeau-ecole-de-golf/` | drapeau ecole de golf | `/competitions` |
| `/fr/competitions/drapeaux-ecole-de-golf-3/` | Drapeaux Ecole de Golf | `/competitions` |
| `/fr/competitions/drapeaux-ecole-de-golf-4/` | Drapeaux Ecole de Golf | `/competitions` |
| `/fr/competitions/finale-regionale-sud-somabay-world-cup/` | Finale Régionale PACA Somabay World Cup | `/competitions` |
| `/fr/competitions/golf-des-marques-2/` | Golf des Marques | `/competitions` |
| `/fr/competitions/golf-training-center-1/` | Golf training center | `/competitions` |
| `/fr/competitions/golf-training-center/` | Golf training center | `/competitions` |
| `/fr/competitions/grand-prix-guy-pastor/` | GRAND PRIX GUY PASTOR | `/competitions` |
| `/fr/competitions/interclub-dames-2025/` | Interclub Dames 2025 | `/competitions` |
| `/fr/competitions/junior-serie-1/` | Junior serie 1 | `/competitions` |
| `/fr/competitions/la-coupe-du-personnel-3/` | La Coupe du Personnel | `/competitions` |
| `/fr/competitions/la-coupe-du-personnel-4/` | La Coupe du Personnel | `/competitions` |
| `/fr/competitions/lexus-golf-cup-2025/` | LEXUS GOLF CUP 2025 | `/competitions` |
| `/fr/competitions/list/` | Compétitions | `/competitions` |
| `/fr/competitions/list/chateaularcgolfclub.com` | Compétitions | `/competitions` |
| `/fr/competitions/pitch-83-1/` | Pitch 83 | `/competitions` |
| `/fr/competitions/race-to-sainte-victoire-ep1-2/` | Race to Sainte Victoire ep1 | `/competitions` |
| `/fr/competitions/race-to-sainte-victoire-ep3-1/` | Race to Sainte Victoire ep2 | `/competitions` |
| `/fr/competitions/race-to-sainte-victoire-ep3-2/` | Race to Sainte Victoire ep3 | `/competitions` |
| `/fr/competitions/race-to-sainte-victoire-ep4/` | Race to Sainte Victoire ep4 | `/competitions` |
| `/fr/competitions/race-to-sainte-victoire-ep5/` | Race to Sainte Victoire ep5 | `/competitions` |
| `/fr/competitions/rotary/` | ROTARY | `/competitions` |
| `/fr/competitions/swin-des-cloches/` | Swing des Cloches | `/competitions` |
| `/fr/competitions/trophee-atscaf-2025/` | TROPHEE ATSCAF 2025 | `/competitions` |
| `/fr/competitions/trophee-par-excellence/` | Trophée Par Excellence | `/competitions` |
| `/fr/competitions/welcome-summer-1/` | WELCOME SUMMER | `/competitions` |
| `/fr/competitions/welcome-summer-2/` | WELCOME SUMMER | `/competitions` |

### Actualités (45)

| Ancienne URL | Titre de l'ancienne page | Nouvelle URL |
| --- | --- | --- |
| `/fr/actualites` | Actualités | `/competitions` |
| `/fr/actualites/actualites-publiques/actualites-parcours-17-avril` | Actualités - Actualités parcours 17 avril | `/informations-parcours` |
| `/fr/actualites/actualites-publiques/aeration-des-greens` | Actualités - Aération des Greens | `/informations-parcours` |
| `/fr/actualites/actualites-publiques/aeration-des-greens-et-departs` | Actualités - Aération des Greens | `/informations-parcours` |
| `/fr/actualites/actualites-publiques/agsca-avril-2024` | Actualités - AGSCA AVRIL 2024 | `/competitions/resultats` |
| `/fr/actualites/actualites-publiques/amicale-des-seniors-de-provence-1` | Actualités - Amicale des Séniors de Provence - Mars 24 | `/competitions/resultats` |
| `/fr/actualites/actualites-publiques/amicale-des-seniors-de-provence-avril-24` | Actualités - Amicale des Séniors de Provence - Avril 24 | `/competitions/resultats` |
| `/fr/actualites/actualites-publiques/annonce-speciale-practice` | Actualités - 🏌️‍♂️ Annonce spéciale practice! 🏌️‍♀️ | `/le-parcours` |
| `/fr/actualites/actualites-publiques/asgca-2024` | Actualités - AGSCA fin mars 2024 | `/competitions/resultats` |
| `/fr/actualites/actualites-publiques/bonne-annee-2020` | Actualités - Bonne année 2020 | `/` |
| `/fr/actualites/actualites-publiques/championnat-de-ligue-par-equipes` | Actualités - Championnat de Ligue par Equipes - Dames | `/competitions/resultats` |
| `/fr/actualites/actualites-publiques/championnat-de-ligue-par-equipes-2eme-division-messieurs` | Actualités - Championnat de Ligue par Equipes 2ème Division - Messieurs | `/competitions/resultats` |
| `/fr/actualites/actualites-publiques/championnat-de-ligue-par-equipes-promotion-seniors-messieurs-et-dames` | Actualités - Championnat de Ligue par Equipes Promotion Seniors Messieurs et Dames | `/competitions/resultats` |
| `/fr/actualites/actualites-publiques/decouvrez-les-nouvelles-fonctionnalites-de-notre-site-internet` | Actualités - Découvrez les Nouvelles Fonctionnalités de Notre Site Internet ! | `/` |
| `/fr/actualites/actualites-publiques/des-nouvelles-du-parcours-chateau-l-arc` | Actualités - Des nouvelles du parcours Château l’Arc | `/informations-parcours` |
| `/fr/actualites/actualites-publiques/finale-de-ligue-individuel-match-play-2023` | Actualités - Finale de Ligue Individuel Match-Play 2023 | `/competitions/resultats` |
| `/fr/actualites/actualites-publiques/interclubs-provence-dames-paca` | Actualités - Interclubs Provence Dames Paca | `/competitions/resultats` |
| `/fr/actualites/actualites-publiques/la-coupe-du-personnel-2023` | Actualités - La Coupe du personnel 2023 | `/competitions/resultats` |
| `/fr/actualites/actualites-publiques/list/1` | Actualités | `/competitions` |
| `/fr/actualites/actualites-publiques/race-to-sainte-victoire-2021` | Actualités - Race To Sainte Victoire 2021 | `/competitions/resultats` |
| `/fr/actualites/actualites-publiques/recrutement-immediat-d-un-caddy-master-commissaire-de-parcours` | Actualités - Recrutement immédiat d'un caddy master/commissaire de parcours | `/contact` |
| `/fr/actualites/articles/actualites-parcours-17-avril` | Actualités - Actualités parcours 17 avril | `/informations-parcours` |
| `/fr/actualites/articles/aeration-des-greens` | Actualités - Aération des Greens | `/informations-parcours` |
| `/fr/actualites/articles/aeration-des-greens-et-departs` | Actualités - Aération des Greens | `/informations-parcours` |
| `/fr/actualites/articles/agsca-avril-2024` | Actualités - AGSCA AVRIL 2024 | `/competitions/resultats` |
| `/fr/actualites/articles/amicale-des-seniors-de-provence-1` | Actualités - Amicale des Séniors de Provence - Mars 24 | `/competitions/resultats` |
| `/fr/actualites/articles/amicale-des-seniors-de-provence-avril-24` | Actualités - Amicale des Séniors de Provence - Avril 24 | `/competitions/resultats` |
| `/fr/actualites/articles/annonce-speciale-practice` | Actualités - 🏌️‍♂️ Annonce spéciale practice! 🏌️‍♀️ | `/le-parcours` |
| `/fr/actualites/articles/asgca-2024` | Actualités - AGSCA fin mars 2024 | `/competitions/resultats` |
| `/fr/actualites/articles/bonne-annee-2020` | Actualités - Bonne année 2020 | `/` |
| `/fr/actualites/articles/championnat-de-ligue-par-equipes` | Actualités - Championnat de Ligue par Equipes - Dames | `/competitions/resultats` |
| `/fr/actualites/articles/championnat-de-ligue-par-equipes-2eme-division-messieurs` | Actualités - Championnat de Ligue par Equipes 2ème Division - Messieurs | `/competitions/resultats` |
| `/fr/actualites/articles/championnat-de-ligue-par-equipes-promotion-seniors-messieurs-et-dames` | Actualités - Championnat de Ligue par Equipes Promotion Seniors Messieurs et Dames | `/competitions/resultats` |
| `/fr/actualites/articles/de-nouvelles-balles-au-practice` | Actualités - De nouvelles balles au practice | `/le-parcours` |
| `/fr/actualites/articles/decouvrez-les-nouvelles-fonctionnalites-de-notre-site-internet` | Actualités - Découvrez les Nouvelles Fonctionnalités de Notre Site Internet ! | `/` |
| `/fr/actualites/articles/des-nouvelles-du-parcours-chateau-l-arc` | Actualités - Des nouvelles du parcours Château l’Arc | `/informations-parcours` |
| `/fr/actualites/articles/finale-de-ligue-individuel-match-play-2023` | Actualités - Finale de Ligue Individuel Match-Play 2023 | `/competitions/resultats` |
| `/fr/actualites/articles/interclubs-provence-dames-paca` | Actualités - Interclubs Provence Dames Paca | `/competitions/resultats` |
| `/fr/actualites/articles/la-coupe-du-personnel-2023` | Actualités - La Coupe du personnel 2023 | `/competitions/resultats` |
| `/fr/actualites/articles/list/1` | Actualités | `/competitions` |
| `/fr/actualites/articles/list/2` | Actualités | `/competitions` |
| `/fr/actualites/articles/race-to-sainte-victoire-2021` | Actualités - Race To Sainte Victoire 2021 | `/competitions/resultats` |
| `/fr/actualites/articles/recrutement-immediat-d-un-caddy-master-commissaire-de-parcours` | Actualités - Recrutement immédiat d'un caddy master/commissaire de parcours | `/contact` |
| `/fr/actualites/articles/remerciements-pour-votre-fidelite-credit-exceptionnel-dans-vos-reserves` | Authentification | `/tarifs` |
| `/fr/actualites/articles/reouverture-de-la-route-vers-le-practice` | Authentification | `/le-parcours` |

### Espace membres et vidéos (3)

| Ancienne URL | Titre de l'ancienne page | Nouvelle URL |
| --- | --- | --- |
| `/account/home/` | Authentification | `https://prima.golf/sainte-victoire/home` |
| `/connexion/` | Authentification | `https://prima.golf/sainte-victoire/home` |
| `/videos/videos/list/` | Nos vidéos | `/le-parcours` |

## Après la mise en ligne

1. Vérifier dans Google Search Console (propriété de domaine) le rapport **Pages** : les anciennes URL passent en « Page avec redirection », sans hausse des 404.
2. Contrôler quelques URL au hasard : `curl -sI https://www.chateaularcgolfclub.com/fr/tarifs` doit répondre `301` et `location: /tarifs`.
3. Garder ces redirections **au moins un an** (idéalement sans limite) : elles transmettent l'ancienneté et les liens entrants de l'ancien site.
4. Les 8 PDF dont l'adresse contenait un double « // » passent par deux sauts (308 de normalisation, puis 301) : sans conséquence.
