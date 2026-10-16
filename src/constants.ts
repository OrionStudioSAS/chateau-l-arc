/**
 * Textes et images modifiables du site (éditeur visuel du back-office, rubrique
 * « Pages », et Orion admin). Une section par bloc, nommée « Page · Bloc » ;
 * le commentaire au-dessus de chaque constante est son libellé dans l'éditeur.
 * Les listes d'objets gardent leur nombre d'éléments : seul le texte change.
 */

// ─── Accueil · Bannière ───

/** Accroche */
export const BANNER_ACCROCHE = "Golf 18 trous · Fuveau, aux portes d'Aix-en-Provence";

/** Titre */
export const BANNER_TITRE = "Chateau l'Arc";

/** Texte */
export const BANNER_TEXTE = "Un parcours signé Robert Trent Jones II, entre pins et garrigue, à quinze minutes d'Aix. Ouvert à tous, toute l'année.";

/** Image de fond */
export const BANNER_IMAGE = "/images/banner.jpg";

// ─── Accueil · Chiffres clés ───

/** Chiffres */
export const ACCUEIL_CHIFFRES = [
  { valeur: "18 trous", ligne1: "Par 70" },
  { valeur: "5 817 m", ligne1: "Longueur" },
  { valeur: "R. T. Jones II", ligne1: "Architecte" },
  { valeur: "1985", ligne1: "Création" },
  { valeur: "15 min", ligne1: "D'Aix-en-Provence" },
];

// ─── Accueil · Présentation ───

/** Surtitre */
export const PRESENTATION_SURTITRE = "Le plus beau golf entre Aix et Marseille";

/** Texte */
export const PRESENTATION_TEXTE = `Le Château l'Arc Golf Club fait indéniablement partie des plus beaux lieux golfiques de la région Provence Alpes Côte d'Azur. Le parcours, créé en 1985 et dessiné par Robert Trent Jones II, est idéalement situé aux portes d'Aix-En-Provence et Marseille. Ce par 70 de 5817 mètres propose une expérience golfique variée grâce à son dessin qui serpente entre pins et garrigue dans un environnement d'exception puisqu'il donne une vue fantastique sur la montagne Sainte-Victoire.`;

/** Vignettes autour du texte */
export const PRESENTATION_VIGNETTES = [
  "/images/hp-haut-gauche.png",
  "/images/hp-milieu-gauche.png",
  "/images/hp-bas-gauche.png",
  "/images/hp-haut-droite.png",
  "/images/hp-milieu-droite.png",
  "/images/hp-bas-droite.png",
];

/** Vidéo YouTube (identifiant) */
export const VIDEO_YOUTUBE_ID = "hbJSMWfHjAI";

// ─── Accueil · Bienvenue ───

/** Surtitre */
export const PROFITER_SURTITRE = "Bienvenue";

/** Titre */
export const PROFITER_TITRE = "Comment souhaitez-vous profiter du golf ?";

/** Texte */
export const PROFITER_DESCRIPTION = "Joueur de passage, futur membre ou débutant : chaque golfeur trouve sa place au golf de Château l'Arc.";

/** Cartes */
export const PROFITER_CARTES = [
  { titre: "Jouer une partie", texte: "18 trous ou 9 trous, réservation en ligne en deux minutes. Voiturette sur demande.", prix: "Dès 45 €", lien: "Réserver un départ", image: "/images/hp-jouer.png" },
  { titre: "Rejoindre le club", texte: "Accès illimité au parcours, compétitions, practice et vie du club toute l'année.", prix: "Dès 540 € / an", lien: "Voir les abonnements", image: "/images/hp-join.png" },
  { titre: "L'Académie", texte: "Cours individuels, stages enfants et adultes, préparation à la carte verte.", prix: "Cours & stages toute l'année", lien: "Découvrir l'Académie", image: "/images/hp-academie.png" },
];

// ─── Accueil · Le parcours ───

/** Surtitre */
export const PARCOURS_SURTITRE = "Le parcours";

