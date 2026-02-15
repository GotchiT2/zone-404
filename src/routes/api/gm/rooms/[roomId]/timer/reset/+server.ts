// API endpoint pour reset le timer (GM uniquement)
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

	// Reset le timer à l'état initial
	const updatedTimer = await prisma.runTimer.update({
		where: { id: currentRun.timer.id },
		data: {
			state: 'IDLE',
			startedAt: null,
			pausedAt: null,
			accumulatedPausedMs: 0,
			durationMs: room.defaultTimerDurationMs
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
