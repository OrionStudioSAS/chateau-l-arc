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

/** Enseignants */
export const ACADEMIE_ENSEIGNANTS = [
  { nom: "Arnaud Bonnard", titre: "Enseignant diplômé d'État", email: "arnaudbonnard@icloud.com", photo: "" },
  { nom: "Julian Audibert", titre: "Enseignant diplômé d'État", email: "julian.audibert.pro@gmail.com", photo: "" },
  { nom: "Alexandre Cardinal", titre: "Enseignant diplômé d'État", email: "gea.alexandre@gmail.com", photo: "" },
  { nom: "Isabelle Boineau", titre: "Enseignante diplômée d'État", email: "isa.golf13@gmail.com", photo: "" },
];

// ─── FAQ · Bannière ───

/** Surtitre */
export const FAQ_SURTITRE = "Centre d'aide";

/** Titre */
export const FAQ_TITRE = "Comment pouvons-nous vous aider ?";

/** Texte d'exemple du champ de recherche */
export const FAQ_RECHERCHE_EXEMPLE = "Rechercher : green fee, voiturette, cours enfant…";

/** Recherches fréquentes */
export const FAQ_RECHERCHES = [
  "Tarifs green fees",
  "Réserver un départ",
  "Carte verte",
  "Compétitions",
  "Voiturettes",
  "Accès",
];

/** Photo */
export const FAQ_IMAGE = "/images/parcours.png";

// ─── FAQ · Réponse rapide ───

/** Titre */
export const FAQ_RAPIDE_TITRE = "Besoin d'une réponse rapide ?";

/** Texte */
export const FAQ_RAPIDE_TEXTE = "L'accueil golf vous répond par téléphone.";


// ─── FAQ · Le golf & le parcours ───

/** Titre du thème */
export const FAQ_GOLF_TITRE = "Le golf & le parcours";

/** Questions (lien et texte du lien facultatifs : laisser vides pour aucun lien) */
export const FAQ_GOLF_QUESTIONS = [
  {
    question: "Le golf est-il ouvert aux non-membres ?",
    reponse: "Oui. Le parcours est ouvert à tous les golfeurs, membres ou non. Il suffit de réserver un départ en ligne ou auprès de l'accueil et de régler un green fee.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Faut-il un niveau minimum pour jouer ?",
    reponse: "Une carte verte ou un index est demandé pour jouer le parcours. Pour débuter, l'Académie propose des initiations encadrées par nos enseignants.",
    lien: "/academie",
    texteLien: "Découvrir l'Académie",
  },
  {
    question: "Combien de temps dure une partie de 18 trous ?",
    reponse: "Comptez en moyenne quatre heures à quatre heures et demie pour un 18 trous.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Comment connaître l'état du parcours avant de venir ?",
    reponse: "L'accueil met à jour l'état du parcours, des voiturettes et des installations chaque matin. Il est affiché en haut du site : cliquez sur « Parcours ouvert » pour le détail.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Une tenue particulière est-elle exigée ?",
    reponse: "Oui : une tenue de golf correcte est exigée sur le parcours et au practice.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Qui a dessiné le parcours ?",
    reponse: "Robert Trent Jones II, l'un des plus grands architectes de golf au monde, en 1985. Le parcours est un par 70 de 5 817 mètres.",
    lien: "/le-parcours",
    texteLien: "Explorer le parcours",
  },
];

// ─── FAQ · Réservations & départs ───

/** Titre du thème */
export const FAQ_RESERVATIONS_TITRE = "Réservations & départs";

/** Questions (lien et texte du lien facultatifs : laisser vides pour aucun lien) */
export const FAQ_RESERVATIONS_QUESTIONS = [
  {
    question: "Comment réserver un départ ?",
    reponse: "En ligne, à tout moment, via le bouton « Réserver un départ », ou par téléphone auprès de l'accueil au 04 42 29 83 41.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Puis-je modifier ou annuler ma réservation ?",
    reponse: "Contactez l'accueil au 04 42 29 83 41 : il vous indiquera les conditions de modification ou d'annulation.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Puis-je réserver pour un groupe ?",
    reponse: "Oui. Pour un groupe, une sortie d'entreprise ou un événement, contactez l'accueil pour organiser vos départs.",
    lien: "/groupe-privatisation",
    texteLien: "Groupes & privatisation",
  },
  {
    question: "Puis-je venir jouer seul ?",
    reponse: "Oui. Réservez simplement un départ en ligne ou auprès de l'accueil.",
    lien: "",
    texteLien: "",
  },
];