/** Titre */
export const PARCOURS_TITRE = "Entre pins et garrigue, un tracé de caractère";

/** Texte */
export const PARCOURS_DESCRIPTION = "Le parcours serpente dans un environnement préservé, entre pins parasols, garrigue et vignes, avec la Sainte-Victoire en toile de fond.";

/** Image */
export const PARCOURS_IMAGE = "/images/parcours.png";

/** Atouts */
export const PARCOURS_ATOUTS = [
  { titre: "Dessiné par Robert Trent Jones II", texte: "L'un des plus grands architectes de golf au monde, en 1985." },
  { titre: "Face à la montagne Sainte-Victoire", texte: "La montagne chère à Cézanne accompagne la partie, trou après trou." },
  { titre: "Par 70 · 5 817 m", texte: "Un parcours technique et varié, exigeant pour les bons joueurs, accessible à tous." },
];

// ─── Accueil · Tarifs ───

/** Titre */
export const TARIFS_TITRE = "Des tarifs simples, toute l'année";

/** Texte */
export const TARIFS_DESCRIPTION = "Haute saison du 16 avril au 14 novembre · basse saison du 15 novembre au 15 avril.";

// ─── Accueil · Compétitions ───

/** Surtitre */
export const COMPETITIONS_SURTITRE = "Agenda du club";

/** Titre */
export const COMPETITIONS_TITRE = "La saison au club";

// ─── Accueil · Art de vivre ───

/** Surtitre */
export const ART_DE_VIVRE_SURTITRE = "L'art de vivre";

/** Titre */
export const ART_DE_VIVRE_TITRE = "Bien plus qu'un golf";

/** Texte */
export const ART_DE_VIVRE_DESCRIPTION = "Restaurant, Académie, proshop et salons de réception : le domaine vit toute l'année, au rythme du club.";

/** Cartes */
export const ART_DE_VIVRE_CARTES = [
  { label: "La table du golf", titre: "Déjeuner face au parcours", image: "/images/hp-dejeuner.png" },
  { label: "Practice & Académie", titre: "Travailler le swing et le reste", image: "/images/hp-swing.png" },
  { label: "Grandir au cœur du domaine", titre: "SVIS - École internationale", image: "/images/hp-svis.png" },
  { label: "Proshop", titre: "S'équiper au club", image: "/images/hp-sequipe.png" },
  { label: "Compétitions & association", titre: "Se retrouver entre amis", image: "/images/hp-amis.png" },
];

// ─── Accueil · Partenaires ───

/** Titre */
export const PARTENAIRES_TITRE = "Ils accompagnent le club";

// ─── Commun · Appel à l'adhésion ───

/** Surtitre */
export const ADHESION_SAISON = "Saison 2027";

/** Titre */
export const ADHESION_TITRE = "Rejoignez le club et jouez toute l'année face à la Sainte-Victoire.";

/** Texte */
export const ADHESION_DESCRIPTION = "Abonnements individuels, couple, famille et jeunes · −5 % en paiement comptant jusqu'au 31 décembre.";

/** Image de fond */
export const ADHESION_IMAGE = "/images/hp-join.png";

// ─── Le parcours · Bannière ───

/** Accroche */
export const PARCOURS_PAGE_BANNIERE_ACCROCHE = "18 trous entre pins et garrigue, face à la montagne Sainte-Victoire.";

/** Titre */
export const PARCOURS_PAGE_BANNIERE_TITRE = "Parcours";

/** Texte */
export const PARCOURS_PAGE_BANNIERE_TEXTE = "18 trous · par 70 · 5 817 m, dessinés par Robert Trent Jones II entre pins, garrigue et Sainte-Victoire.";

/** Image de fond */
export const PARCOURS_PAGE_BANNIERE_IMAGE = "/images/parcours.png";

// ─── Histoire · Bannière ───

/** Titre */
export const HISTOIRE_BANNIERE_TITRE = "Histoire";

/** Texte */
export const HISTOIRE_BANNIERE_TEXTE = "Quatre siècles d'histoire au pied de la Sainte-Victoire : une demeure de famille, un atelier d'artistes, un décor de cinéma et aujourd'hui un golf.";

