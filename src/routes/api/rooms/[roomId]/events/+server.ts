// SSE endpoint for display screens (public displays showing timer and messages)
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { addSSEClient, removeSSEClient } from '$lib/server/sse';
import { timerToJSON, timerToDisplayEvent } from '$lib/server/timer';

export const GET: RequestHandler = async ({ params, url }) => {
	const { roomId } = params;
	const token = url.searchParams.get('token');

	if (!token) {
		throw error(401, 'Token required');
	}

	// Find the room
	const room = await prisma.room.findUnique({
		where: { slug: roomId }
	});

	if (!room) {
		throw error(404, 'Room not found');
	}

	// Verify token (for now, we'll use a simple check - you can enhance this)
	// TODO: Implement proper token verification if needed
	
	// Get current run
	const currentRun = await prisma.run.findFirst({
		where: {
			roomId: room.id,
			endedAt: null
		},
		include: {
			timer: true
		}
	});

	if (!currentRun) {
		throw error(404, 'No active run found');
	}

	// Create SSE stream using the existing SSE system
	let sseClient: any = null;
	
	const stream = new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder();
			
			// Register this client with the SSE system (uses roomId slug, not numeric ID)
			sseClient = addSSEClient(roomId, controller);
			
			// Send initial timer state
			if (currentRun.timer) {
				const timerEvent = timerToDisplayEvent(currentRun.timer);
				controller.enqueue(
					encoder.encode(`event: timer_state\ndata: ${JSON.stringify(timerEvent)}\n\n`)
				);
			}

			// Heartbeat to keep connection alive
			const heartbeat = setInterval(() => {
				try {
					controller.enqueue(encoder.encode(': heartbeat\n\n'));
				} catch (e) {
					clearInterval(heartbeat);
				}
			}, 30000);

			// Cleanup on disconnect
			return () => {
				clearInterval(heartbeat);
				if (sseClient) {
					removeSSEClient(sseClient);
				}
			};
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		}
	});
};
