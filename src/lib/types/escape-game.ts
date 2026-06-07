// Types pour le système d'escape game

/**
 * Configuration d'un composant de l'antidote
 */
export interface AntidoteComponent {
	id: number;
	label: string;
	answer: string;
	trialIndex: number;
	hint?: string;
}

/**
 * Élément recherchable dans la phase de synthèse de l'antidote.
 *
 * Tous les mots proposés dans les suggestions (bonnes réponses ET leurres)
 * sont des SearchableItem. Quand le joueur valide un mot, la modale affiche
 * son `image` et sa `description`.
 *
 * - isComponent: true  => le mot fait partie de l'antidote (bonne réponse)
 * - trialIndex          => requis si isComponent (synchro API, valeurs 2 à 11)
 */
export interface SearchableItem {
	/** Identifiant stable (slug) */
	id: string;
	/** Mot affiché et recherché (ex: "Protéine") */
	name: string;
	/** Chemin de la photo du produit (vide => placeholder affiché) */
	image: string;
	/** Petite description affichée dans la modale */
	description: string;
	/** true si l'élément fait partie de la formule de l'antidote */
	isComponent: boolean;
	/** Index du trial en base (requis uniquement si isComponent) */
	trialIndex?: number;
}

/**
 * Configuration d'une étape du jeu
 */
export interface GameStage {
	id: string;
	name: string;
	trialIndex: number;
	description?: string;
}