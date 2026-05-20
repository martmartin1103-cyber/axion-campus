export type Question = {
  id: string
  dimension: number
  dim_label: string
  question: string
  options: string[]
  correct: string
  points: number
}

export const QUESTIONS: Question[] = [
  { id:'d1q1', dimension:1, dim_label:'Maturité IA',
    question:"Un modèle de langage (LLM) comme Claude fonctionne principalement par :",
    options:["A — Recherche dans une base de réponses pré-enregistrées","B — Prédiction statistique du token suivant basée sur l'entraînement","C — Connexion en temps réel à Internet","D — Un ensemble de règles logiques programmées"],
    correct:'B', points:100 },
  { id:'d1q2', dimension:1, dim_label:'Maturité IA',
    question:"La principale limite actuelle des agents IA en contexte professionnel est :",
    options:["A — Ils consomment trop d'énergie","B — Ils ne traitent que du texte","C — Ils peuvent halluciner et nécessitent une supervision humaine","D — Ils sont trop lents"],
    correct:'C', points:100 },
  { id:'d2q1', dimension:2, dim_label:'Agentic Usage',
    question:"Un agent IA se distingue d'un simple chatbot par sa capacité à :",
    options:["A — Répondre en langage naturel","B — Agir de manière autonome sur des outils pour accomplir un objectif","C — Générer des images","D — Traduire des textes"],
    correct:'B', points:100 },
  { id:'d2q2', dimension:2, dim_label:'Agentic Usage',
    question:"Déléguer une tâche répétitive à un agent IA implique en premier :",
    options:["A — Acheter immédiatement un logiciel IA","B — Documenter précisément le processus actuel avant toute automatisation","C — Former tous les collaborateurs","D — Attendre que l'IA soit parfaite"],
    correct:'B', points:100 },
  { id:'d3q1', dimension:3, dim_label:'Gouvernance IA',
    question:"L'AI Act européen classe les systèmes d'IA selon :",
    options:["A — Leur coût de développement","B — Leur niveau de risque pour les droits fondamentaux","C — La nationalité de l'entreprise","D — La taille du modèle"],
    correct:'B', points:100 },
  { id:'d3q2', dimension:3, dim_label:'Gouvernance IA',
    question:"La supervision humaine (Human-in-the-loop) est essentielle car :",
    options:["A — L'IA est toujours trop lente sans supervision","B — Elle permet de détecter et corriger les erreurs avant impact","C — La loi l'impose pour tous les systèmes","D — Elle améliore la vitesse de l'IA"],
    correct:'B', points:100 },
  { id:'d4q1', dimension:4, dim_label:'ROI Thinking',
    question:"Pour évaluer le ROI d'une automatisation IA, la première étape est :",
    options:["A — Choisir le logiciel le plus populaire","B — Mesurer précisément le coût actuel de la tâche en temps et erreurs","C — Former immédiatement les équipes","D — Déployer sans indicateurs"],
    correct:'B', points:100 },
  { id:'d4q2', dimension:4, dim_label:'ROI Thinking',
    question:"Un projet IA qui automatise 80% d'une tâche mais dégrade la qualité de 30% est :",
    options:["A — Un succès car le gain de temps est supérieur","B — À stopper immédiatement","C — À évaluer globalement en intégrant le coût de la perte de qualité","D — Normal au début"],
    correct:'C', points:100 },
  { id:'d5q1', dimension:5, dim_label:'Transformation',
    question:"La résistance au changement lors d'un déploiement IA est principalement due à :",
    options:["A — Un manque de budget","B — La peur de la perte de contrôle et d'emploi","C — L'incompatibilité technique","D — Des problèmes de connexion"],
    correct:'B', points:100 },
  { id:'d5q2', dimension:5, dim_label:'Transformation',
    question:"Avant de déployer un outil IA dans une équipe, la première chose à faire est :",
    options:["A — Imposer l'outil par directive","B — Tester secrètement sur un petit groupe","C — Communiquer clairement les objectifs et impliquer les équipes dès le départ","D — Attendre que tous le demandent"],
    correct:'C', points:100 },
]