/** Image de fond */
export const HISTOIRE_BANNIERE_IMAGE = "/images/hp-haut-gauche.png";

// ─── Compétitions · Bannière ───

/** Titre */
export const COMPETITIONS_PAGE_BANNIERE_TITRE = "Compétitions";

/** Texte */
export const COMPETITIONS_PAGE_BANNIERE_TEXTE = "Du scramble convivial au Grand Prix, une saison pour tous les niveaux. Inscription en ligne, résultats publiés dès le lendemain.";

/** Image de fond */
export const COMPETITIONS_PAGE_BANNIERE_IMAGE = "/images/competitions.png";

// ─── Tarifs · Bannière ───

/** Titre */
export const TARIFS_PAGE_BANNIERE_TITRE = "Tarifs";

/** Texte */
export const TARIFS_PAGE_BANNIERE_TEXTE = "Les prix affichés sont toujours à jour : ils sont gérés directement par l'accueil du club.";

/** Image de fond */
export const TARIFS_PAGE_BANNIERE_IMAGE = "/images/tarifs.png";

// ─── L'Académie · Bannière ───

/** Titre */
export const ACADEMIE_BANNIERE_TITRE = "L’Académie";

/** Texte */
export const ACADEMIE_BANNIERE_TEXTE = "Débutant ou confirmé, dès 4 ans : apprenez et progressez avec nos enseignants diplômés d'État, face à la Sainte-Victoire.";

/** Image de fond */
export const ACADEMIE_BANNIERE_IMAGE = "/images/academie.png";

// ─── Le parcours · Chiffres clés ───

/** Chiffres */
export const PARCOURS_PAGE_CHIFFRES = [
  { valeur: "18", ligne1: "Trous" },
  { valeur: "70", ligne1: "Par" },
  { valeur: "5 817 m", ligne1: "Blancs" },
  { valeur: "15 min", ligne1: "D'Aix-en-Provence" },
  { valeur: "1985", ligne1: "Création" },
  { valeur: "R. T. Jones II", ligne1: "Architecte" },
];

// ─── Histoire · Chiffres clés ───

/** Chiffres */
export const HISTOIRE_CHIFFRES = [
  { valeur: "1620", ligne1: "Construction du château" },
  { valeur: "100 ha", ligne1: "Superficie du domaine" },
  { valeur: "1985", ligne1: "Création du golf" },
  { valeur: "25 min", ligne1: "Aéroport & gare TGV" },
];

// ─── Le parcours · Présentation ───

/** Surtitre */
export const PARCOURS_PRESENTATION_SURTITRE = "Le parcours";

/** Titre */
export const PARCOURS_PRESENTATION_TITRE = "Un parcours qui récompense la précision";

/** Paragraphes */
export const PARCOURS_PRESENTATION_PARAGRAPHES = [
  "Dessiné en 1985 par Robert Trent Jones II, l'un des plus grands architectes de golf au monde, le parcours du Château l'Arc serpente entre pins, chênes et garrigue sur le domaine du château. Fairways travaillés, bunkers stratégiques et greens défendus, dans la pure tradition du golf américain.",
  "Du haut des départs, la vue s'ouvre sur la montagne Sainte-Victoire, chère à Cézanne. Un parcours technique mais accessible, où chaque niveau de jeu trouve son plaisir grâce à six repères de départ.",
];

/** Photos */
export const PARCOURS_PRESENTATION_PHOTOS = [
  "/images/parcours-galerie-1.png",
  "/images/parcours-galerie-2.png",
  "/images/parcours-galerie-3.png",
  "/images/hp-jouer.png",
  "/images/parcours-galerie-5.png",
];

// ─── Histoire · Le domaine ───

/** Surtitre */
export const HISTOIRE_INTRO_SURTITRE = "Le domaine";

/** Citation */
export const HISTOIRE_INTRO_CITATION = "« Bâti en 1620 par la famille d'Agoult, le Château l'Arc est le cœur d'un domaine de plus de cent hectares, face à la Sainte-Victoire. »";