// ─── FAQ · Tarifs & paiement ───

/** Titre du thème */
export const FAQ_TARIFS_TITRE = "Tarifs & paiement";

/** Questions (lien et texte du lien facultatifs : laisser vides pour aucun lien) */
export const FAQ_TARIFS_QUESTIONS = [
  {
    question: "Quels sont les tarifs des green fees ?",
    reponse: "18 trous : 85 € toute l'année. 9 trous : 55 € en haute saison (du 16 avril au 14 novembre) et 45 € en basse saison (du 15 novembre au 15 avril).",
    lien: "/tarifs",
    texteLien: "Tous les tarifs",
  },
  {
    question: "Existe-t-il des carnets de green fees ?",
    reponse: "Oui, valables 12 mois : 6 parcours 18 trous à 350 €, 12 parcours 18 trous à 700 €, 12 parcours 9 trous à 450 €.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Combien coûte la location d'une voiturette ?",
    reponse: "Voiturette 18 trous : 40 € (28 € pour les membres) ; voiturette 9 trous : 33 € (25 € pour les membres).",
    lien: "",
    texteLien: "",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    reponse: "L'accueil vous renseigne sur les moyens de paiement acceptés sur place.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Peut-on offrir un green fee ?",
    reponse: "Oui, contactez l'accueil du club pour toute demande de cadeau.",
    lien: "",
    texteLien: "",
  },
];

// ─── FAQ · Abonnements & vie de club ───

/** Titre du thème */
export const FAQ_ABONNEMENTS_TITRE = "Abonnements & vie de club";

/** Questions (lien et texte du lien facultatifs : laisser vides pour aucun lien) */
export const FAQ_ABONNEMENTS_QUESTIONS = [
  {
    question: "Quelles formules d'abonnement proposez-vous ?",
    reponse: "Individuel 2 280 €, Couple 3 732 €, Famille (2 adultes) 3 732 €, Individuel −35 ans 1 560 €, Couple −35 ans 2 748 €, −25 ans & étudiants 984 €, −15 ans 540 €, Individuel +80 ans 2 052 €, Couple +80 ans 3 300 €, par an.",
    lien: "/tarifs",
    texteLien: "Voir les abonnements",
  },
  {
    question: "Y a-t-il une réduction en payant comptant ?",
    reponse: "Oui : −5 % en paiement comptant jusqu'au 31/12.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Peut-on payer l'abonnement en plusieurs fois ?",
    reponse: "Contactez l'accueil pour connaître les modalités de paiement de votre abonnement.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Comment devenir membre ?",
    reponse: "Faites votre demande d'adhésion en ligne ou auprès de l'accueil : l'équipe vous accompagne dans le choix de la formule.",
    lien: "/devenir-membre",
    texteLien: "Devenir membre",
  },
  {
    question: "Qu'est-ce que l'Association sportive ?",
    reponse: "L'Association sportive anime la vie du club : compétitions, rencontres et événements entre membres tout au long de la saison.",
    lien: "",
    texteLien: "",
  },
];

// ─── FAQ · L'Académie : cours & stages ───

/** Titre du thème */
export const FAQ_ACADEMIE_TITRE = "L'Académie : cours & stages";

/** Questions (lien et texte du lien facultatifs : laisser vides pour aucun lien) */
export const FAQ_ACADEMIE_QUESTIONS = [
  {
    question: "À partir de quel âge peut-on apprendre ?",
    reponse: "Dès 4 ans, à l'école de golf juniors : 4 – 7 ans 310 € par an (1h30 par semaine), 7 ans et + 410 € par an (2h00 par semaine), le mercredi et le samedi.",
    lien: "/academie",
    texteLien: "École juniors",
  },
  {
    question: "Proposez-vous des cours pour adultes ?",
    reponse: "Oui, les formules Prestige : cours collectifs de 6 personnes maximum, une heure par jour, lundi, mardi, jeudi et vendredi, dès 90 € par mois.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Y a-t-il des stages pendant les vacances ?",
    reponse: "Oui, des stages tous niveaux sont organisés pendant les vacances scolaires et toute l'année.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Peut-on organiser une initiation découverte ?",
    reponse: "Oui, de 2 à 30 personnes, entre amis, en famille ou entre collègues. Réservez par téléphone auprès de l'accueil.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Qui sont les enseignants ?",
    reponse: "Arnaud Bonnard, Julian Audibert, Alexandre Cardinal et Isabelle Boineau, enseignants diplômés d'État.",
    lien: "",
    texteLien: "",
  },
];

