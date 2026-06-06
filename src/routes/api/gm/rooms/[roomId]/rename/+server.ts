// API endpoint pour renommer une salle (GM uniquement)
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { broadcastToRoom } from '$lib/server/sse';

const MAX_NAME_LENGTH = 50;

export const POST: RequestHandler = async ({ params, request, locals }) => {
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

	// Parser le body
	const body = await request.json();
	const { name } = body;

	// Validation
	if (!name || typeof name !== 'string') {
		throw error(400, 'Room name is required');
	}

	const trimmedName = name.trim();

	if (trimmedName.length === 0) {
		throw error(400, 'Room name cannot be empty');
	}

	if (trimmedName.length > MAX_NAME_LENGTH) {
		throw error(400, `Room name cannot exceed ${MAX_NAME_LENGTH} characters`);
	}

	// Mettre à jour le nom de la salle
	const updatedRoom = await prisma.room.update({
		where: { id: room.id },
		data: { name: trimmedName }
	});

	// Broadcaster le changement aux autres clients GM connectés
	broadcastToRoom(roomId, 'room_renamed', {
		roomId,
		name: updatedRoom.name
	});

	return json({
		success: true,
		roomId,
		name: updatedRoom.name
	});
};