/** Paragraphes */
export const HISTOIRE_INTRO_PARAGRAPHES = [
  "Aux portes d'Aix-en-Provence et de Marseille, le domaine accueille ses visiteurs dans un cadre exceptionnel. La demeure abrite aujourd'hui le Club House du golf : grand salon, bar et grande terrasse avec vue panoramique sur la Sainte-Victoire.",
  "Autour du château s'enroule le parcours 18 trous dessiné par Robert Trent Jones II, et le domaine vit toute l'année : restaurant, réceptions, soirées privées, concerts et une école internationale.",
];

// ─── Le parcours · Repères de départ ───

/** Surtitre */
export const REPERES_SURTITRE = "Six repères de départ";

/** Titre */
export const REPERES_TITRE = "Un parcours pour chaque niveau";

/** Repères (dans l'ordre : blanc, jaune, bleu, rouge, violet, orange) */
export const REPERES_DETAILS = [
  { distance: "5 817 m", public: "Compétition messieurs" },
  { distance: "~5 400 m", public: "Messieurs" },
  { distance: "~5 200 m", public: "Compétition dames" },
  { distance: "~4 700 m", public: "Dames" },
  { distance: "~4 700 m", public: "Seniors · loisir" },
  { distance: "~3 500 m", public: "Débutants · jeunes" },
];

/** Note */
export const REPERES_NOTE = "Slope et SSS par repère disponibles sur la carte de score";

// ─── Le parcours · Zone d'entraînement ───

/** Surtitre */
export const ENTRAINEMENT_SURTITRE = "Le practice";

/** Titre */
export const ENTRAINEMENT_TITRE = "Zone d'Entraînement";

/** Paragraphes */
export const ENTRAINEMENT_PARAGRAPHES = [
  "Situé au cœur du domaine, à quelques pas du club-house, le practice du Château l'Arc vous accueille tous les jours pour l'échauffement avant votre départ ou une vraie séance d'entraînement, avec vue sur la montagne Sainte-Victoire.",
  "Ses [XX] postes de jeu, dont [XX] couverts pour jouer par tous les temps, vous permettent de travailler votre long jeu sur des tapis ou sur herbe [à confirmer]. Le seau de balles est à 4 € — et à 3 € avec un green fee ou pour les membres.",
  "À proximité, un green d'approche entouré de bunkers vous aide à perfectionner votre petit jeu : sorties de bunker, chips et approches roulées. Un putting-green complète les installations pour régler votre dosage avant d'attaquer le par 70 dessiné par Robert Trent Jones II.",
  "C'est également ici que s'entraînent l'école de golf de l'Académie et les équipes du club, encadrées par nos enseignants diplômés d'État.",
];

/** Vidéo YouTube (identifiant) */
export const ENTRAINEMENT_VIDEO = "SQA8D9P9i-8";

// ─── Le parcours · Infos pratiques ───

/** Surtitre */
export const INFOS_SURTITRE = "Avant de jouer";

/** Titre */
export const INFOS_TITRE = "Infos pratiques";

/** Cartes (niveau, horaires, voiturettes, tenue) */
export const INFOS_CARTES = [
  { titre: "Niveau requis", texte: "Carte verte ou index à présenter à l'accueil." },
  { titre: "Horaires", texte: "Horaires d'été et d'hiver : renseignez-vous auprès de l'accueil avant votre venue." },
  { titre: "Voiturettes", texte: "40 € les 18 trous, sur réservation. Circulation selon l'état du terrain." },
  { titre: "Tenue", texte: "Tenue de golf correcte exigée sur le parcours et au practice." },
];

/** Note sur l'état du parcours */
export const INFOS_NOTE = "L'état du parcours est mis à jour chaque matin par l'accueil : consultez-le avant de venir.";

// ─── Le parcours · Trou par trou ───

/** Surtitre */
export const EXPLORER_SURTITRE = "Trou par trou";

