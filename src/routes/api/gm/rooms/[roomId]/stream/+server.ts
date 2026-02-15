// SSE endpoint pour les mises à jour temps réel (GM uniquement)
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { createSSEStream, broadcastToRoom } from '$lib/server/sse';
import { timerToJSON } from '$lib/server/timer';

export const GET: RequestHandler = async ({ params, locals }) => {
	// Vérifier l'authentification GM (session)
	if (!locals.isGMAuthenticated) {
		throw error(401, 'Unauthorized: GM session required');
	}

	const { roomId } = params;

	// Vérifier que la salle existe
	const room = await prisma.room.findUnique({
		where: { slug: roomId }
	});

	if (!room) {
		throw error(404, 'Room not found');
	}

	// Créer le stream SSE
	const stream = createSSEStream(roomId);

	// Envoyer l'état initial
	const currentRun = await prisma.run.findFirst({
		where: {
			roomId: room.id,
			endedAt: null
		},
		include: {
			timer: true,
			statuses: {
				include: {
					trial: true
				}
			}
		}
	});

	if (currentRun) {
		const trials = currentRun.statuses
			.map(s => ({
				index: s.trial.index,
				label: s.trial.label,
				validated: s.validated,
				validatedAt: s.validatedAt?.toISOString()
			}))
			.sort((a, b) => a.index - b.index);

		// Envoyer l'état initial via le stream
		const encoder = new TextEncoder();
		const initialState = {
			type: 'state',
			roomId,
			runId: currentRun.id,
			trials,
			timer: currentRun.timer ? timerToJSON(currentRun.timer) : null
		};
		
		// Note: Le stream est déjà créé, on ne peut pas modifier le start() après coup
		// L'état initial sera envoyé via un événement distinct après la connexion
		setTimeout(() => {
			// Broadcaster l'état initial aux clients connectés
			broadcastToRoom(roomId, 'state', initialState);
		}, 100);
	}

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		}
	});
};
