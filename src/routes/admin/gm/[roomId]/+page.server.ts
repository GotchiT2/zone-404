// Server-side data loading pour la page GM d'une salle
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { timerToJSON } from '$lib/server/timer';

export const load: PageServerLoad = async ({ params, locals }) => {
	// L'authentification est déjà vérifiée par hooks.server.ts
	if (!locals.isGMAuthenticated) {
		throw error(401, 'Unauthorized');
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
		include: {
			timer: true,
			statuses: {
				include: {
					trial: true
				}
			}
		}
	});

	if (!currentRun) {
		throw error(404, 'No active run found');
	}

	// Formater les données pour l'UI
	const trials = currentRun.statuses
		.map(s => ({
			index: s.trial.index,
			label: s.trial.label,
			validated: s.validated,
			validatedAt: s.validatedAt?.toISOString()
		}))
		.sort((a, b) => a.index - b.index);

	// Récupérer les messages de la session active
	const messages = await prisma.roomMessage.findMany({
		where: {
			roomId: room.id,
			runId: currentRun.id
		},
		orderBy: {
			createdAt: 'asc'
		}
	});

	return {
		roomId,
		roomName: room.name,
		runId: currentRun.id,
		trials,
		timer: currentRun.timer ? timerToJSON(currentRun.timer) : null,
		messages: messages.map(m => ({
			id: m.id,
			text: m.text,
			createdBy: m.createdBy,
			createdAt: m.createdAt.toISOString()
		}))
	};
};