/** Titre */
export const EXPLORER_TITRE = "Explorez le parcours";

/** Texte */
export const EXPLORER_TEXTE = "Choisissez un trou pour découvrir sa vidéo, son infographie et le conseil du pro.";

// ─── Histoire · Chronologie ───

/** Surtitre */
export const FRISE_SURTITRE = "Chronologie";

/** Titre */
export const FRISE_TITRE = "Quatre siècles, cinq chapitres";

/** Chapitres (1620, XXe, 1950, 1985, aujourd'hui) */
export const FRISE_CHAPITRES = [
  { titre: "La famille d'Agoult", texte: "Construction du Château l'Arc, point central du domaine, au cœur de la Provence véritable.", image: "/images/notre-histoire.png" },
  { titre: "L'atelier des artistes", texte: "Le château devient l'atelier préféré du peintre Bernard Buffet, puis le refuge estival de Pierre Bergé, Jean Cocteau et Yves Saint Laurent.", image: "/images/tarifs.png" },
  { titre: "Le cinéma s'invite", texte: "Fernandel y tourne « Uniformes et grandes manœuvres ». Suivront des scènes du film consacré à Yves Saint Laurent, Les Tuche 2 et Divorce Club.", image: "/images/histoire-1950.png" },
  { titre: "Robert Trent Jones II", texte: "Le parcours 18 trous s'enroule autour du château, offrant des points de vue magnifiques sur la Sainte-Victoire.", image: "/images/histoire-1985.png" },
  { titre: "Un lieu de vie", texte: "Club House dans la demeure historique, restaurant, réceptions et la Sainte-Victoire International School : le domaine vit toute l'année.", image: "/images/hp-dejeuner.png" },
];

// ─── Histoire · Le domaine aujourd'hui ───

/** Surtitre */
export const DOMAINE_SURTITRE = "Aujourd'hui";

/** Titre */
export const DOMAINE_TITRE = "Le domaine aujourd'hui";

/** Texte */
export const DOMAINE_TEXTE = "Golfeurs ou non, le domaine accueille toute l'année : déjeuner, célébrer, apprendre.";

/** Cartes */
export const DOMAINE_CARTES = [
  { label: "Club House", titre: "Le château, côté golf", texte: "Grand salon, bar et terrasse panoramique sur la Sainte-Victoire, au cœur de la demeure historique.", image: "/images/hp-milieu-droite.png" },
  { label: "Réceptions", titre: "Soirées & événements", texte: "Soirées privées, concerts, séminaires : les salons du château se privatisent.", image: "/images/histoire-receptions.png" },
  { label: "Éducation", titre: "Sainte-Victoire International School", texte: "École bilingue avec internat, du CP à la terminale, avec un cursus sport-études golf.", image: "/images/hp-svis.png" },
];

// ─── Histoire · Venir au domaine ───

/** Surtitre */
export const VENIR_SURTITRE = "Venir au domaine";

/** Titre (ligne 1) */
export const VENIR_TITRE_1 = "Aux portes d'Aix,";

/** Titre (ligne 2) */
export const VENIR_TITRE_2 = "à deux pas de Marseille";

/** Temps d'accès (avion, train, route) */
export const VENIR_ACCES = [
  { libelle: "Aéroport Marseille Provence", duree: "25 min" },
  { libelle: "Gare TGV Aix-en-Provence", duree: "25 min" },
  { libelle: "Autoroute A8", duree: "5 min" },
];

/** Photo */
export const VENIR_IMAGE = "/images/histoire-venir.png";

// ─── Compétitions · Derniers résultats ───

/** Surtitre */
export const RESULTATS_SURTITRE = "Résultats";

/** Titre */
export const RESULTATS_TITRE = "Derniers résultats";

// ─── Tarifs · Green fees ───

/** Surtitre « Green fees » */
export const TARIFS_GREENFEES_SURTITRE = "Green fees";

/** Surtitre « Carnets » */
export const TARIFS_CARNETS_SURTITRE = "Carnets · valables 12 mois";

