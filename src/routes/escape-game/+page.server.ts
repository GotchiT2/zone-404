// Validation du token côté serveur avant d'afficher la page du jeu
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { prisma } from '$lib/server/prisma';
import { validateGameToken } from '$lib/server/game-token';
import { calculateRemainingMsAt, formatTime } from '$lib/server/timer';
import { SEARCHABLE_ITEMS } from '$lib/toto/escape-game-config';

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

	// Reconstituer l'état de la partie pour reprendre au bon stade après un
	// rechargement (ou un redémarrage de l'ordinateur). La source de vérité est
	// la base : les épreuves validées sont stockées par run.
	let validatedTrials: number[] = [];
	let remainingTime: string | null = null;

	const tokenData = await validateGameToken(token);
	if (tokenData) {
		const statuses = await prisma.runTrialStatus.findMany({
			where: { runId: tokenData.runId, validated: true },
			include: { trial: true }
		});
		validatedTrials = statuses.map((s) => s.trial.index);

		// Si tous les composants de l'antidote sont validés, reconstituer le temps
		// restant affiché au moment de la dernière validation (pour l'écran de victoire).
		const antidoteTrials = SEARCHABLE_ITEMS
			.filter((i) => i.isComponent)
			.map((i) => i.trialIndex as number);
		const antidoteDone =
			antidoteTrials.length > 0 && antidoteTrials.every((t) => validatedTrials.includes(t));

		if (antidoteDone) {
			const lastValidatedAt = statuses
				.filter((s) => antidoteTrials.includes(s.trial.index) && s.validatedAt)
				.reduce<Date | null>(
					(max, s) => (!max || s.validatedAt! > max ? s.validatedAt! : max),
					null
				);

			const timer = await prisma.runTimer.findUnique({ where: { runId: tokenData.runId } });
			if (timer && lastValidatedAt) {
				remainingTime = formatTime(calculateRemainingMsAt(timer, lastValidatedAt.getTime()));
			}
		}
	}

	// Token valide : retourner les données nécessaires au jeu
	return {
		token,
		isValid: true,
		roomName: 'Laboratoire Omega', // Nom par défaut pour l'affichage
		validatedTrials,
		remainingTime
	};
};