// ─── FAQ · Compétitions ───

/** Titre du thème */
export const FAQ_COMPETITIONS_TITRE = "Compétitions";

/** Questions (lien et texte du lien facultatifs : laisser vides pour aucun lien) */
export const FAQ_COMPETITIONS_QUESTIONS = [
  {
    question: "Comment s'inscrire à une compétition ?",
    reponse: "Depuis la page Compétitions : choisissez la compétition, puis suivez le bouton « S'inscrire » dès l'ouverture des inscriptions.",
    lien: "/competitions",
    texteLien: "Calendrier des compétitions",
  },
  {
    question: "Les compétitions sont-elles ouvertes aux visiteurs ?",
    reponse: "Certaines, oui : elles portent la mention « Ouvert à tous ». Le filtre « Ouvertes aux visiteurs » de la page Compétitions les regroupe.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Où consulter les résultats ?",
    reponse: "Les classements officiels sont publiés au format PDF dès le lendemain de chaque compétition.",
    lien: "/competitions/resultats",
    texteLien: "Résultats de la saison",
  },
];

// ─── FAQ · Practice & matériel ───

/** Titre du thème */
export const FAQ_PRACTICE_TITRE = "Practice & matériel";

/** Questions (lien et texte du lien facultatifs : laisser vides pour aucun lien) */
export const FAQ_PRACTICE_QUESTIONS = [
  {
    question: "Combien coûte un seau de balles ?",
    reponse: "1 seau de balles : 4 € (3 € pour les membres) ; 5 seaux : 18 € (12 € pour les membres) ; 10 seaux : 34 € (22 € pour les membres) ; 25 seaux : 75 € (50 € pour les membres).",
    lien: "",
    texteLien: "",
  },
  {
    question: "Peut-on louer du matériel ?",
    reponse: "Oui : chariot manuel : 5 € ; série complète (location) : 40 €.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Les voiturettes sont-elles toujours autorisées ?",
    reponse: "Leur circulation dépend de l'état du terrain. L'accueil indique chaque matin si elles sont autorisées, en haut du site (« Parcours ouvert »).",
    lien: "",
    texteLien: "",
  },
];

// ─── FAQ · Restaurant & Club House ───

/** Titre du thème */
export const FAQ_RESTAURANT_TITRE = "Restaurant & Club House";

/** Questions (lien et texte du lien facultatifs : laisser vides pour aucun lien) */
export const FAQ_RESTAURANT_QUESTIONS = [
  {
    question: "Le restaurant est-il ouvert aux non-golfeurs ?",
    reponse: "Contactez directement le restaurant pour connaître les horaires et réserver une table.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Peut-on profiter de la terrasse ?",
    reponse: "La grande terrasse du Club House offre une vue panoramique sur la montagne Sainte-Victoire.",
    lien: "",
    texteLien: "",
  },
];

// ─── FAQ · Séminaires & réceptions ───

/** Titre du thème */
export const FAQ_SEMINAIRES_TITRE = "Séminaires & réceptions";

/** Questions (lien et texte du lien facultatifs : laisser vides pour aucun lien) */
export const FAQ_SEMINAIRES_QUESTIONS = [
  {
    question: "Peut-on privatiser le domaine ?",
    reponse: "Oui, pour un séminaire, une journée golf d'entreprise, une soirée ou une réception. Faites votre demande via la page Contact.",
    lien: "/contact",
    texteLien: "Nous contacter",
  },
  {
    question: "Quelles prestations proposez-vous ?",
    reponse: "Salons du château, restauration et initiations au golf : l'équipe établit avec vous une proposition sur mesure.",
    lien: "",
    texteLien: "",
  },
];

// ─── FAQ · Accès & infos pratiques ───

/** Titre du thème */
export const FAQ_ACCES_TITRE = "Accès & infos pratiques";

