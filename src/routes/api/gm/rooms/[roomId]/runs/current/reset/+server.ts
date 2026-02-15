// API endpoint pour reset une run (GM uniquement)
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
		}
	});

	if (currentRun) {
		// Supprimer les messages de la run courante
		await prisma.roomMessage.deleteMany({
			where: { runId: currentRun.id }
		});
		
		// Terminer la run courante
		await prisma.run.update({
			where: { id: currentRun.id },
			data: { endedAt: new Date() }
		});
	}

	// Créer une nouvelle run
	const newRun = await prisma.run.create({
		data: {
			roomId: room.id
		}
	});

	// Récupérer toutes les épreuves de la salle
	const trials = await prisma.trial.findMany({
		where: { roomId: room.id },
		orderBy: { index: 'asc' }
	});

	// Créer les statuts pour toutes les épreuves (non validées)
	for (const trial of trials) {
		await prisma.runTrialStatus.create({
			data: {
				runId: newRun.id,
				trialId: trial.id,
				validated: false
			}
		});
	}

	// Créer le timer initial pour cette nouvelle run
	const newTimer = await prisma.runTimer.create({
		data: {
			runId: newRun.id,
			durationMs: room.defaultTimerDurationMs,
			state: 'IDLE'
		}
	});

	// Récupérer l'état complet pour broadcast
	const statuses = await prisma.runTrialStatus.findMany({
		where: { runId: newRun.id },
		include: { trial: true }
	});

	const trialsData = statuses.map(s => ({
		index: s.trial.index,
		label: s.trial.label,
		validated: s.validated,
		validatedAt: s.validatedAt?.toISOString()
	}));

	// Broadcaster via SSE
	broadcastToRoom(roomId, 'reset', {
		roomId,
		runId: newRun.id,
		trials: trialsData,
		timer: timerToJSON(newTimer)
	});
	
	// Broadcaster également timer_state pour la page display
	broadcastToRoom(roomId, 'timer_state', timerToDisplayEvent(newTimer));

	return json({
		success: true,
		roomId,
		runId: newRun.id,
		trials: trialsData,
		timer: timerToJSON(newTimer)
	});
};
