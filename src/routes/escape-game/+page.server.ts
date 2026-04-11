// Validation du token côté serveur avant d'afficher la page du jeu
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ url }) => {
	// Récupérer le token depuis les query params
	const token = url.searchParams.get('token');
	
	// Vérifier que le token est fourni
	if (!token) {
		throw error(401, {
			message: 'Accès non autorisé : token manquant'
		});
	}
	
	// Récupérer le token attendu depuis les variables d'environnement
	const expectedToken = env.ESCAPE_GAME_TOKEN;
	
	if (!expectedToken) {
		throw error(500, {
			message: 'Configuration serveur manquante : ESCAPE_GAME_TOKEN non défini'
		});
	}
	
	// Valider le token
	if (token !== expectedToken) {
		throw error(401, {
			message: 'Accès non autorisé : token invalide'
		});
	}
	
	// Token valide : retourner les données nécessaires au jeu
	return {
		token,
		isValid: true,
		roomName: 'Laboratoire Omega' // Nom par défaut pour l'affichage
	};
};