/** Questions (lien et texte du lien facultatifs : laisser vides pour aucun lien) */
export const FAQ_ACCES_QUESTIONS = [
  {
    question: "Où se trouve le golf ?",
    reponse: "Domaine Château l'Arc, 13710 Fuveau, aux portes d'Aix-en-Provence.",
    lien: "",
    texteLien: "",
  },
  {
    question: "Comment venir ?",
    reponse: "Le domaine est à 25 minutes de l'aéroport Marseille Provence et de la gare TGV d'Aix-en-Provence, et à 5 minutes de l'autoroute A8.",
    lien: "https://www.google.com/maps/dir/?api=1&destination=Ch%C3%A2teau+l%27Arc+Golf+Club%2C+13710+Fuveau",
    texteLien: "Itinéraire",
  },
  {
    question: "Comment joindre l'accueil ?",
    reponse: "Par téléphone au 04 42 29 83 41 ou par e-mail à golf@chateaularcgolfclub.com.",
    lien: "",
    texteLien: "",
  },
];

// ─── FAQ · Nous contacter ───

/** Surtitre */
export const FAQ_CONTACT_SURTITRE = "Vous n'avez pas trouvé votre réponse ?";

/** Titre */
export const FAQ_CONTACT_TITRE = "Notre équipe est là pour vous";

/** Moyens de contact */
export const FAQ_CONTACT_CANAUX = [
  { titre: "Par téléphone", texte: "L'accueil golf répond à vos questions.", lien: "tel:+33442298341", texteLien: "04 42 29 83 41" },
  { titre: "Par e-mail", texte: "golf@chateaularcgolfclub.com", lien: "mailto:golf@chateaularcgolfclub.com", texteLien: "Écrire au club" },
  { titre: "Par formulaire", texte: "Adhésion, cours ou événement : la bonne équipe vous répond.", lien: "/contact", texteLien: "Page Contact" },
];

// ─── Contact · Bannière ───

/** Titre */
export const CONTACT_TITRE = "Contact";

/** Texte */
export const CONTACT_TEXTE = "Adhésion, cours ou événement : choisissez votre demande, l'équipe concernée vous répond directement.";

/** Photo */
export const CONTACT_IMAGE = "/images/academie.png";

// ─── Contact · Choix de la demande ───

/** Titre */
export const CONTACT_CHOIX_TITRE = "Que souhaitez-vous faire ?";

/** Demandes proposées (dans l'ordre : adhésion, cours, événement, autre) */
export const CONTACT_CHOIX = [
  { titre: "Devenir membre", texte: "Jouer toute l'année et profiter de la vie du club." },
  { titre: "Cours & stages", texte: "Progresser avec nos enseignants, dès 4 ans." },
  { titre: "Séminaire & privatisation", texte: "Organiser un événement au domaine." },
  { titre: "Autres", texte: "Une autre question ? Horaires, accès, location de matériel…" },
];

// ─── Contact · Devenir membre ───

/** Étape 1 */
export const CONTACT_ADHESION_ETAPE_1 = "Votre formule";

/** Étape 1 · précision */
export const CONTACT_ADHESION_ETAPE_1_TEXTE = "Tarifs 2027 · −5 % en paiement comptant";

/** Mode de règlement */
export const CONTACT_ADHESION_REGLEMENT = "Mode de règlement souhaité";

/** Étape 2 */
export const CONTACT_ADHESION_ETAPE_2 = "Votre profil golf";

/** Aide du champ Index */
export const CONTACT_ADHESION_INDEX_AIDE = "Laissez vide si vous débutez";

/** Question « déjà joueur » */
export const CONTACT_ADHESION_DEJA = "Jouez-vous déjà au Château l'Arc ?";

/** Réponses « déjà joueur » */
export const CONTACT_ADHESION_DEJA_CHOIX = [
  "Oui, en visiteur",
  "Pas encore",
  "Ancien membre",
];

/** Bouton d'envoi */
export const CONTACT_ADHESION_BOUTON = "Envoyer ma demande d'adhésion";

/** Et ensuite ? */
export const CONTACT_ADHESION_SUITE = [
  "La direction étudie votre demande.",
  "Vous êtes rappelé pour finaliser l'adhésion et le paiement.",
  "Votre abonnement est créé dans le logiciel du club.",
];

/** Équipe qui répond */
export const CONTACT_ADHESION_EQUIPE = "Direction du club";

/** Équipe · précision */
export const CONTACT_ADHESION_EQUIPE_TEXTE = "Adhésions & abonnements";

// ─── Contact · Cours & stages ───

/** Étape 1 */
export const CONTACT_COURS_ETAPE_1 = "Pour qui ?";

