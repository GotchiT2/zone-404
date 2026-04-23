// SSE endpoint pour les mises à jour temps réel (GM uniquement)
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { addSSEClient, removeSSEClient, broadcastToRoom } from '$lib/server/sse';
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

	// Créer le stream SSE avec heartbeat
	let sseClient: any = null;
	let heartbeatInterval: NodeJS.Timeout | null = null;
	
	const stream = new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder();
			
			// Enregistrer ce client dans le système SSE
			sseClient = addSSEClient(roomId, controller);
			
			// Heartbeat pour maintenir la connexion active (toutes les 30s)
			heartbeatInterval = setInterval(() => {
				try {
					controller.enqueue(encoder.encode(': heartbeat\n\n'));
				} catch (e) {
					if (heartbeatInterval) clearInterval(heartbeatInterval);
				}
			}, 30000);
			
			// Envoyer un message de connexion
			controller.enqueue(encoder.encode(': connected\n\n'));
		},
		cancel() {
			if (heartbeatInterval) {
				clearInterval(heartbeatInterval);
			}
			if (sseClient) {
				removeSSEClient(sseClient);
			}
		}
	});

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
