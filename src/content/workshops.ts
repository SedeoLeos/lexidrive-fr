import certificationContent from "./certifications.json";
const baseWritingPrompts = [
  {
    id: "message",
    level: "Fondations",
    title: "Un message clair",
    duration: 5,
    instruction:
      "Écris à un ami pour déplacer un rendez-vous. Explique la raison, propose une nouvelle date et demande sa confirmation.",
    min: 35,
    plan: [
      "Annonce le changement.",
      "Explique brièvement la raison.",
      "Propose une date et termine par une question.",
    ],
    model:
      "Bonjour Sami, je dois déplacer notre rendez-vous de jeudi, car j’ai une réunion professionnelle. Serais-tu disponible vendredi à dix-sept heures ? Nous pourrions nous retrouver au même endroit. Merci de me confirmer si cet horaire te convient.",
    notes:
      "Le message annonce son objectif dès le début. « Car » introduit la raison. La question propose une solution précise.",
  },
  {
    id: "mail",
    level: "Consolidation",
    title: "Un courriel professionnel",
    duration: 10,
    instruction:
      "Demande des informations sur un atelier de français : horaires, tarif et modalités d’inscription. Adopte un ton poli.",
    min: 60,
    plan: [
      "Choisis un objet précis.",
      "Présente le motif de ton message.",
      "Formule trois questions claires.",
      "Remercie et signe.",
    ],
    model:
      "Objet : Demande d’informations sur l’atelier de français\n\nMadame, Monsieur,\nJe souhaite participer à votre atelier de français afin d’améliorer mon expression écrite. Pourriez-vous m’indiquer les horaires des séances, le tarif et les modalités d’inscription ? Je souhaiterais également savoir si les supports pédagogiques sont fournis.\nJe vous remercie de votre attention et reste disponible pour toute précision.\nCordialement,\nAlex",
    notes:
      "Le conditionnel « pourriez-vous » rend la demande polie. Les informations recherchées sont regroupées. Le registre reste simple et professionnel.",
  },
  {
    id: "recit",
    level: "Fondations",
    title: "Raconter un souvenir",
    duration: 10,
    instruction:
      "Raconte une fois où tu as appris quelque chose de difficile. Situe la scène, raconte les étapes et explique ce que tu en retiens.",
    min: 80,
    plan: [
      "Situe le moment et le lieu.",
      "Décris la difficulté.",
      "Raconte les actions dans l’ordre.",
      "Termine par ce que tu as appris.",
    ],
    model:
      "Lorsque j’étais au collège, je redoutais les dictées. Un soir, ma sœur m’a proposé de travailler avec elle. Nous avons choisi un court passage et relevé les mots difficiles. Elle me l’a ensuite dicté lentement. J’ai fait plusieurs erreurs, mais j’ai compris leurs causes. Après quelques semaines, je me sentais plus à l’aise. Cette expérience m’a appris que la régularité compte davantage que la peur de se tromper.",
    notes:
      "L’imparfait installe la situation et le passé composé raconte les événements. Les transitions permettent de suivre la progression.",
  },
  {
    id: "argument",
    level: "Maîtrise",
    title: "Défendre une idée",
    duration: 15,
    instruction:
      "Faut-il lire un peu chaque jour ? Défends ton point de vue avec deux arguments, un exemple et une nuance.",
    min: 120,
    plan: [
      "Présente ta position.",
      "Développe un premier argument et un exemple.",
      "Ajoute un second argument.",
      "Reconnais une limite.",
      "Conclus sans répéter tout le texte.",
    ],
    model:
      "Lire un peu chaque jour me semble une habitude utile. D’abord, la lecture enrichit le vocabulaire : les mots prennent sens dans des situations concrètes. Un récit permet, par exemple, de distinguer la crainte, l’inquiétude et la terreur. Ensuite, cette pratique favorise l’attention. Quelques pages lues avec soin peuvent offrir un moment de concentration dans une journée chargée. Cependant, chacun ne dispose pas du même temps ni du même accès aux livres. Il convient donc de proposer des objectifs souples et des supports variés. Un article, une nouvelle ou un texte audio accompagné de sa transcription peuvent constituer un point de départ. L’essentiel est de choisir une pratique accessible, régulière et plaisante, plutôt que de transformer la lecture en contrainte.",
    notes:
      "La position est annoncée. « D’abord », « ensuite » et « cependant » structurent les arguments et la nuance. La conclusion propose une approche concrète.",
  },
  {
    id: "resume",
    level: "Maîtrise",
    title: "Résumer sans déformer",
    duration: 12,
    instruction:
      "Résume en 50 à 70 mots le texte suivant, sans ajouter d’opinion : Une bibliothèque de quartier ouvre désormais deux soirs par semaine jusqu’à vingt heures. Cette expérimentation dure trois mois. Elle vise à accueillir les personnes qui travaillent en journée. Les responsables observeront la fréquentation et recueilleront les avis avant de décider de maintenir ces horaires. Les services habituels restent disponibles.",
    min: 50,
    plan: [
      "Repère la mesure, sa durée et son objectif.",
      "Conserve les modalités d’évaluation.",
      "Reformule avec tes propres mots.",
      "Vérifie que tu n’as ajouté aucun fait.",
    ],
    model:
      "Pendant trois mois, une bibliothèque de quartier prolonge son ouverture jusqu’à vingt heures deux soirs par semaine, afin de faciliter la venue des personnes qui travaillent en journée. Les services habituels sont maintenus. La fréquentation et les avis des usagers permettront aux responsables de décider si ces nouveaux horaires seront conservés.",
    notes:
      "Le résumé garde la durée, la mesure, l’objectif et la décision conditionnée par une évaluation. Il ne présente pas la prolongation comme définitive.",
  },
  {
    id: "lettre",
    level: "Maîtrise",
    title: "Formuler une réclamation",
    duration: 15,
    instruction:
      "Un livre commandé est arrivé abîmé. Écris une réclamation factuelle et polie pour demander un remplacement.",
    min: 90,
    plan: [
      "Précise la commande et la date.",
      "Décris le problème sans exagération.",
      "Demande une solution concrète.",
      "Termine avec une formule adaptée.",
    ],
    model:
      "Madame, Monsieur,\nJe vous contacte au sujet du livre reçu le 12 septembre, correspondant à ma commande du 8 septembre. À l’ouverture du colis, j’ai constaté que la couverture était déchirée et que plusieurs pages étaient pliées.\nJe souhaiterais obtenir un exemplaire en bon état. Pourriez-vous m’indiquer la procédure de remplacement et les modalités de retour du livre endommagé ? Je peux vous transmettre des photographies si nécessaire.\nJe vous remercie de votre aide et vous prie d’agréer, Madame, Monsieur, mes salutations distinguées.",
    notes:
      "Le texte distingue les faits de la demande. Les dates permettent d’identifier la commande. Le ton reste courtois.",
  },
];
export const checklist = [
  "Mon texte répond au sujet et convient au destinataire.",
  "Mes idées suivent un ordre clair.",
  "Chaque paragraphe développe une idée.",
  "Mes phrases sont complètes et compréhensibles.",
  "J’ai vérifié les accords et les temps.",
  "J’ai vérifié les homophones et les accents.",
  "J’ai supprimé les répétitions inutiles.",
  "J’ai relu la ponctuation.",
];
const baseReadings = [
  {
    id: "r1",
    title: "Le premier pas",
    level: "Fondations",
    duration: 1,
    focus: "Lire doucement et terminer chaque phrase.",
    text: "Ce matin, Lina ouvre son cahier. Elle choisit une page et écrit la date. Son objectif est simple : apprendre une règle, puis l’utiliser. Elle hésite entre « on » et « ont ». Elle relit la phrase et essaie de remplacer le mot par « avaient ». Le doute disparaît. Lina sourit. Un petit progrès peut changer une journée.",
    advice: [
      "Marque une courte pause après chaque point.",
      "Articule « choisit », « objectif » et « disparaît ».",
      "Relis une seconde fois avec une voix naturelle.",
    ],
  },
  {
    id: "r2",
    title: "Une promenade attentive",
    level: "Fondations",
    duration: 2,
    focus: "Respecter les virgules et faire entendre les descriptions.",
    text: "Le chemin traverse un jardin calme. À gauche, de grands arbres protègent les bancs du soleil. À droite, une allée mène vers un petit bassin. Les enfants observent les poissons sans faire de bruit. Une femme s’arrête, ferme les yeux et écoute les oiseaux. Rien ne presse. Le jardin invite chacun à ralentir, à regarder et à respirer. Quand la promenade se termine, le visiteur emporte avec lui une impression de clarté.",
    advice: [
      "Après « À gauche » et « À droite », fais une petite pause.",
      "Distingue « bassin », « bancs » et « bruit ».",
      "Garde de l’air jusqu’à la fin de chaque phrase.",
    ],
  },
  {
    id: "r3",
    title: "La bibliothèque du quartier",
    level: "Consolidation",
    duration: 2,
    focus: "Faire les liaisons courantes et garder un débit régulier.",
    text: "Tous les mercredis, les habitants se retrouvent à la bibliothèque. Les uns cherchent un roman ; les autres préparent un examen. Au fond de la salle, une bénévole anime un atelier d’écriture. Elle propose des exercices courts, accueille les questions et rappelle que l’erreur fait partie de l’apprentissage. Les échanges sont parfois hésitants, mais chacun prend le temps d’écouter. Peu à peu, des idées se précisent et des phrases se construisent. Le lieu devient ainsi un espace de confiance, où les mots permettent de rencontrer les autres.",
    advice: [
      "Essaie les liaisons dans « les habitants » et « les autres ».",
      "Le point-virgule marque une pause, sans terminer complètement l’idée.",
      "Ne cherche pas la vitesse : cherche la continuité.",
    ],
  },
  {
    id: "r4",
    title: "Dire avec précision",
    level: "Consolidation",
    duration: 2,
    focus: "Mettre en relief les oppositions et les mots importants.",
    text: "Bien parler ne signifie pas parler longtemps. Une phrase courte peut exprimer une idée complexe, à condition de choisir les mots avec soin. Avant de répondre, il est parfois utile de faire une pause. Cette pause ne traduit pas nécessairement une hésitation : elle peut montrer que l’on réfléchit. De même, reformuler une question permet de vérifier qu’on l’a comprise. La précision se construit dans l’écoute autant que dans la parole. Elle demande de la patience, de l’attention et le courage de demander une explication lorsque le sens reste incertain.",
    advice: [
      "Souligne à la voix « courte », « complexe » et « avec soin ».",
      "Marque une pause avant l’explication qui suit les deux-points.",
      "Prononce distinctement « nécessairement » et « reformuler ».",
    ],
  },
  {
    id: "r5",
    title: "L’art de la nuance",
    level: "Maîtrise",
    duration: 3,
    focus: "Découper les phrases longues en groupes de sens.",
    text: "Dans une discussion, la nuance permet de défendre une conviction sans ignorer la complexité des faits. Affirmer qu’une méthode est utile ne revient pas à prétendre qu’elle convient à tout le monde. Il est donc souhaitable de préciser les circonstances dans lesquelles elle fonctionne, les difficultés qu’elle rencontre et les adaptations qu’elle exige. Une telle démarche ne fragilise pas nécessairement un argument ; elle peut, au contraire, le rendre plus crédible. En reconnaissant les limites de son point de vue, celui qui parle manifeste le souci d’être juste. La force d’un discours tient alors moins à la certitude affichée qu’à la qualité du raisonnement et à l’attention portée à ses interlocuteurs.",
    advice: [
      "Prépare une respiration avant les longues énumérations.",
      "Donne du relief à « au contraire » sans accélérer.",
      "Lis d’abord « interlocuteurs » lentement, puis dans la phrase.",
    ],
  },
  {
    id: "r6",
    title: "Une décision collective",
    level: "Maîtrise",
    duration: 3,
    focus: "Lire un texte soutenu avec naturel.",
    text: "Lorsqu’une décision concerne l’ensemble d’un quartier, la consultation des habitants peut enrichir la réflexion. Elle fait apparaître des besoins que les premières études n’avaient pas toujours identifiés : un passage trop étroit, un éclairage insuffisant ou un espace de repos éloigné des commerces. Toutefois, recueillir des avis ne suffit pas. Il faut également expliquer les contraintes, distinguer les priorités et rendre compte des choix retenus. La confiance se construit lorsque chacun comprend comment sa contribution a été examinée. Même en l’absence d’un accord unanime, une démarche transparente peut favoriser le dialogue et permettre à un projet commun de progresser.",
    advice: [
      "Fais une pause nette avant « Toutefois ».",
      "Sépare les trois exemples de l’énumération.",
      "Garde un ton de conversation, même avec un vocabulaire soutenu.",
    ],
  },
  {
    id: "r7",
    title: "Le plaisir de transmettre",
    level: "Consolidation",
    duration: 2,
    focus: "Articuler les consonnes et varier l’intonation.",
    text: "Transmettre un savoir commence souvent par une question : que comprend déjà la personne qui écoute ? À partir de cette réponse, on peut choisir un exemple, proposer un essai et observer ce qui reste difficile. Une explication trop rapide risque de laisser le lecteur à distance. Une explication patiente, en revanche, lui donne des repères. Elle ne simplifie pas tout ; elle rend le chemin visible. Le plaisir de transmettre naît parfois de ce moment discret où une phrase devient claire et où l’autre peut enfin dire : « J’ai compris. »",
    advice: [
      "Fais monter légèrement la voix sur la question.",
      "Articule « transmettre », « comprendre » et « repères ».",
      "Change doucement d’intonation pour la citation finale.",
    ],
  },
  {
    id: "r8",
    title: "La lettre oubliée",
    level: "Fondations",
    duration: 1,
    focus: "Raconter en faisant entendre les étapes.",
    text: "En rangeant une boîte, Sami trouve une ancienne lettre. Le papier est un peu froissé, mais les mots sont encore lisibles. Il reconnaît l’écriture de son grand-père. La lettre raconte une journée ordinaire : une visite, un repas, une rencontre. Sami la lit une première fois en silence. Puis il la lit à voix haute. Les phrases prennent un autre rythme. Il décide de garder la lettre et d’écrire, lui aussi, quelques lignes.",
    advice: [
      "Prends ton temps à chaque nouvelle étape.",
      "Distingue « lit », « lignes » et « lisibles ».",
      "Relis le dernier passage comme si tu racontais à un ami.",
    ],
  },
];
export const dictations = [
  {
    id: "d1",
    title: "On apprend",
    level: "Fondations",
    text: "On apprend chaque jour. Les élèves ont ouvert leurs cahiers. Ces exercices sont utiles.",
    tip: "Vérifie on/ont, ces/ses et le pluriel de cahiers.",
    audio: require("../../assets/audio/d1.wav"),
  },
  {
    id: "d2",
    title: "Le bon déterminant",
    level: "Fondations",
    text: "Cet arbre est grand. Cette maison est blanche. Ce livre appartient à ma sœur.",
    tip: "Arbre est masculin, maison est féminin. Pense à la ligature de sœur.",
    audio: require("../../assets/audio/d2.wav"),
  },
  {
    id: "d3",
    title: "Un rendez-vous",
    level: "Fondations",
    text: "Elle a rendez-vous à midi. Son frère est déjà arrivé. Ils sont prêts à partir.",
    tip: "Distingue a/à et son/sont. Prêts s’accorde avec ils.",
    audio: require("../../assets/audio/d3.wav"),
  },
  {
    id: "d4",
    title: "Une journée de lecture",
    level: "Consolidation",
    text: "Hier, nous avons choisi des livres à la bibliothèque. Les histoires étaient courtes, mais elles nous ont beaucoup plu.",
    tip: "Plu reste invariable : plaire se construit avec un complément indirect.",
    audio: require("../../assets/audio/d4.wav"),
  },
  {
    id: "d5",
    title: "Les lettres",
    level: "Consolidation",
    text: "Les lettres que Lina a écrites sont arrivées ce matin. Elle s’est appliquée à expliquer ses idées avec précision.",
    tip: "Écrites s’accorde avec les lettres, COD placé avant avoir. Arrivées s’accorde avec lettres.",
    audio: require("../../assets/audio/d5.wav"),
  },
  {
    id: "d6",
    title: "Progresser ensemble",
    level: "Maîtrise",
    text: "Bien que les premières séances soient exigeantes, chacun progresse à son rythme. Une pratique régulière permet de consolider les acquis et de gagner en assurance.",
    tip: "Bien que appelle le subjonctif : soient. Vérifie régulière et assurance.",
    audio: require("../../assets/audio/d6.wav"),
  },
  {
    id: "d7",
    title: "Le projet commun",
    level: "Maîtrise",
    text: "Cette proposition mérite un examen attentif. Cependant, les difficultés qu’elle soulève ne doivent pas être négligées. Il convient donc de préciser les moyens nécessaires à sa réalisation.",
    tip: "Négligées s’accorde avec difficultés. Nécessaires s’accorde avec moyens.",
    audio: require("../../assets/audio/d7.wav"),
  },
  {
    id: "d8",
    title: "Le carnet",
    level: "Consolidation",
    text: "Dans son carnet, Nora note les mots qu’elle souhaite retenir. Elle en vérifie le sens, puis rédige une phrase pour chacun.",
    tip: "En remplace ici un complément en de. Rédige prend un accent aigu.",
    audio: require("../../assets/audio/d8.wav"),
  },
];

export const writingPrompts = [
  ...baseWritingPrompts,
  ...certificationContent.map((e) => e.writing),
];
export const readings = [
  ...baseReadings,
  ...certificationContent.map((e) => e.oral),
];
