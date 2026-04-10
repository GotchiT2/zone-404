// Configuration centralisée du jeu d'escape game
import type { AntidoteComponent, GameStage } from '$lib/types/escape-game';

/**
 * Configuration des étapes principales du jeu
 */
export const GAME_STAGES: GameStage[] = [
	{
		id: 'debug',
		name: 'Debug système',
		trialIndex: 1,
		description: 'Correction du bug dans le code d\'analyse'
	},
	{
		id: 'antidote',
		name: 'Synthèse de l\'antidote',
		trialIndex: 2, // Note: on utilise 2-11 pour les sous-composants
		description: 'Reconstitution de la formule de l\'antidote'
	}
];

/**
 * Configuration des 10 composants de l'antidote
 * 
 * IMPORTANT :
 * - Chaque composant correspond à un trial en DB (trialIndex 2 à 11)
 * - L'ordre des composants est important pour la validation
 * - Les réponses sont insensibles à la casse et trimées automatiquement
 * 
 * Pour modifier les réponses :
 * 1. Modifier le champ 'answer'
 * 2. Optionnel : ajouter ou modifier le 'hint'
 * 3. Vérifier que les trials correspondants existent en DB
 */
export const ANTIDOTE_COMPONENTS: AntidoteComponent[] = [
	{
		id: 1,
		label: 'Composant #1',
		answer: 'protéine',
		trialIndex: 2,
		hint: 'Structure de base des organismes vivants'
	},
	{
		id: 2,
		label: 'Composant #2',
		answer: 'enzyme',
		trialIndex: 3,
		hint: 'Catalyseur biologique'
	},
	{
		id: 3,
		label: 'Composant #3',
		answer: 'neurone',
		trialIndex: 4,
		hint: 'Cellule du système nerveux'
	},
	{
		id: 4,
		label: 'Composant #4',
		answer: 'anticorps',
		trialIndex: 5,
		hint: 'Défense immunitaire'
	},
	{
		id: 5,
		label: 'Composant #5',
		answer: 'cellule',
		trialIndex: 6,
		hint: 'Unité de base du vivant'
	},
	{
		id: 6,
		label: 'Composant #6',
		answer: 'sérum',
		trialIndex: 7,
		hint: 'Liquide sanguin'
	},
	{
		id: 7,
		label: 'Composant #7',
		answer: 'vaccin',
		trialIndex: 8,
		hint: 'Prévention des maladies'
	},
	{
		id: 8,
		label: 'Composant #8',
		answer: 'génome',
		trialIndex: 9,
		hint: 'Information génétique'
	},
	{
		id: 9,
		label: 'Composant #9',
		answer: 'molécule',
		trialIndex: 10,
		hint: 'Assemblage d\'atomes'
	},
	{
		id: 10,
		label: 'Composant #10',
		answer: 'antidote',
		trialIndex: 11,
		hint: 'Contre-poison'
	}
];

/**
 * Helper: Récupérer un composant par son ID
 */
export function getComponentById(id: number): AntidoteComponent | undefined {
	return ANTIDOTE_COMPONENTS.find(c => c.id === id);
}

/**
 * Helper: Récupérer un composant par son trial index
 */
export function getComponentByTrialIndex(trialIndex: number): AntidoteComponent | undefined {
	return ANTIDOTE_COMPONENTS.find(c => c.trialIndex === trialIndex);
}

/**
 * Helper: Valider une réponse pour un composant
 */
export function validateComponentAnswer(componentId: number, answer: string): boolean {
	const component = getComponentById(componentId);
	if (!component) return false;
	
	const normalized = answer.toLowerCase().trim();
	return normalized === component.answer;
}