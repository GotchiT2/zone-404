// API endpoint pour valider une étape du jeu escape game
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { validateGameToken } from '$lib/server/game-token';
import { broadcastToRoom } from '$lib/server/sse';

export const POST: RequestHandler = async ({ request }) => {
	// Lire le body
	let body: { token: string; trialIndex: number; validated: boolean };
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	const { token, trialIndex, validated } = body;

	// Validation des paramètres
	if (!token || typeof trialIndex !== 'number' || typeof validated !== 'boolean') {
		throw error(400, 'Missing or invalid parameters');
	}

	// Valider le token
	const tokenData = await validateGameToken(token);
	if (!tokenData) {
		throw error(401, 'Invalid or expired token');
	}

	// Trouver l'épreuve (trial) correspondante
	const trial = await prisma.trial.findUnique({
		where: {
			roomId_index: {
				roomId: tokenData.roomId,
				index: trialIndex
			}
		}
	});

	if (!trial) {
		throw error(404, 'Trial not found');
	}

	// Mettre à jour ou créer le statut de l'épreuve
	const status = await prisma.runTrialStatus.upsert({
		where: {
			runId_trialId: {
				runId: tokenData.runId,
				trialId: trial.id
			}
		},
		update: {
			validated: validated,
			validatedAt: validated ? new Date() : null
		},
		create: {
			runId: tokenData.runId,
			trialId: trial.id,
			validated: validated,
			validatedAt: validated ? new Date() : null
		}
	});

	// Broadcaster via SSE (optionnel)
	try {
		broadcastToRoom(tokenData.roomSlug, 'trial_set', {
			roomId: tokenData.roomSlug,
			runId: tokenData.runId,
			index: trialIndex,
			validated: validated,
			validatedAt: status.validatedAt?.toISOString()
		});
	} catch (err) {
		// Ne pas bloquer si le broadcast échoue
		console.warn('Failed to broadcast trial validation:', err);
	}

	return json({
		success: true,
		trialIndex,
		validated: validated,
		validatedAt: status.validatedAt?.toISOString()
	});
};