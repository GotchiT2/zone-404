// API endpoint pour reprendre le timer (GM uniquement)
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { broadcastToRoom } from '$lib/server/sse';
import { timerToJSON, timerToDisplayEvent } from '$lib/server/timer';

export const POST: RequestHandler = async ({ params, locals }) => {
	// Vérifier l'authentification GM (session)
	if (!locals.isGMAuthenticated) {
		throw error(401, 'Unauthorized: GM session required');
	}

	const { roomId } = params;

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

	// Vérifier l'état du timer
	if (currentRun.timer.state !== 'PAUSED') {
		throw error(400, 'Timer is not paused');
	}

	if (!currentRun.timer.pausedAt) {
		throw error(400, 'Timer has no pause time recorded');
	}

	// Calculer la durée de la pause
	const now = new Date();
	const pauseDuration = now.getTime() - currentRun.timer.pausedAt.getTime();

	// Reprendre le timer en accumulant le temps de pause
	const updatedTimer = await prisma.runTimer.update({
		where: { id: currentRun.timer.id },
		data: {
			state: 'RUNNING',
			pausedAt: null,
			accumulatedPausedMs: currentRun.timer.accumulatedPausedMs + pauseDuration
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
