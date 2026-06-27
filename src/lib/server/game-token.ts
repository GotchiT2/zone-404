// Utilitaire pour valider les tokens d'accès au jeu
import { prisma } from '$lib/server/prisma';
import { env } from '$env/dynamic/private';

export interface GameTokenData {
	roomId: number;
	runId: number;
	roomSlug: string;
	roomName: string;
}

// Salle ciblée par l'interface joueur. Le front est figé sur "salle-3"
// (cf. TIMER_ROOM_ID dans la page et l'AntidoteStage). Surchargeable via env.
const DEFAULT_PLAYER_ROOM_SLUG = 'salle-3';

/**
 * Valide un token de jeu et retourne le run ACTIF courant de la salle.
 *
 * Important : le token sert uniquement d'authentification (secret partagé,
 * `ESCAPE_GAME_TOKEN`). Il n'identifie PAS un run précis : un nouveau run est
 * créé à chaque partie (reset GM), donc on résout toujours le run actif courant.
 * Sinon, après un reset, un token figé sur l'ancien run id deviendrait invalide
 * et la progression ne serait plus ni persistée ni diffusée au GM.
 */
export async function validateGameToken(token: string): Promise<GameTokenData | null> {
	// 1. Authentification : le token doit correspondre au secret configuré.
	const expectedToken = env.ESCAPE_GAME_TOKEN;
	if (!expectedToken || !token || token !== expectedToken) {
		return null;
	}

	// 2. Salle ciblée par le jeu. Le front joueur est mono-salle (salle-3), donc
	//    on résout toujours cette salle pour rester cohérent avec le timer/SSE
	//    affichés côté joueur, quel que soit le contenu du token.
	const roomSlug = env.PLAYER_ROOM_SLUG || DEFAULT_PLAYER_ROOM_SLUG;

	const room = await prisma.room.findUnique({
		where: { slug: roomSlug }
	});

	if (!room) {
		return null;
	}

	// 3. Résoudre le run actif courant (non terminé) de la salle.
	const run = await prisma.run.findFirst({
		where: {
			roomId: room.id,
			endedAt: null // Run doit être active
		},
		orderBy: { startedAt: 'desc' }
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