/** Public (adulte, enfant) */
export const CONTACT_COURS_PUBLICS = [
  "Pour moi (adulte)",
  "Pour mon enfant",
];

/** Étape 2 */
export const CONTACT_COURS_ETAPE_2 = "Votre formule";

/** Étape 2 · précision */
export const CONTACT_COURS_ETAPE_2_TEXTE = "Tarifs de l'Académie";

/** Formules sur demande (adultes) */
export const CONTACT_COURS_SUR_DEMANDE = [
  { titre: "Initiation découverte", prix: "Sur demande", texte: "De 2 à 30 personnes." },
  { titre: "Cours individuel", prix: "Sur demande", texte: "Avec l'enseignant de votre choix." },
];

/** Note sous les formules adultes */
export const CONTACT_COURS_NOTE = "Cours collectifs de 6 personnes maximum · 1 h par jour · −10 % pour les membres";

/** Étape 3 */
export const CONTACT_COURS_ETAPE_3 = "Votre niveau & vos disponibilités";

/** Niveaux */
export const CONTACT_COURS_NIVEAUX = [
  "Je débute",
  "Carte verte",
  "Index 36 à 18",
  "Index < 18",
];

/** Jours de cours (adultes) */
export const CONTACT_COURS_JOURS_ADULTES = [
  "Lundi",
  "Mardi",
  "Jeudi",
  "Vendredi",
];

/** Jours de cours (enfants) */
export const CONTACT_COURS_JOURS_ENFANTS = [
  "Mercredi",
  "Samedi",
];

/** Bouton d'envoi */
export const CONTACT_COURS_BOUTON = "Envoyer ma demande";

/** Et ensuite ? */
export const CONTACT_COURS_SUITE = [
  "L'Académie vérifie les places sur vos jours.",
  "Un enseignant vous propose une date de démarrage.",
  "Vous finalisez l'inscription avec le club.",
];

/** Équipe qui répond */
export const CONTACT_COURS_EQUIPE = "L'Académie";

/** Équipe · précision */
export const CONTACT_COURS_EQUIPE_TEXTE = "Arnaud Bonnard · Julian Audibert · Alexandre Cardinal · Isabelle Boineau";

// ─── Contact · Séminaire & privatisation ───

/** Étape 1 */
export const CONTACT_EVENEMENT_ETAPE_1 = "Votre événement";

/** Types d'événement */
export const CONTACT_EVENEMENT_TYPES = [
  { titre: "Séminaire", texte: "Salle de réunion et pauses." },
  { titre: "Journée golf entreprise", texte: "Initiation ou compétition amicale." },
  { titre: "Soirée privée", texte: "Cocktail ou dîner au château." },
  { titre: "Réception familiale", texte: "Anniversaire, fête de famille." },
];

/** Étape 2 */
export const CONTACT_EVENEMENT_ETAPE_2 = "Date & participants";

/** Aide de la date */
export const CONTACT_EVENEMENT_DATE_AIDE = "Dates flexibles ? Précisez-le dans le message.";

/** Moments */
export const CONTACT_EVENEMENT_MOMENTS = [
  "Journée",
  "Demi-journée",
  "Soirée",
];

/** Étape 3 */
export const CONTACT_EVENEMENT_ETAPE_3 = "Prestations souhaitées";

/** Étape 3 · précision */
export const CONTACT_EVENEMENT_ETAPE_3_TEXTE = "Plusieurs choix possibles";

/** Prestations */
export const CONTACT_EVENEMENT_PRESTATIONS = [
  "Salle de réunion",
  "Initiation golf",
  "Compétition amicale",
  "Déjeuner",
  "Cocktail",
  "Dîner",
];

/** Budgets indicatifs */
export const CONTACT_EVENEMENT_BUDGETS = [
  "Non défini",
  "Moins de 2 000 €",
  "2 000 à 5 000 €",
  "5 000 à 10 000 €",
  "Plus de 10 000 €",
];

/** Bouton d'envoi */
export const CONTACT_EVENEMENT_BOUTON = "Recevoir une proposition";

/** Et ensuite ? */
export const CONTACT_EVENEMENT_SUITE = [
  "L'équipe événements vérifie la disponibilité des salles.",
  "Vous recevez une proposition personnalisée.",
  "Une visite du domaine peut être organisée.",
];

/** Équipe qui répond */
export const CONTACT_EVENEMENT_EQUIPE = "Événements & réceptions";

