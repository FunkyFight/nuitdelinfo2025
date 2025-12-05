const titleQuestions = [
  "Que signifie l'acronyme NIRD ?",
  "Parmi les trois grands axes de NIRD, lequel ne fait pas partie de la démarche ?",
  "Pourquoi NIRD encourage-t-elle l'usage de systèmes comme GNU/Linux dans les établissements scolaires ?",
  "Dans le cadre de NIRD, qu'est-ce qu'un des objectifs de reconditionner des ordinateurs ?",
  "Selon la démarche, qui peut devenir acteur — et non seulement utilisateur — du numérique dans l'établissement scolaire ?",
  "Qu'est-ce que LaForgeEdu (la forge des communs numériques éducatifs) dans le cadre de NIRD ?",
  "Quel est l'un des avantages mis en avant par NIRD concernant l'usage de logiciels libres dans les établissements scolaires ?",
  "Que se passe-t-il dans la phase \"mobilisation\" de la démarche NIRD ?",
  "D'après la démarche, la transition vers un numérique durable passe aussi par :",
  "Quel est l'objectif global de NIRD dans les établissements scolaires ?",
]

const possibleAnswers = [
  [
    "Numérique Innovant, Réactif et Digital",
    "Numérique Inclusif, Responsable et Durable",
    "Numérique Intégré, Réutilisable et Documenté",
    "Numérique Interactif, Réduit et Décentralisé",
  ],
  [
    "Inclusion numérique et citoyenne",
    "Durabilité et sobriété",
    "Innovation commerciale et profit",
    "Responsabilité et émancipation numérique",
  ],
  [
    "Parce qu'il coûte plus cher et garantit la qualité",
    "Pour favoriser des systèmes libres, plus accessibles et pérennes",
    "Car il est imposé par la loi",
    "Parce qu'il nécessite du matériel récent uniquement",
  ],
  [
    "Les rendre uniquement utilisables pour des jeux",
    "Prolonger la durée de vie des machines et réduire les déchets électroniques",
    "Vendre les ordinateurs reconditionnés pour financer l'école",
    "Transformer des PC en consoles de jeux",
  ],
  [
    "Seulement les enseignants",
    "Les élèves aussi, en participant à des actions concrètes",
    "Les collectivités uniquement",
    "Les fournisseurs de logiciels propriétaires",
  ],
  [
    "Une entreprise commerciale vendant des licences",
    "Un espace collaboratif pour créer et partager des ressources éducatives libres",
    "Un magasin en ligne d'ordinateurs reconditionnés",
    "Un cours de programmation obligatoire",
  ],
  [
    "La dépendance accrue aux GAFAM",
    "La réduction des coûts liés aux licences logicielles",
    "L'obligation d'utiliser une connexion très rapide",
    "L'utilisation de matériel toujours récent",
  ],
  [
    "Installation immédiate de Linux sur tous les ordinateurs",
    "Sensibilisation de l'équipe éducative et direction à l'initiative",
    "Vente de matériels informatiques aux élèves",
    "Suppression complète des logiciels propriétaires",
  ],
  [
    "L'achat de nouveaux appareils tous les ans",
    "Le remplacement des ressources libres par des ressources propriétaires",
    "La formation des élèves et des enseignants à la culture numérique libre",
    "L'imposition d'un navigateur unique pour tous les élèves",
  ],
  [
    "Rendre l'école dépendante des grandes entreprises tech",
    "Faire du numérique un vecteur d'éducation, de solidarité, d'autonomie et de durabilité",
    "Remplacer tous les manuels papier par des contenus payants",
    "Supprimer toute utilisation d'ordinateurs par les élèves",
  ],
]

const goodAnswers = [1, 2, 1, 1, 1, 1, 1, 1, 2, 1]

const questionsFile = [
    { id: "base", showAnswer: false },
    { id: "question1", showAnswer: false },
    { id: "question1", showAnswer: true },
    { id: "stl1", showAnswer: false }
]

export { titleQuestions, possibleAnswers, goodAnswers, questionsFile }
