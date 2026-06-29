import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { broadcastToRoom } from '$lib/server/sse';

export const POST: RequestHandler = async ({ params, request }) => {
	const { roomId } = params;

	try {
		const body = await request.json();
		const { errorIncrement } = body;

		// Récupérer la run active de la salle
		const room = await prisma.room.findUnique({
			where: { slug: roomId },
			include: {
				runs: {
					where: { endedAt: null },
					orderBy: { startedAt: 'desc' },
					take: 1
				}
			}
		});

		if (!room || room.runs.length === 0) {
			throw error(404, 'No active run found for this room');
		}

		const run = room.runs[0];

		// Si errorIncrement est fourni, incrémenter le nombre d'erreurs
		// et déduire 50 millions de la population
		if (typeof errorIncrement === 'number' && errorIncrement > 0) {
			const deduction = BigInt(50_000_000) * BigInt(errorIncrement);
			
			await prisma.run.update({
				where: { id: run.id },
				data: {
					errorCount: { increment: errorIncrement },
					survivors: {
						decrement: deduction
					}
				}
			});
		}

		// Récupérer les données mises à jour
		const updatedRun = await prisma.run.findUnique({
			where: { id: run.id }
		});

		// Broadcaster les nouvelles valeurs via SSE
		if (updatedRun) {
			broadcastToRoom(roomId, 'population_update', {
				survivors: updatedRun.survivors.toString(),
				errorCount: updatedRun.errorCount
			});
		}

		return json({
			success: true,
			survivors: updatedRun?.survivors.toString(),
			errorCount: updatedRun?.errorCount
		});
	} catch (err) {
		console.error('Error updating population:', err);
		throw error(500, 'Failed to update population');
	}
};
