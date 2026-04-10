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
 * Configuration d'une étape du jeu
 */
export interface GameStage {
	id: string;
	name: string;
	trialIndex: number;
	description?: string;
}