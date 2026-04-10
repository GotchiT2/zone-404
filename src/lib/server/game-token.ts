// Utilitaire pour valider les tokens d'accès au jeu
import { prisma } from '$lib/server/prisma';

export interface GameTokenData {
	roomId: number;
	runId: number;
	roomSlug: string;
	roomName: string;
}

/**
 * Valide un token de jeu et retourne les données associées
 * 
 * Pour l'instant : validation mockée simple
 * À terme : validation via la DB, JWT, ou autre mécanisme
 */
export async function validateGameToken(token: string): Promise<GameTokenData | null> {
	// TODO: Remplacer par une vraie logique de validation
	// Exemples possibles :
	// - Vérifier le token dans une table dédiée en DB
	// - Décoder et vérifier un JWT
	// - Vérifier contre une variable d'environnement
	
	// MOCK : Pour tester, accepter le format "room-{slug}-run-{runId}"
	// Exemple : "room-salle-1-run-123"
	const mockPattern = /^room-(.+)-run-(\d+)$/;
	const match = token.match(mockPattern);
	
	if (!match) {
		return null;
	}
	
	const roomSlug = match[1];
	const runId = parseInt(match[2], 10);
	
	// Vérifier que la room existe
	const room = await prisma.room.findUnique({
		where: { slug: roomSlug }
	});
	
	if (!room) {
		return null;
	}
	
	// Vérifier que le run existe et est actif
	const run = await prisma.run.findFirst({
		where: {
			id: runId,
			roomId: room.id,
			endedAt: null // Run doit être active
		}
	});
	
	if (!run) {
		return null;
	}
	
	return {
		roomId: room.id,
		runId: run.id,
		roomSlug: room.slug,
		roomName: room.name
	};
}