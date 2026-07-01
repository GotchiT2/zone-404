// API endpoint pour arrêter le timer quand la partie se termine
// (victoire ou défaite côté joueur). Authentifié par le game token.
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { validateGameToken } from '$lib/server/game-token';
import { broadcastToRoom } from '$lib/server/sse';
import { timerToDisplayEvent } from '$lib/server/timer';

export const POST: RequestHandler = async ({ request }) => {
	let body: { token: string; reason?: string };
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	const { token, reason } = body;

	if (!token) {
		throw error(400, 'Missing token');
	}

	// Valider le token
	const tokenData = await validateGameToken(token);
	if (!tokenData) {
		throw error(401, 'Invalid or expired token');
	}

	// Trouver la run courante avec son timer
	const currentRun = await prisma.run.findFirst({
		where: {
			id: tokenData.runId,
			endedAt: null
		},
		include: { timer: true }
	});

	if (!currentRun || !currentRun.timer) {
		return json({ success: false, message: 'No active run or timer' });
	}

	// Ne pauser que si le timer est en cours
	if (currentRun.timer.state !== 'RUNNING') {
		return json({ success: true, message: 'Timer already stopped', state: currentRun.timer.state });
	}

	// Mettre en pause le timer
	const updatedTimer = await prisma.runTimer.update({
		where: { id: currentRun.timer.id },
		data: {
			state: 'PAUSED',
			pausedAt: new Date()
		}
	});

	// Broadcaster via SSE pour que le GM voie le changement
	try {
		broadcastToRoom(tokenData.roomSlug, 'timer_state', timerToDisplayEvent(updatedTimer));
	} catch (err) {
		console.warn('Failed to broadcast timer pause:', err);
	}

	return json({
		success: true,
		reason: reason || 'unknown',
		state: updatedTimer.state
	});
};