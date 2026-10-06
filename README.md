# LexiDrive-fr

Application React Native / Expo pour les francophones qui souhaitent améliorer leur français écrit, leur vocabulaire et leur lecture à voix haute. Interface ivoire et terre cuite `#842E1B`, NativeWind, composants réutilisables et données locales. Sans compte, sans IA et sans serveur applicatif.

## Essayer dans Expo Go

Node.js 22 LTS est recommandé. Depuis le dossier du projet :

```sh
pnpm install
pnpm exec expo start --lan
```

Sur cette machine, les dépendances locales sont déjà préparées : `pnpm start` suffit dans un terminal ordinaire. Le téléphone et l’ordinateur doivent être sur le même réseau. Scanner le QR code avec Expo Go sur Android, ou avec l’appareil photo sur iPhone. Autoriser l’accès au réseau local si le système le demande.

Le projet utilise **Expo SDK 57**. La version d’Expo Go doit prendre en charge ce SDK. Voir les [instructions officielles de compatibilité](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/). Si le réseau local ne permet pas la connexion, `pnpm exec expo start --tunnel` est une alternative nécessitant Internet et l’installation de l’outil de tunnel.

Expo Go a besoin du serveur de développement pour charger le projet. Dans Expo Go, les médias peuvent encore être chargés depuis ce serveur lors de leur première utilisation. Dans une application compilée, tous les contenus et audios sont embarqués et les fonctions pédagogiques ne font aucun appel réseau. Pour une installation indépendante du serveur de développement et un démarrage garanti en mode avion, il faut produire un binaire Android/iOS. Les exports Metro fournis ne sont pas des APK ou des IPA.

## Ce qui est implémenté

- Accueil personnalisé, objectif quotidien en questions, séances et jours consécutifs.
- Diagnostic approfondi de 42 questions, couvrant sept compétences.
- **351 questions d’entraînement**, dont 216 exercices de conjugaison issus de tables explicites, et **78 questions d’évaluation** réservées au diagnostic et aux examens blancs. Chaque question possède une correction, une explication et une astuce.
- Homophones on/ont, ces/ses/c’est/s’est, a/à, et/est, son/sont, ou/où, ce/se, leur/leurs ; distinction en/on et déterminants ce/cet/cette/ces.
- **22 leçons** recherchables, marquage des leçons lues et exercices associés.
- **20 fiches de vocabulaire** avec sens, exemple et confusion à éviter.
- **8 dictées** avec audio intégré, pause, réécoute et comparaison mot à mot. Les accents sont pris en compte ; la casse et la ponctuation ne sont pas notées.
- **6 ateliers de rédaction généraux et 6 ateliers par niveau** : message, courriel, récit, argumentation, résumé et réclamation. Plan, brouillon sauvegardé, grille de relecture et modèle commenté.
- **8 textes de lecture à voix haute et 6 tâches orales par niveau**, paliers progressifs, conseils d’articulation, taille du texte réglable, chronomètre facultatif, enregistrement et réécoute sans analyse automatique.
- Bilans transversaux et avancés, carnet d’erreurs, profil par compétence et révisions espacées.
- Export de la progression en JSON, restauration validée et confirmation avant remplacement.
- Rappel quotidien **exportable au calendrier en .ics** avec récurrence et alarme. Ce n’est pas une notification native de l’application. Il faut importer le fichier dans le calendrier ; les alertes dépendent de ses réglages.

Le diagnostic couvre A1, A2, B1, B2, C1 et C2 avec une question par compétence et niveau. Son résultat est un **repère écrit provisoire**, non étalonné, et ne constitue pas un positionnement CECRL validé. L’application exige des seuils successifs : au moins 6 bonnes réponses sur 7 par palier, dont 2 sur 3 dans les bases de langue. Un score élevé sur des exercices faciles ne donne plus automatiquement un niveau avancé. Les anciennes données sont conservées, mais les anciens diagnostics affichent « À préciser ».

Le résultat du diagnostic est indépendant des scores d’entraînement et repose sur un instantané des réponses. Une question répétée est signalée comme déjà vue. La rédaction libre et l’expression orale ne sont jamais considérées comme évaluées automatiquement.

Six **examens blancs adaptés** comportent chacun 13 questions de langue, de lecture et d’écoute, puis une tâche de production écrite et une tâche orale. Les corrections des questions apparaissent seulement à la fin. Le bilan personnel exportable indique les activités et les scores corrigibles, sans délivrer de diplôme. Les tâches C1/C2 sont des adaptations pédagogiques et ne reproduisent pas intégralement les épreuves officielles.