/** Équipe · précision */
export const CONTACT_EVENEMENT_EQUIPE_TEXTE = "Réponse avec une proposition";

// ─── Contact · Autre question ───

/** Étape 1 */
export const CONTACT_AUTRE_ETAPE_1 = "Votre question";

/** Sujets */
export const CONTACT_AUTRE_SUJETS = [
  "Réservation d'un départ",
  "Restaurant",
  "Location de matériel",
  "Compétitions",
  "Autre",
];

/** Bouton d'envoi */
export const CONTACT_AUTRE_BOUTON = "Envoyer ma question";

/** Et ensuite ? */
export const CONTACT_AUTRE_SUITE = [
  "L'accueil golf lit votre message.",
  "Il vous répond par e-mail ou par téléphone.",
];

/** Équipe qui répond */
export const CONTACT_AUTRE_EQUIPE = "Accueil golf";

/** Équipe · précision */
export const CONTACT_AUTRE_EQUIPE_TEXTE = "Réponse par e-mail ou par téléphone";

// ─── Contact · Coordonnées et envoi ───

/** Titre de l'étape */
export const CONTACT_COORDONNEES_TITRE = "Vos coordonnées";

/** Texte d'exemple du message */
export const CONTACT_MESSAGE_EXEMPLE = "Une précision, une question…";

/** Consentement */
export const CONTACT_CONSENTEMENT = "J'accepte que mes données soient utilisées pour répondre à ma demande.";

/** Lettre du club */
export const CONTACT_NEWSLETTER = "Je souhaite recevoir la lettre du club (facultatif).";

/** Réassurance à côté du bouton */
export const CONTACT_RASSURANCE = "Vos données restent au club. Aucun engagement.";

/** Surtitre du récapitulatif */
export const CONTACT_RECAP_SURTITRE = "Votre demande";

/** Titre « Et ensuite ? » */
export const CONTACT_SUITE_TITRE = "Et ensuite ?";

// ─── Contact · Confirmation ───

/** Titre ({prenom} : prénom du visiteur) */
export const CONTACT_MERCI_TITRE = "Merci {prenom}, votre demande est bien envoyée";

/** Texte ({equipe}, {email}) */
export const CONTACT_MERCI_TEXTE = "Elle a été transmise à {equipe}, qui revient vers vous très vite à l'adresse {email}.";

/** Titre du récapitulatif */
export const CONTACT_MERCI_RECAP = "Récapitulatif";

/** Bouton principal */
export const CONTACT_MERCI_BOUTON_1 = "Retour à l'accueil";

/** Bouton secondaire */
export const CONTACT_MERCI_BOUTON_2 = "Découvrir le parcours";

// ─── Contact · Autres demandes ───

/** Surtitre */
export const CONTACT_AUTRES_SURTITRE = "Autres demandes";

/** Cartes (lien : page du site, https://, tel: ou mailto:) */
export const CONTACT_AUTRES_CARTES = [
  { titre: "Réserver un départ", texte: "Green fee 9 ou 18 trous, réservation en ligne.", texteLien: "Réserver", lien: "https://prima.golf/sainte-victoire/home" },
  { titre: "Restaurant", texte: "Réservez une table au Club House.", texteLien: "Appeler le restaurant", lien: "tel:+33130939559" },
  { titre: "Une autre question ?", texte: "Horaires, accès, location de matériel…", texteLien: "Écrire à l'accueil", lien: "mailto:golf@chateaularcgolfclub.com" },
];

// ─── Contact · Venir au domaine ───

/** Surtitre */
export const CONTACT_VENIR_SURTITRE = "Nous trouver";

/** Titre */
export const CONTACT_VENIR_TITRE = "Venir au domaine";

/** Horaires */
export const CONTACT_VENIR_HORAIRES = "Tous les jours · horaires à confirmer par le club";

/** Bouton */
export const CONTACT_VENIR_BOUTON = "Itinéraire";

/** Photo */
export const CONTACT_VENIR_IMAGE = "/images/hp-academie.png";

// ─── Confidentialité · Bannière ───

/** Surtitre */
export const CONFIDENTIALITE_SURTITRE = "Données personnelles";

/** Titre */
export const CONFIDENTIALITE_TITRE = "Politique de confidentialité";

/** Texte */
export const CONFIDENTIALITE_TEXTE = "Comment le Château l'Arc Golf Club utilise, conserve et protège les données que vous lui confiez, et comment exercer vos droits.";

