// Server-side data loading pour le dashboard GM (toutes les salles)
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { timerToJSON } from '$lib/server/timer';

async function loadRoomData(roomSlug: string) {
	// Trouver la salle
	const room = await prisma.room.findUnique({
		where: { slug: roomSlug }
	});

	if (!room) {
		return null;
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
		return null;
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
		},
		take: 5 // Limiter aux 5 derniers messages pour le dashboard
	});

	return {
		roomId: roomSlug,
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
}

export const load: PageServerLoad = async ({ locals }) => {
	// L'authentification est déjà vérifiée par hooks.server.ts
	if (!locals.isGMAuthenticated) {
		throw error(401, 'Unauthorized');
	}

	// Charger les données des 3 salles en parallèle
	const [salle1, salle2, salle3] = await Promise.all([
		loadRoomData('salle-1'),
		loadRoomData('salle-2'),
		loadRoomData('salle-3')
	]);

	return {
		rooms: [
			salle1 || { roomId: 'salle-1', roomName: 'Tatoueur', error: 'No active run' },
			salle2 || { roomId: 'salle-2', roomName: 'Escape Kids', error: 'No active run' },
			salle3 || { roomId: 'salle-3', roomName: 'Laboratoire', error: 'No active run' }
		]
	};
};