/** Surtitre « Locations » */
export const TARIFS_LOCATIONS_SURTITRE = "Locations & practice";

// ─── Tarifs · Abonnements ───

/** Titre */
export const TARIFS_ABONNEMENTS_TITRE = "Devenez membre du club";

// ─── Tarifs · Avantages membres ───

/** Surtitre */
export const AVANTAGES_SURTITRE = "Avantages membres";

/** Titre */
export const AVANTAGES_TITRE = "Bien plus qu'un accès au parcours";

/** Avantages */
export const AVANTAGES_LISTE = [
  "Accès illimité au parcours 18 trous",
  "Compétitions et vie de l'association sportive",
  "Tarifs membres sur les voiturettes et le practice",
  "Réservation prioritaire des départs",
  "Accès au club-house et aux événements du club",
];

/** Photo */
export const AVANTAGES_IMAGE = "/images/tarifs-avantages.png";

// ─── Tarifs · Questions ───

/** Surtitre */
export const TARIFS_QUESTIONS_SURTITRE = "Questions fréquentes";

/** Titre */
export const TARIFS_QUESTIONS_TITRE = "Vos questions";

// ─── L'Académie · Une école pour chaque golfeur ───

/** Surtitre */
export const ACADEMIE_INTRO_SURTITRE = "Apprendre au Château l'Arc";

/** Titre */
export const ACADEMIE_INTRO_TITRE = "Une école pour chaque golfeur";

/** Texte */
export const ACADEMIE_INTRO_TEXTE = "Cours en petits groupes, stages pendant les vacances, initiations découverte : choisissez votre rythme.";

/** Cartes (juniors, adultes, groupes) */
export const ACADEMIE_INTRO_CARTES = [
  { label: "Juniors", titre: "Le golf dès 4 ans", texte: "Éveil par le jeu puis technique et premières compétitions, le mercredi et le samedi.", lien: "École juniors" },
  { label: "Adultes", titre: "Les formules Prestige", texte: "Cours collectifs de 6 personnes maximum, une heure par jour, quatre jours par semaine.", lien: "Formules adultes" },
  { label: "Groupes", titre: "Stages & initiations", texte: "De 2 à 30 personnes, toute l'année : découverte, ateliers thématiques, stages tous niveaux.", lien: "Stages & initiations" },
];

// ─── L'Académie · École juniors ───

/** Surtitre */
export const ACADEMIE_JUNIORS_SURTITRE = "École de golf juniors";

/** Titre */
export const ACADEMIE_JUNIORS_TITRE = "Le golf dès 4 ans";

/** Photo */
export const ACADEMIE_JUNIORS_IMAGE = "/images/hp-bas-droite.png";

// ─── L'Académie · Formules Prestige ───

/** Surtitre */
export const ACADEMIE_PRESTIGE_SURTITRE = "École de golf adultes";

/** Titre */
export const ACADEMIE_PRESTIGE_TITRE = "Les formules Prestige";

/** Texte */
export const ACADEMIE_PRESTIGE_TEXTE = "Des cours collectifs en petit comité pour progresser vite et durablement, encadrés par nos enseignants diplômés d'État.";

/** Photo */
export const ACADEMIE_PRESTIGE_IMAGE = "/images/academie-prestige.png";

// ─── L'Académie · Stages & initiations ───

/** Surtitre */
export const ACADEMIE_STAGES_SURTITRE = "Stages & initiations";

/** Titre */
export const ACADEMIE_STAGES_TITRE = "De 2 à 30 personnes";

/** Texte */
export const ACADEMIE_STAGES_TEXTE = "Toute l'année, entre amis, en famille ou entre collègues : réservez en ligne ou par téléphone.";

/** Photo */
export const ACADEMIE_STAGES_IMAGE = "/images/hp-academie.png";

// ─── L'Académie · Enseignants ───

/** Surtitre */
export const ACADEMIE_ENSEIGNANTS_SURTITRE = "Nos enseignants";

/** Titre */
export const ACADEMIE_ENSEIGNANTS_TITRE = "Une équipe pour vous accompagner";