/** Date de mise à jour */
export const CONFIDENTIALITE_MISE_A_JOUR = "octobre 2026";

/** Sommaire */
export const CONFIDENTIALITE_SOMMAIRE = [
  "Utilisation et conservation",
  "Consentement et traitement",
  "Retrait du consentement",
  "Droit d'accès",
  "Abonnements et préférences",
];

// ─── Confidentialité · Utilisation et conservation ───

/** Titre */
export const CONFIDENTIALITE_UTILISATION_TITRE = "Utilisation et conservation de vos données personnelles";

/** Texte */
export const CONFIDENTIALITE_UTILISATION_TEXTE = `Les informations recueillies sur ce site internet sont enregistrées dans une base de données. Elles sont conservées pendant 10 ans et sont destinées à des fins d'exploitation pour notre structure : traitement des demandes via les formulaires de contact, inscriptions aux compétitions, gestion des départs et résultats de compétitions, alertes par e-mail, etc.

Cette base de données est accessible uniquement par la direction et ses collaborateurs habilités. Conformément à la loi « Informatique et Libertés », vous pouvez exercer votre droit d'accès aux données vous concernant et les faire rectifier en nous contactant :`;

// ─── Confidentialité · Nous contacter ───

/** Moyens de contact */
export const CONFIDENTIALITE_CONTACTS = [
  { titre: "Par courrier", texte: "À la Direction, en recommandé avec accusé de réception" },
  { titre: "Sur place", texte: "À notre siège social, avec une pièce d'identité valable. Vous pouvez vous faire accompagner et demander une copie de vos données." },
  { titre: "Par e-mail", texte: "Sur notre adresse générale : golf@chateaularcgolfclub.com" },
];

// ─── Confidentialité · Consentement et traitement ───

/** Titre */
export const CONFIDENTIALITE_CONSENTEMENT_TITRE = "Consentement et traitement de vos données personnelles";

/** Texte */
export const CONFIDENTIALITE_CONSENTEMENT_TEXTE = "Vos données personnelles ne seront jamais communiquées à des tiers. Vous autorisez explicitement le stockage et le traitement de vos données dans le but d'être informé sur nos services, à savoir :";

/** Liste */
export const CONFIDENTIALITE_CONSENTEMENT_LISTE = [
  "Les actualités de notre structure",
  "La réception de la newsletter d'informations",
  "L'envoi, par le service communication, d'informations personnalisées sur nos services et événements",
];

// ─── Confidentialité · Retrait du consentement ───

/** Titre */
export const CONFIDENTIALITE_RETRAIT_TITRE = "Retrait du consentement concernant vos données personnelles";

/** Sous-titre (droit d'accès) */
export const CONFIDENTIALITE_ACCES_TITRE = "Droit d'accès à vos données personnelles";

/** Texte (droit d'accès) */
export const CONFIDENTIALITE_ACCES_TEXTE = "Vous disposez d'un droit d'accès, de modification et/ou de suppression des données vous concernant à tout moment, en nous contactant :";

/** Délai de réponse */
export const CONFIDENTIALITE_DELAI = "Le ou les responsables de la base de données disposent d'un délai de réponse maximal de 2 mois à compter de la demande, qu'elle ait été exercée par voie postale ou sur place.";

/** Sous-titre (abonnements) */
export const CONFIDENTIALITE_ABONNEMENTS_TITRE = "Modification de vos abonnements et préférences";

/** Texte (abonnements) */
export const CONFIDENTIALITE_ABONNEMENTS_TEXTE = "Vous pouvez modifier librement vos abonnements à nos communications en cliquant sur les liens de désabonnement en bas de chacune de nos communications envoyées par e-mail (newsletter). Vous pouvez également nous contacter :";

// ─── Mentions légales · Bannière ───

/** Surtitre */
export const MENTIONS_SURTITRE = "Informations légales";

/** Titre */
export const MENTIONS_TITRE = "Mentions légales & Crédits";

/** Texte */
export const MENTIONS_TEXTE = "Les informations relatives à l'éditeur, à l'hébergement et à l'utilisation du site du Château l'Arc Golf Club.";

/** Date de mise à jour */
export const MENTIONS_MISE_A_JOUR = "octobre 2026";

// ─── Mentions légales · Informations générales ───

/** Titre */
export const MENTIONS_INFOS_TITRE = "Informations générales";