Références : [grille CECRL du Conseil de l’Europe](https://www.coe.int/fr/web/portfolio/self-assessment-grid), [certifications de France Éducation international](https://www.france-education-international.fr/hub/diplomes-tests?langue=fr). Les textes, consignes, modèles et audios de l’application sont originaux.

Un espace **Astuces** propose les remplacements on/ont/en, a/à, est/et, son/sont, ces/ses, c’est/s’est, ainsi que des exemples audio pour les sons nasaux. Il distingue les règles utiles des graphies qui nécessitent une mémorisation. La barre mobile est fixée en bas sur toute la largeur, avec un fond continu dans la zone de sécurité.

## Architecture

- `src/domain` : modèles, estimation pédagogique, choix des exercices, révisions, comparaison de dictée et validation des sauvegardes. Aucune dépendance React Native.
- `src/application` : état de progression et orchestration des sauvegardes via une interface de repository injectée au démarrage.
- `src/infrastructure` : AsyncStorage, export de fichiers, calendrier local.
- `src/content` : leçons, questions, lexique, rédaction, dictées et lecture. Contenus originaux inclus dans le paquet.
- `src/presentation/atoms` : typographie, boutons, cartes, champs, icônes et indicateurs.
- `src/presentation/molecules` : assemblages de composants.
- `src/presentation/screens` : parcours et ateliers, assemblés dans la structure de navigation de `App.tsx`.

L’interface n’accède pas directement à AsyncStorage. Le domaine est testé indépendamment du stockage et de l’interface. Les brouillons sont conservés dès la saisie. Les résultats d’un quiz sont enregistrés à la fin de la séance ; quitter avant la fin ne conserve pas cette séance.

## Vérification

```sh
pnpm typecheck
pnpm test
pnpm export:web
pnpm export:mobile
```

Tests Playwright, pour la version web mobile et bureau :

```sh
pnpm exec playwright install chromium
pnpm export:web
ppnpm test:e2e
```

Par défaut, Playwright utilise Chrome système si disponible, sinon son Chromium installé. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` permet de préciser un chemin. Les tests couvrent le diagnostic, la persistance, la rédaction, la lecture, les leçons, les dictées et l’utilisation des contenus après coupure du réseau. Un navigateur et un serveur HTTP local doivent être autorisés dans l’environnement.

État de validation : TypeScript et les dix-sept tests du domaine passent. Les exports Metro web, Android et iOS ont été vérifiés. Les tests Playwright n’ont pas pu être exécutés ici : l’environnement interdit le lancement de Chrome et l’ouverture du port HTTP local. L’audio, le microphone, le partage de fichiers et l’import calendrier nécessitent une vérification sur téléphone ; une compilation réussie ne valide pas ces interactions natives.

## Parcours à vérifier sur ton téléphone

1. Entrer dans l’application, remplir le diagnostic et terminer une séance.
2. Fermer puis rouvrir le projet : vérifier le prénom et les résultats.
3. Écrire dans un atelier, changer d’écran puis retrouver le brouillon.
4. Écouter une dictée, la mettre en pause et afficher ses différences.
5. Lire un texte à voix haute, autoriser le microphone, arrêter puis réécouter.
6. Refuser le microphone : la lecture et le chronomètre doivent rester utilisables.
7. Exporter une sauvegarde, puis la restaurer à partir de son contenu.
8. Importer le rappel .ics dans le calendrier et vérifier son heure locale.

## Ajouter du contenu

Les questions et leçons sont générées par `scripts/build-content.py` dans deux fichiers JSON. Les tables de conjugaison sont explicites ; les variantes n’ont pas été produites par une IA embarquée.

```sh
python3 scripts/build-content.py
pnpm test
```

Chaque question doit avoir un identifiant unique, un `skill`, un `lessonId` existant, des choix distincts et une seule réponse non ambiguë. Ajouter les textes de lecture ou les sujets de rédaction dans `src/content/workshops.ts`, et les mots dans `src/content/lexicon.ts`.

Les fichiers WAV sont déjà fournis. Leur régénération facultative utilise la bibliothèque système eSpeak NG via `scripts/generate-audio.py`. Ils servent à des dictées d’entraînement et leur voix est synthétique. Les polices Inter embarquées sont accompagnées de leur licence OFL dans `assets/fonts/LICENSE.txt`.

Les données sont locales mais ne sont pas chiffrées par l’application. Aucune donnée n’est envoyée automatiquement. Un enregistrement de lecture est temporaire et n’est pas archivé dans le profil. Une suppression de l’application peut supprimer la progression : conserver une sauvegarde avant de désinstaller.

## Environnement de développement actuel

L’accès au registre npm était indisponible. Les dépendances préexistantes de cette machine ont été reliées au projet, sans modifier les autres projets. La configuration Metro active un traitement spécifique uniquement lorsqu’elle détecte le marqueur local `node_modules/.lexidrive-local-deps.json`. Une installation normale avec `pnpm install` n’utilise pas ces chemins.

Le gestionnaire retenu est **pnpm 10.17.1**. Un `pnpm-lock.yaml` portable a été résolu depuis les métadonnées locales, sans liens vers d’autres projets. Pour une installation normale, utiliser `pnpm install --frozen-lockfile`. Les dépendances de test déjà reliées dans ce workspace restent disponibles pour `pnpm start`.

La taille finale d’un APK/IPA n’est pas encore mesurée. Les contenus et médias sont embarqués, sans modèle d’IA.
