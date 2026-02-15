// API endpoint pour valider/dévalider manuellement une épreuve (GM uniquement)
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { broadcastToRoom } from '$lib/server/sse';

export const POST: RequestHandler = async ({ request, params, locals }) => {
	// Vérifier l'authentification GM (session)
	console.log('GM Authenticated:', request, params, locals, locals.isGMAuthenticated);
	if (!locals.isGMAuthenticated) {
		throw error(401, 'Unauthorized: GM session required');
	}

	const { roomId, index } = params;
	const trialIndex = parseInt(index, 10);

	if (isNaN(trialIndex)) {
		throw error(400, 'Invalid trial index');
	}

	// Lire le body
	let body: { validated: boolean };
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	if (typeof body.validated !== 'boolean') {
		throw error(400, 'Missing or invalid "validated" field');
	}

	// Trouver la salle
	const room = await prisma.room.findUnique({
		where: { slug: roomId }
	});

	if (!room) {
		throw error(404, 'Room not found');
	}

	// Trouver l'épreuve
	const trial = await prisma.trial.findUnique({
		where: {
			roomId_index: {
				roomId: room.id,
				index: trialIndex
			}
		}
	});

	if (!trial) {
		throw error(404, 'Trial not found');
	}

	// Trouver la run courante
	const currentRun = await prisma.run.findFirst({
		where: {
			roomId: room.id,
			endedAt: null
		}
	});

	if (!currentRun) {
		throw error(404, 'No active run found');
	}

	// Mettre à jour le statut
	const status = await prisma.runTrialStatus.upsert({
		where: {
			runId_trialId: {
				runId: currentRun.id,
				trialId: trial.id
			}
		},
		update: {
			validated: body.validated,
			validatedAt: body.validated ? new Date() : null
		},
		create: {
			runId: currentRun.id,
			trialId: trial.id,
			validated: body.validated,
			validatedAt: body.validated ? new Date() : null
		}
	});

	// Broadcaster via SSE
	broadcastToRoom(roomId, 'trial_set', {
		roomId,
		runId: currentRun.id,
		index: trialIndex,
		validated: body.validated,
		validatedAt: status.validatedAt?.toISOString()
	});

	return json({
		success: true,
		roomId,
		trialIndex,
		validated: body.validated,
		validatedAt: status.validatedAt?.toISOString()
	});
};
