import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { broadcastToRoom } from '$lib/server/sse';
import { setActiveMessage } from '$lib/server/active-messages';

const MAX_MESSAGE_LENGTH = 500;

export const POST: RequestHandler = async ({ params, request, locals }) => {
	// Vérifier l'authentification GM
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
		}
	});

	if (!currentRun) {
		throw error(400, 'No active session found');
	}

	// Parser le body
	const body = await request.json();
	const { text } = body;

	// Validation
	if (!text || typeof text !== 'string') {
		throw error(400, 'Message text is required');
	}

	const trimmedText = text.trim();

	if (trimmedText.length === 0) {
		throw error(400, 'Message cannot be empty');
	}

	if (trimmedText.length > MAX_MESSAGE_LENGTH) {
		throw error(400, `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
	}

	// Créer le message
	const message = await prisma.roomMessage.create({
		data: {
			roomId: room.id,
			runId: currentRun.id,
			text: trimmedText,
			createdBy: 'GM'
		}
	});

	// Marquer le message comme actif pour les displays
	setActiveMessage(roomId, message.text);
	
	// Broadcaster l'événement SSE aux clients GM
	broadcastToRoom(roomId, 'message_created', {
		id: message.id,
		text: message.text,
		createdBy: message.createdBy,
		createdAt: message.createdAt.toISOString()
	});
	
	// Broadcaster l'événement aux displays
	broadcastToRoom(roomId, 'display_message_created', {
		text: message.text,
		sentAt: message.createdAt.toISOString()
	});

	return json({
		success: true,
		message: {
			id: message.id,
			text: message.text,
			createdBy: message.createdBy,
			createdAt: message.createdAt.toISOString()
		}
	});
};