/** Informations */
export const MENTIONS_INFOS = [
  { libelle: "Directeur de la publication", valeur: "Philippe Laurent" },
  { libelle: "Hébergement du site", valeur: "Vercel Inc. · 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis" },
  { libelle: "Adresse", valeur: "Domaine Château l'Arc, 13710 Fuveau" },
  { libelle: "Téléphone", valeur: "+33 (0)4 42 29 83 41" },
  { libelle: "E-mail", valeur: "golf@chateaularcgolfclub.com" },
];

// ─── Mentions légales · Responsabilité ───

/** Titre */
export const MENTIONS_RESPONSABILITE_TITRE = "Responsabilité";

/** Texte */
export const MENTIONS_RESPONSABILITE_TEXTE = `Notre structure s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur ce site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu. Toutefois, notre structure ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.

En conséquence, notre structure décline toute responsabilité pour toute interruption du site, problèmes techniques, pour toute inexactitude ou omission sur des informations disponibles sur le site, pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition sur le site.`;

// ─── Mentions légales · Cookies ───

/** Titre */
export const MENTIONS_COOKIES_TITRE = "Utilisation des cookies";

/** Texte */
export const MENTIONS_COOKIES_TEXTE = "Ce site ne dépose aucun cookie publicitaire ni de réseau social. La fréquentation du site est mesurée de façon anonyme, sans cookie ni stockage dans votre navigateur. Seul un cookie technique, indispensable, est utilisé pour l'espace d'administration réservé à l'équipe du club.";

/** Encadré */
export const MENTIONS_COOKIES_NOTE = "Aucun cookie soumis à votre consentement : il n'y a donc pas de préférences à régler.";

// ─── Mentions légales · Propriété intellectuelle ───

/** Titre */
export const MENTIONS_PROPRIETE_TITRE = "Propriété intellectuelle";

/** Texte */
export const MENTIONS_PROPRIETE_TEXTE = `La reproduction de tous documents publiés sur ce site est seulement autorisée aux fins exclusives d'information pour un usage personnel et privé, toute reproduction et toute utilisation de copies réalisées à d'autres fins étant expressément interdites.

Tous les contenus, photographies et autres documents sur ce site sont la propriété de notre structure ou sont diffusés avec l'autorisation de leurs propriétaires, et sont soumis aux droits d'auteur et autres droits de propriété intellectuelle.

Les marques de commerce, logos et modèles présents sur ce site appartiennent à notre structure. Aucune interprétation ne peut être faite en faveur d'une licence d'utilisation ou d'un quelconque droit d'utiliser la marque affichée sur le site internet.

L'utilisation frauduleuse de la marque ou de tout autre contenu du site internet est totalement interdite. Il est notamment interdit de copier, reproduire, représenter, modifier et/ou exploiter, de quelque façon que ce soit et à quelque fin que ce soit, tout ou partie de la structure et du contenu du site. Notre structure vous informe qu'elle usera largement de ses droits de propriété intellectuelle pour engager des poursuites si nécessaire.`;

// ─── Mentions légales · Protection des données personnelles ───

/** Titre */
export const MENTIONS_DONNEES_TITRE = "Protection des données personnelles";

/** Texte */
export const MENTIONS_DONNEES_TEXTE = "Toute donnée personnelle que vous soumettez à notre structure, à l'occasion de toute requête, l'est de manière volontaire, consentie et en connaissance de cause. Les formulaires d'enregistrement contiennent d'une part des champs obligatoires (indiqués par un astérisque *), et d'autre part des champs facultatifs ; à défaut de compléter les champs obligatoires, notre structure ne pourra peut-être pas répondre à votre requête.";

/** Liste */
export const MENTIONS_DONNEES_LISTE = [
  "Notre structure n'utilisera pas vos données personnelles pour des communications non sollicitées.",
  "Sur demande, notre structure supprimera de sa base de données vos informations personnelles, annulant de ce fait votre enregistrement via le site web.",
  "Vous pouvez accéder à vos données personnelles et/ou demander qu'elles soient corrigées, modifiées ou effacées, par e-mail (via la page Contact) ou par courrier à notre adresse postale.",
];

// ─── Mentions légales · Crédits ───

/** Titre */
export const MENTIONS_CREDITS_TITRE = "Crédits";

/** Texte */
export const MENTIONS_CREDITS_TEXTE = "Le site web du Château l'Arc Golf Club a été conçu et développé par Orion Studio.";
