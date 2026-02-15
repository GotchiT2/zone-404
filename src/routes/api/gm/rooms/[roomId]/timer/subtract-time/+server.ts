// API endpoint pour retirer du temps au timer (GM uniquement)
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { broadcastToRoom } from '$lib/server/sse';
import { timerToJSON, timerToDisplayEvent } from '$lib/server/timer';

export const POST: RequestHandler = async ({ params, locals, request }) => {
	// Vérifier l'authentification GM (session)
	if (!locals.isGMAuthenticated) {
		throw error(401, 'Unauthorized: GM session required');
	}

	const { roomId } = params;
	
	// Lire le body pour obtenir le nombre de millisecondes à retirer
	const { ms } = await request.json();
	
	if (!ms || typeof ms !== 'number') {
		throw error(400, 'Missing or invalid ms parameter');
	}

	// Trouver la salle
	const room = await prisma.room.findUnique({
		where: { slug: roomId }
	});

	if (!room) {
		throw error(404, 'Room not found');
	}

	// Trouver la run courante
	const currentRun = await prisma.run.findFirst({
		where: {
			roomId: room.id,
			endedAt: null
		},
		include: { timer: true }
	});

	if (!currentRun) {
		throw error(404, 'No active run found');
	}

	if (!currentRun.timer) {
		throw error(404, 'No timer found for current run');
	}

	// Calculer la nouvelle durée (minimum 0)
	const newDuration = Math.max(0, currentRun.timer.durationMs - ms);

	// Retirer le temps de la durée du timer
	const updatedTimer = await prisma.runTimer.update({
		where: { id: currentRun.timer.id },
		data: {
			durationMs: newDuration
		}
	});

	// Broadcaster via SSE
	broadcastToRoom(roomId, 'timer_state', timerToDisplayEvent(updatedTimer));

	return json({
		success: true,
		roomId,
		timer: timerToJSON(updatedTimer)
	});
};